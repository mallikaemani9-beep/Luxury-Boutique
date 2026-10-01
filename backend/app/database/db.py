import sqlite3
import os
import sys
from contextlib import contextmanager

# Ensure paths are always resolvable
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(CURRENT_DIR)
BACKEND_DIR = os.path.dirname(APP_DIR)
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)

for p in [PROJECT_ROOT, BACKEND_DIR, APP_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Database path resolution: checks environment variable or defaults to backend/boutique.db
DB_PATH = os.getenv("BOUTIQUE_DB_PATH", os.path.abspath(os.path.join(BACKEND_DIR, "boutique.db")))

def get_db_connection():
    # Ensure directory exists
    db_dir = os.path.dirname(DB_PATH)
    if db_dir:
        os.makedirs(db_dir, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA journal_mode = WAL;")
    return conn

@contextmanager
def get_db():
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def dict_from_row(row):
    if row is None:
        return None
    return dict(row)

def dicts_from_rows(rows):
    return [dict(r) for r in rows]
