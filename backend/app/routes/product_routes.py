import os
import re
import uuid
import json
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from fastapi.responses import FileResponse

try:
    from backend.app.database.db import get_db, dict_from_row, dicts_from_rows
    from backend.app.schemas.schemas import ProductCreate, ProductUpdate
    from backend.app.auth.jwt_handler import get_current_admin
except ImportError:
    from app.database.db import get_db, dict_from_row, dicts_from_rows
    from app.schemas.schemas import ProductCreate, ProductUpdate
    from app.auth.jwt_handler import get_current_admin

router = APIRouter(prefix="/api/products", tags=["Products"])

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

def slugify(text: str) -> str:
    text = text.lower().strip()
    return re.sub(r'[\s_]+', '-', re.sub(r'[^\w\s-]', '', text))

@router.get("")
def get_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    size: Optional[str] = None,
    color: Optional[str] = None,
    rating: Optional[float] = None,
    in_stock: Optional[bool] = None,
    sort_by: Optional[str] = "newest", # "price_asc", "price_desc", "newest", "popular", "rating"
    is_featured: Optional[bool] = None,
    is_trending: Optional[bool] = None,
    is_new: Optional[bool] = None,
    is_bestseller: Optional[bool] = None,
    limit: int = 50,
    offset: int = 0
):
    with get_db() as conn:
        cursor = conn.cursor()
        
        query = """
            SELECT p.*, c.name as category_name, c.slug as category_slug,
                   (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) as primary_image
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        """
        params = []
        
        if search:
            query += " AND (p.name LIKE ? OR p.description LIKE ? OR p.fabric LIKE ? OR c.name LIKE ?)"
            s_param = f"%{search}%"
            params.extend([s_param, s_param, s_param, s_param])
            
        if category and category.lower() != "all":
            query += " AND (c.slug = ? OR c.name = ?)"
            params.extend([category, category])
            
        if min_price is not None:
            query += " AND p.discounted_price >= ?"
            params.append(min_price)
            
        if max_price is not None:
            query += " AND p.discounted_price <= ?"
            params.append(max_price)
            
        if rating is not None:
            query += " AND p.rating >= ?"
            params.append(rating)
            
        if in_stock:
            query += " AND p.stock > 0"
            
        if is_featured is not None:
            query += " AND p.is_featured = ?"
            params.append(1 if is_featured else 0)
            
        if is_trending is not None:
            query += " AND p.is_trending = ?"
            params.append(1 if is_trending else 0)
            
        if is_new is not None:
            query += " AND p.is_new = ?"
            params.append(1 if is_new else 0)
            
        if is_bestseller is not None:
            query += " AND p.is_bestseller = ?"
            params.append(1 if is_bestseller else 0)
            
        if size:
            query += " AND p.id IN (SELECT product_id FROM product_variants WHERE size = ?)"
            params.append(size)
            
        if color:
            query += " AND p.id IN (SELECT product_id FROM product_variants WHERE color LIKE ?)"
            params.append(f"%{color}%")
            
        # Sorting
        if sort_by == "price_asc":
            query += " ORDER BY p.discounted_price ASC"
        elif sort_by == "price_desc":
            query += " ORDER BY p.discounted_price DESC"
        elif sort_by == "rating":
            query += " ORDER BY p.rating DESC, p.reviews_count DESC"
        elif sort_by == "popular":
            query += " ORDER BY p.is_bestseller DESC, p.reviews_count DESC"
        else: # newest
            query += " ORDER BY p.id DESC"
            
        query += " LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        
        cursor.execute(query, tuple(params))
        products = dicts_from_rows(cursor.fetchall())
        
        # Attach available sizes and primary image fallback
        for prod in products:
            cursor.execute("SELECT DISTINCT size FROM product_variants WHERE product_id = ?", (prod["id"],))
            prod["available_sizes"] = [r["size"] for r in cursor.fetchall()]
            if not prod["primary_image"]:
                prod["primary_image"] = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
        
        return products

