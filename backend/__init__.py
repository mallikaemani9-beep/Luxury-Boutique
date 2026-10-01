import os
import sys

_CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(_CURRENT_DIR)

for _p in [_PROJECT_ROOT, _CURRENT_DIR]:
    if _p not in sys.path:
        sys.path.insert(0, _p)
