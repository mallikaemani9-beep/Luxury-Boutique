import os
import sys

_APP_DIR = os.path.dirname(os.path.abspath(__file__))
_BACKEND_DIR = os.path.dirname(_APP_DIR)
_PROJECT_ROOT = os.path.dirname(_BACKEND_DIR)

for _p in [_PROJECT_ROOT, _BACKEND_DIR, _APP_DIR]:
    if _p not in sys.path:
        sys.path.insert(0, _p)
