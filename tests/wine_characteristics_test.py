import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('inventory_importer', Path(__file__).resolve().parents[1] / 'scripts/import_inventory.py')
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)


class WineCharacteristicsRetentionTest(unittest.TestCase):
    def setUp(self):
        self.previous = dict(type='wine', color='белое', year=2023, inventory_key='same-wine',
                             grape='Шардоне', aroma='Цитрусовые ноты', taste='Свежий', pairing='Рыба',
                             price=100, image='old.jpg')
        self.product = dict(type='wine', color='белое', year=2023, inventory_key='same-wine',
                            price=200, image='reviewed-new.jpg')

    def test_exact_inventory_refresh_keeps_notes_and_new_price_and_photo(self):
        result = importer.preserve_wine_characteristics(self.product, self.previous)
        for field in ('grape', 'aroma', 'taste', 'pairing'):
            self.assertEqual(result[field], self.previous[field])
        self.assertEqual(result['price'], 200)
        self.assertEqual(result['image'], 'reviewed-new.jpg')

    def test_different_identity_vintage_or_category_does_not_inherit_notes(self):
        for change in ({'inventory_key': 'different-wine'}, {'year': 2024}, {'color': 'розовое'}, {'type': 'strong'}):
            with self.subTest(change=change):
                result = importer.preserve_wine_characteristics({**self.product, **change}, self.previous)
                self.assertNotIn('aroma', result)
                self.assertNotIn('grape', result)


if __name__ == '__main__':
    unittest.main()
