from fastapi import APIRouter, HTTPException, status, Depends

try:
    from backend.app.database.db import get_db, dict_from_row, dicts_from_rows
    from backend.app.schemas.schemas import CouponCreate, CouponApply
    from backend.app.auth.jwt_handler import get_current_admin
except ImportError:
    from app.database.db import get_db, dict_from_row, dicts_from_rows
    from app.schemas.schemas import CouponCreate, CouponApply
    from app.auth.jwt_handler import get_current_admin

router = APIRouter(prefix="/api/coupons", tags=["Coupons"])

@router.get("/active")
def get_active_coupons():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT code, discount_type, discount_value, min_order_value, max_discount, expiry_date FROM coupons WHERE is_active = 1")
        return dicts_from_rows(cursor.fetchall())

@router.post("/apply")
def apply_coupon(data: CouponApply):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM coupons WHERE code = ? AND is_active = 1", (data.code.upper().strip(),))
        coupon_row = cursor.fetchone()
        if not coupon_row:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired coupon code")
            
        coupon = dict_from_row(coupon_row)
        if data.subtotal < coupon["min_order_value"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This coupon requires a minimum cart value of ₹{coupon['min_order_value']:.0f}"
            )
            
        discount = 0.0
        if coupon["discount_type"] == "percentage":
            discount = (data.subtotal * coupon["discount_value"]) / 100
            if coupon.get("max_discount"):
                discount = min(discount, coupon["max_discount"])
        else: # flat
            discount = min(coupon["discount_value"], data.subtotal)
            
        return {
            "valid": True,
            "code": coupon["code"],
            "discount_amount": round(discount, 2),
            "new_subtotal": round(max(0.0, data.subtotal - discount), 2),
            "message": f"Coupon '{coupon['code']}' applied! You saved ₹{discount:.2f}"
        }

@router.get("/admin/all")
def get_all_coupons(admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM coupons ORDER BY id DESC")
        return dicts_from_rows(cursor.fetchall())

@router.post("/admin", status_code=status.HTTP_201_CREATED)
def create_coupon(data: CouponCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        code = data.code.upper().strip()
        cursor.execute("SELECT id FROM coupons WHERE code = ?", (code,))
        if cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Coupon code already exists")
            
        cursor.execute("""
            INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount, expiry_date, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (code, data.discount_type, data.discount_value, data.min_order_value or 0, data.max_discount, data.expiry_date, 1 if data.is_active else 0))
        
        cid = cursor.lastrowid
        cursor.execute("SELECT * FROM coupons WHERE id = ?", (cid,))
        return dict_from_row(cursor.fetchone())

@router.delete("/admin/{coupon_id}")
def delete_coupon(coupon_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM coupons WHERE id = ?", (coupon_id,))
        return {"message": "Coupon deleted"}
