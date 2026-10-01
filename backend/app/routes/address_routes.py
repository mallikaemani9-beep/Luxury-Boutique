from fastapi import APIRouter, HTTPException, status, Depends

try:
    from backend.app.database.db import get_db, dict_from_row, dicts_from_rows
    from backend.app.schemas.schemas import AddressCreate
    from backend.app.auth.jwt_handler import get_current_user
except ImportError:
    from app.database.db import get_db, dict_from_row, dicts_from_rows
    from app.schemas.schemas import AddressCreate
    from app.auth.jwt_handler import get_current_user

router = APIRouter(prefix="/api/addresses", tags=["Addresses"])

@router.get("")
def get_addresses(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC", (user_id,))
        return dicts_from_rows(cursor.fetchall())

@router.post("", status_code=status.HTTP_201_CREATED)
def create_address(data: AddressCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if first address, make it default
        cursor.execute("SELECT COUNT(*) as count FROM addresses WHERE user_id = ?", (user_id,))
        count = cursor.fetchone()["count"]
        is_def = 1 if (count == 0 or data.is_default) else 0
        
        if is_def:
            cursor.execute("UPDATE addresses SET is_default = 0 WHERE user_id = ?", (user_id,))
            
        cursor.execute("""
            INSERT INTO addresses (
                user_id, full_name, mobile_number, house_flat, street, area, city, district, state, pin_code, is_default, address_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id, data.full_name, data.mobile_number, data.house_flat,
            data.street, data.area, data.city, data.district, data.state,
            data.pin_code, is_def, data.address_type or "Home"
        ))
        addr_id = cursor.lastrowid
        cursor.execute("SELECT * FROM addresses WHERE id = ?", (addr_id,))
        return dict_from_row(cursor.fetchone())

@router.put("/{addr_id}")
def update_address(addr_id: int, data: AddressCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM addresses WHERE id = ? AND user_id = ?", (addr_id, user_id))
        if not cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")
            
        if data.is_default:
            cursor.execute("UPDATE addresses SET is_default = 0 WHERE user_id = ?", (user_id,))
            
        cursor.execute("""
            UPDATE addresses
            SET full_name = ?, mobile_number = ?, house_flat = ?, street = ?, area = ?,
                city = ?, district = ?, state = ?, pin_code = ?, is_default = ?, address_type = ?
            WHERE id = ? AND user_id = ?
        """, (
            data.full_name, data.mobile_number, data.house_flat, data.street, data.area,
            data.city, data.district, data.state, data.pin_code, 1 if data.is_default else 0,
            data.address_type, addr_id, user_id
        ))
        
        cursor.execute("SELECT * FROM addresses WHERE id = ?", (addr_id,))
        return dict_from_row(cursor.fetchone())

@router.delete("/{addr_id}")
def delete_address(addr_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM addresses WHERE id = ? AND user_id = ?", (addr_id, user_id))
        return {"message": "Address deleted successfully"}

@router.post("/{addr_id}/set-default")
def set_default_address(addr_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM addresses WHERE id = ? AND user_id = ?", (addr_id, user_id))
        if not cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")
            
        cursor.execute("UPDATE addresses SET is_default = 0 WHERE user_id = ?", (user_id,))
        cursor.execute("UPDATE addresses SET is_default = 1 WHERE id = ?", (addr_id,))
        return {"message": "Default address updated"}
