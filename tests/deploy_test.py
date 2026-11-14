import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('deploy',Path(__file__).resolve().parents[1]/'scripts/deploy_yandex.py')
d=importlib.util.module_from_spec(spec);spec.loader.exec_module(d)

class Missing(Exception):
    response={'Error':{'Code':'NoSuchKey'}}

class S3:
    def __init__(self):self.data={'catalog.js':b'old code','index.html':b'old page','untouched.txt':b'keep'};self.writes=[];self.fail=None
    def get_object(self,Bucket,Key):
        if Key not in self.data:raise Missing()
        return {'Body':io.BytesIO(self.data[Key]),'ETag':d.digest(self.data[Key]),'ContentType':'text/plain'}
    def put_object(self,Bucket,Key,Body,**headers):
        self.writes.append(Key)
        if self.fail==Key:self.fail=None;raise RuntimeError('Upload failed')
        self.data[Key]=Body

class DeployTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name)
        for name,body in {'catalog.js':b'new code','index.html':b'new page','product-data.js':b'new dependency'}.items():(self.root/name).write_bytes(body)
        self.client=S3()
        self.root_patch=patch.object(d,'ROOT',self.root);self.root_patch.start()
        self.files_patch=patch.object(d,'files',return_value=['product-data.js','catalog.js','index.html']);self.files_patch.start()
    def tearDown(self):self.root_patch.stop();self.files_patch.stop();self.temp.cleanup()
    def test_plan_has_no_writes_and_apply_is_non_destructive(self):
        d.plan(self.client,'vinoteka34.ru',self.root/'backup');self.assertEqual(self.client.writes,[])
        d.apply(self.client,'vinoteka34.ru',self.root/'backup')
        self.assertEqual(self.client.data['index.html'],b'new page');self.assertEqual(self.client.data['untouched.txt'],b'keep')
        self.assertEqual(self.client.writes[-1],'index.html')
    def test_failure_restores_prior_objects(self):
        d.plan(self.client,'vinoteka34.ru',self.root/'backup');self.client.fail='index.html'
        with self.assertRaises(RuntimeError):d.apply(self.client,'vinoteka34.ru',self.root/'backup')
        self.assertEqual(self.client.data['catalog.js'],b'old code');self.assertEqual(self.client.data['index.html'],b'old page')
    def test_external_change_aborts_before_any_upload(self):
        d.plan(self.client,'vinoteka34.ru',self.root/'backup');self.client.data['index.html']=b'other editor'
        with self.assertRaises(ValueError):d.apply(self.client,'vinoteka34.ru',self.root/'backup')
        self.assertEqual(self.client.writes,[])
    def test_unchanged_files_are_skipped(self):
        self.client.data.update({name:(self.root/name).read_bytes() for name in d.files()})
        d.plan(self.client,'vinoteka34.ru',self.root/'backup')
        self.assertEqual(json.loads((self.root/'backup/plan.json').read_text())['changes'],[])

if __name__=='__main__':unittest.main()