@router.get("/featured-sections")
def get_featured_sections():
    with get_db() as conn:
        cursor = conn.cursor()
        
        def fetch_section(clause):
            q = f"""
                SELECT p.*, c.name as category_name, c.slug as category_slug,
                       (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) as primary_image
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE {clause}
                ORDER BY p.id DESC LIMIT 8
            """
            cursor.execute(q)
            rows = dicts_from_rows(cursor.fetchall())
            for r in rows:
                cursor.execute("SELECT DISTINCT size FROM product_variants WHERE product_id = ?", (r["id"],))
                r["available_sizes"] = [s["size"] for s in cursor.fetchall()]
                if not r["primary_image"]:
                    r["primary_image"] = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
            return rows

        return {
            "new_arrivals": fetch_section("p.is_new = 1"),
            "trending": fetch_section("p.is_trending = 1"),
            "bestsellers": fetch_section("p.is_bestseller = 1"),
            "special_offers": fetch_section("p.discount_percent >= 35")
        }

@router.get("/{id_or_slug}")
def get_product(id_or_slug: str):
    with get_db() as conn:
        cursor = conn.cursor()
        
        if id_or_slug.isdigit():
            cursor.execute("""
                SELECT p.*, c.name as category_name, c.slug as category_slug
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE p.id = ?
            """, (int(id_or_slug),))
        else:
            cursor.execute("""
                SELECT p.*, c.name as category_name, c.slug as category_slug
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE p.slug = ?
            """, (id_or_slug,))
            
        prod_row = cursor.fetchone()
        if not prod_row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        
        product = dict_from_row(prod_row)
        product_id = product["id"]
        
        # Product Images
        cursor.execute("SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC", (product_id,))
        images = dicts_from_rows(cursor.fetchall())
        if not images:
            images = [{"id": 0, "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", "is_primary": 1}]
        product["images"] = images
        
        # Variants
        cursor.execute("SELECT * FROM product_variants WHERE product_id = ?", (product_id,))
        variants = dicts_from_rows(cursor.fetchall())
        product["variants"] = variants
        
        # Reviews
        cursor.execute("SELECT * FROM reviews WHERE product_id = ? ORDER BY id DESC", (product_id,))
        reviews = dicts_from_rows(cursor.fetchall())
        for r in reviews:
            if r.get("images_json"):
                try:
                    r["images"] = json.loads(r["images_json"])
                except Exception:
                    r["images"] = []
            else:
                r["images"] = []
        product["reviews"] = reviews
        
        # Rating distribution
        distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        total_rev = len(reviews)
        for r in reviews:
            distribution[r["rating"]] = distribution.get(r["rating"], 0) + 1
        product["rating_distribution"] = {
            star: {"count": cnt, "percent": round((cnt / total_rev * 100), 1) if total_rev > 0 else 0}
            for star, cnt in distribution.items()
        }
        
        # Related products
        cursor.execute("""
            SELECT p.*, (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) as primary_image
            FROM products p
            WHERE p.category_id = ? AND p.id != ?
            LIMIT 4
        """, (product["category_id"], product_id))
        product["related_products"] = dicts_from_rows(cursor.fetchall())
        
        return product

