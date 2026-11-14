#!/usr/bin/env python3
"""Package only approved runtime files with a verified rollback baseline."""
import hashlib
import json
import subprocess
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
manifest_path = root / 'docs/release-stability-v1.json'
manifest = json.loads(manifest_path.read_text())
base = manifest['base_commit']
files = list(manifest['files'])

def original(path):
    return subprocess.run(['git', 'show', f'{base}:{path}'], cwd=root, capture_output=True)

for name in ('data/products.json', 'data/inventory.json', 'data/images.json'):
    before = original(name)
    if before.returncode or before.stdout != (root / name).read_bytes():
        raise SystemExit(f'Unexpected data change: {name}')
for name in files:
    manifest['files'][name] = hashlib.sha256((root / name).read_bytes()).hexdigest()
manifest['hosting'] = {'provider': 'Yandex Cloud Object Storage', 'bucket_from_history': 'vinoteka34.ru', 'direct_access_verified': False}
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
output = root.parent / 'VINOTEKA34_STABILITY_v1.zip'
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
    for name in files:
        archive.write(root / name, 'UPDATE/' + name)
        old = original(name)
        if old.returncode == 0:
            archive.writestr('ROLLBACK/' + name, old.stdout)
    archive.write(root / 'README.md', 'README.md')
    archive.write(root / 'docs/INSTALL_YANDEX.txt', 'INSTALL_YANDEX.txt')
    archive.write(manifest_path, 'release.json')
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    for name, digest in manifest['files'].items():
        assert hashlib.sha256(archive.read('UPDATE/' + name)).hexdigest() == digest
print(f'{output} ({output.stat().st_size} bytes)')
