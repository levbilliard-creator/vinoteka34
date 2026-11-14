#!/usr/bin/env python3
"""Generate valid JSON, including filenames containing quotes or backslashes."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
images = sorted(path.name for path in (root / 'assets/wines').iterdir() if path.is_file() and path.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'})
(root / 'data/images.json').write_text(json.dumps(images, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