@router.post("", status_code=status.HTTP_201_CREATED)
def create_product(data: ProductCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        
        slug = slugify(data.name) + "-" + uuid.uuid4().hex[:6]
        sku = data.sku or ("AUR-" + uuid.uuid4().hex[:8].upper())
        
        disc_pct = data.discount_percent
        if not disc_pct and data.original_price > data.discounted_price:
            disc_pct = int(round((data.original_price - data.discounted_price) / data.original_price * 100))
            
        cursor.execute("""
            INSERT INTO products (
                name, slug, description, category_id, original_price, discounted_price,
                discount_percent, stock, fabric, sku, is_featured, is_trending, is_new, is_bestseller
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.name, slug, data.description, data.category_id,
            data.original_price, data.discounted_price, disc_pct or 0,
            data.stock, data.fabric or "Cotton Blend", sku,
            1 if data.is_featured else 0, 1 if data.is_trending else 0,
            1 if data.is_new else 0, 1 if data.is_bestseller else 0
        ))
        product_id = cursor.lastrowid
        
        # Add images
        if data.images:
            for idx, img_url in enumerate(data.images):
                cursor.execute("""
                    INSERT INTO product_images (product_id, image_url, is_primary, display_order)
                    VALUES (?, ?, ?, ?)
                """, (product_id, img_url, 1 if idx == 0 else 0, idx))
        else:
            # Default placeholder image
            cursor.execute("""
                INSERT INTO product_images (product_id, image_url, is_primary, display_order)
                VALUES (?, ?, 1, 0)
            """, (product_id, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"))
            
        # Add variants
        if data.variants:
            for v in data.variants:
                cursor.execute("""
                    INSERT INTO product_variants (product_id, size, color, color_code, stock)
                    VALUES (?, ?, ?, ?, ?)
                """, (product_id, v.size, v.color, v.color_code, v.stock))
        else:
            # Default sizes
            for s in ["S", "M", "L", "XL"]:
                cursor.execute("""
                    INSERT INTO product_variants (product_id, size, color, color_code, stock)
                    VALUES (?, ?, 'Standard', '#2C1E1A', ?)
                """, (product_id, s, max(5, data.stock // 4)))
                
        # Update category count
        cursor.execute("UPDATE categories SET product_count = product_count + 1 WHERE id = ?", (data.category_id,))
        
        return {"id": product_id, "slug": slug, "message": "Product created successfully"}

@router.put("/{product_id}")
def update_product(product_id: int, data: ProductUpdate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, category_id FROM products WHERE id = ?", (product_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
            
        fields = []
        params = []
        if data.name is not None:
            fields.append("name = ?")
            params.append(data.name)
        if data.description is not None:
            fields.append("description = ?")
            params.append(data.description)
        if data.category_id is not None:
            fields.append("category_id = ?")
            params.append(data.category_id)
        if data.original_price is not None:
            fields.append("original_price = ?")
            params.append(data.original_price)
        if data.discounted_price is not None:
            fields.append("discounted_price = ?")
            params.append(data.discounted_price)
        if data.discount_percent is not None:
            fields.append("discount_percent = ?")
            params.append(data.discount_percent)
        if data.stock is not None:
            fields.append("stock = ?")
            params.append(data.stock)
        if data.fabric is not None:
            fields.append("fabric = ?")
            params.append(data.fabric)
        if data.sku is not None:
            fields.append("sku = ?")
            params.append(data.sku)
        if data.is_featured is not None:
            fields.append("is_featured = ?")
            params.append(1 if data.is_featured else 0)
        if data.is_trending is not None:
            fields.append("is_trending = ?")
            params.append(1 if data.is_trending else 0)
        if data.is_new is not None:
            fields.append("is_new = ?")
            params.append(1 if data.is_new else 0)
        if data.is_bestseller is not None:
            fields.append("is_bestseller = ?")
            params.append(1 if data.is_bestseller else 0)
            
        if fields:
            fields.append("updated_at = CURRENT_TIMESTAMP")
            params.append(product_id)
            cursor.execute(f"UPDATE products SET {', '.join(fields)} WHERE id = ?", tuple(params))
            
        if data.images is not None:
            cursor.execute("DELETE FROM product_images WHERE product_id = ?", (product_id,))
            for idx, img_url in enumerate(data.images):
                cursor.execute("""
                    INSERT INTO product_images (product_id, image_url, is_primary, display_order)
                    VALUES (?, ?, ?, ?)
                """, (product_id, img_url, 1 if idx == 0 else 0, idx))
                
        if data.variants is not None:
            cursor.execute("DELETE FROM product_variants WHERE product_id = ?", (product_id,))
            for v in data.variants:
                cursor.execute("""
                    INSERT INTO product_variants (product_id, size, color, color_code, stock)
                    VALUES (?, ?, ?, ?, ?)
                """, (product_id, v.size, v.color, v.color_code, v.stock))
                
        return {"message": "Product updated successfully"}

@router.delete("/{product_id}")
def delete_product(product_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT category_id FROM products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
            
        cat_id = row["category_id"]
        cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
        cursor.execute("UPDATE categories SET product_count = MAX(0, product_count - 1) WHERE id = ?", (cat_id,))
        
        return {"message": "Product deleted successfully"}

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), admin: dict = Depends(get_current_admin)):
    ext = os.path.splitext(file.filename)[1]
    if not ext:
        ext = ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    contents = await file.read()
    with open(dest_path, "wb") as f:
        f.write(contents)
        
    return {"url": f"/api/uploads/{unique_filename}"}
