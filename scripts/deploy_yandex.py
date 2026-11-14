#!/usr/bin/env python3
"""Two-phase, non-destructive deployment of the existing static website."""
import argparse
import hashlib
import io
import json
import mimetypes
import os
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ['index.html','catalog.html','product.html','catalog/index.html','product/index.html','styles.css','app.js','product-data.js','catalog.js','product.js']
PUBLIC_ASSETS = {'.jpg','.jpeg','.png','.webp','.avif','.gif','.svg','.mp4','.woff','.woff2'}
BACKUP_HEADERS = ('ContentType','CacheControl','ContentEncoding','ContentDisposition','Metadata')

def digest(content):
    return hashlib.sha256(content).hexdigest()

def files():
    result = list(RUNTIME) + ['data/products-archive.json','data/products.json','data/images.json']
    for path in (ROOT / 'assets').rglob('*'):
        if path.is_file() and path.suffix.lower() in PUBLIC_ASSETS and not path.is_symlink():
            relative = path.relative_to(ROOT).as_posix()
            # Only assets referenced by the active pages or product catalog.
            if relative.startswith('assets/wines/') or relative in {'assets/hero.mp4','assets/img/hero.jpg','assets/favicon.svg','assets/product-placeholder.svg'}:
                result.append(relative)
    return sorted(result, key=lambda key: (key.endswith('.html'), key == 'index.html', key))

def missing(error):
    return str(getattr(error, 'response', {}).get('Error', {}).get('Code')) in {'404','NoSuchKey','NotFound'}

def fetch(client,bucket,key):
    try:
        response=client.get_object(Bucket=bucket,Key=key)
        body=response['Body'].read()
        return body, {k:response[k] for k in BACKUP_HEADERS if k in response}, response.get('ETag')
    except Exception as error:
        if missing(error): return None,{},None
        raise

def plan(client,bucket,output):
    output.mkdir(parents=True,exist_ok=True)
    changes=[]
    with zipfile.ZipFile(output/'rollback.zip','w',zipfile.ZIP_DEFLATED) as backup:
        for key in files():
            local=(ROOT/key).read_bytes()
            old,headers,etag=fetch(client,bucket,key)
            if old is not None and digest(old)==digest(local): continue
            if old is not None: backup.writestr(key,old)
            changes.append({'key':key,'sha256':digest(local),'before_etag':etag,'existed':old is not None,'headers':headers})
        backup.writestr('rollback-manifest.json',json.dumps({'bucket':bucket,'changes':changes},ensure_ascii=False))
    (output/'plan.json').write_text(json.dumps({'bucket':bucket,'changes':changes},ensure_ascii=False,indent=2))
    print(f'Prepared {len(changes)} changed objects. Backup ready; nothing uploaded.')

def rollback(client,bucket,archive,changes):
    # No deletes: new unreferenced objects remain harmless after restoring HTML.
    with zipfile.ZipFile(archive) as backup:
        for change in reversed(changes):
            if change['existed']:
                client.put_object(Bucket=bucket,Key=change['key'],Body=backup.read(change['key']),**change['headers'])

def apply(client,bucket,output):
    saved=json.loads((output/'plan.json').read_text())
    if saved['bucket'] != bucket: raise ValueError('Plan bucket mismatch')
    changes=saved['changes']
    # Verify all local files and live revisions before the first write.
    for change in changes:
        key=change['key']
        if digest((ROOT/key).read_bytes()) != change['sha256']: raise ValueError('Source changed after backup: '+key)
        _,_,etag=fetch(client,bucket,key)
        if etag!=change['before_etag']: raise ValueError('Bucket changed after backup: '+key)
    attempted=[]
    try:
        for change in changes:
            key=change['key'];content=(ROOT/key).read_bytes()
            content_type=mimetypes.guess_type(key)[0] or 'application/octet-stream'
            if content_type.startswith('text/') or key.endswith(('.js','.json','.svg')):content_type+='; charset=utf-8'
            cache='no-cache' if key.endswith(('.html','.js','.css','.json')) else 'public, max-age=3600'
            attempted.append(change)
            client.put_object(Bucket=bucket,Key=key,Body=content,ContentType=content_type,CacheControl=cache,Metadata={'sha256':change['sha256']})
            live,_,_=fetch(client,bucket,key)
            if digest(live)!=change['sha256']: raise RuntimeError('Upload verification failed: '+key)
            print('Verified: '+key)
    except Exception:
        print('Deployment failed. Restoring previous objects from the saved backup.')
        rollback(client,bucket,output/'rollback.zip',attempted)
        raise
    print(f'Deployment complete: {len(changes)} objects verified in {bucket}.')

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('mode',choices=['plan','apply','rollback'])
    parser.add_argument('--output',default='.deploy-work')
    args=parser.parse_args()
    bucket=os.environ.get('YC_BUCKET','vinoteka34.ru')
    if bucket!='vinoteka34.ru':raise SystemExit('This pipeline targets only vinoteka34.ru')
    import boto3
    from botocore.config import Config
    client=boto3.client('s3',endpoint_url='https://storage.yandexcloud.net',region_name='ru-central1',config=Config(signature_version='s3v4',s3={'addressing_style':'path'},retries={'max_attempts':3,'mode':'standard'}))
    output=ROOT/args.output
    if args.mode=='plan':plan(client,bucket,output)
    elif args.mode=='apply':apply(client,bucket,output)
    else:
        saved=json.loads((output/'plan.json').read_text())
        if saved['bucket']!=bucket:raise ValueError('Rollback bucket mismatch')
        rollback(client,bucket,output/'rollback.zip',saved['changes'])
        print('Existing objects restored. New objects were not deleted.')

if __name__=='__main__':main()
