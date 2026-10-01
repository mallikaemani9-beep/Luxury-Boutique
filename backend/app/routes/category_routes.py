from fastapi import APIRouter, HTTPException, status, Depends
import re

try:
    from backend.app.database.db import get_db, dict_from_row, dicts_from_rows
    from backend.app.schemas.schemas import CategoryCreate
    from backend.app.auth.jwt_handler import get_current_admin
except ImportError:
    from app.database.db import get_db, dict_from_row, dicts_from_rows
    from app.schemas.schemas import CategoryCreate
    from app.auth.jwt_handler import get_current_admin

router = APIRouter(prefix="/api/categories", tags=["Categories"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    return re.sub(r'[\s_]+', '-', re.sub(r'[^\w\s-]', '', text))

@router.get("")
def get_categories():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categories ORDER BY display_order ASC, name ASC")
        categories = dicts_from_rows(cursor.fetchall())
        return categories

@router.post("", status_code=status.HTTP_201_CREATED)
def create_category(data: CategoryCreate, admin: dict = Depends(get_current_admin)):
    slug = slugify(data.name)
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM categories WHERE slug = ?", (slug,))
        if cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists")
        
        cursor.execute("""
            INSERT INTO categories (name, slug, description, image_url, display_order)
            VALUES (?, ?, ?, ?, ?)
        """, (data.name, slug, data.description, data.image_url, data.display_order or 0))
        cat_id = cursor.lastrowid
        cursor.execute("SELECT * FROM categories WHERE id = ?", (cat_id,))
        return dict_from_row(cursor.fetchone())

@router.put("/{cat_id}")
def update_category(cat_id: int, data: CategoryCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM categories WHERE id = ?", (cat_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        
        cursor.execute("""
            UPDATE categories
            SET name = ?, description = ?, image_url = ?, display_order = ?
            WHERE id = ?
        """, (data.name, data.description, data.image_url, data.display_order, cat_id))
        
        cursor.execute("SELECT * FROM categories WHERE id = ?", (cat_id,))
        return dict_from_row(cursor.fetchone())

@router.delete("/{cat_id}")
def delete_category(cat_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM categories WHERE id = ?", (cat_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        
        cursor.execute("DELETE FROM categories WHERE id = ?", (cat_id,))
        return {"message": "Category deleted successfully"}
