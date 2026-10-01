from fastapi import APIRouter, HTTPException, status, Depends
from backend.app.database.db import get_db, dict_from_row
from backend.app.schemas.schemas import UserRegister, UserLogin, UserProfileUpdate, PasswordReset
from backend.app.auth.jwt_handler import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register")
def register(user_data: UserRegister):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?", (user_data.email,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email already exists"
            )
        
        hashed = hash_password(user_data.password)
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, role, phone)
            VALUES (?, ?, ?, ?, ?)
        """, (user_data.name, user_data.email, hashed, user_data.role or "customer", user_data.phone))
        
        user_id = cursor.lastrowid
        token = create_access_token({"sub": str(user_id), "email": user_data.email, "role": user_data.role or "customer"})
        
        # Welcome notification
        cursor.execute("""
            INSERT INTO notifications (user_id, title, message, type, link)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, "Welcome to Aura Atelier!", "Thank you for joining our boutique community. Enjoy 10% off your first purchase.", "promo", "/shop"))
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": user_data.name,
                "email": user_data.email,
                "role": user_data.role or "customer",
                "phone": user_data.phone,
                "avatar": None
            }
        }

@router.post("/login")
def login(creds: UserLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, password_hash, role, phone, avatar FROM users WHERE email = ?", (creds.email,))
        user_row = cursor.fetchone()
        
        if not user_row or not verify_password(creds.password, user_row["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = dict_from_row(user_row)
        user.pop("password_hash", None)
        token = create_access_token({"sub": str(user["id"]), "email": user["email"], "role": user["role"]})
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user
        }

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}

@router.put("/profile")
def update_profile(data: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.cursor()
        updates = []
        params = []
        if data.name is not None:
            updates.append("name = ?")
            params.append(data.name)
        if data.phone is not None:
            updates.append("phone = ?")
            params.append(data.phone)
        if data.avatar is not None:
            updates.append("avatar = ?")
            params.append(data.avatar)
            
        if updates:
            params.append(current_user["id"])
            cursor.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = ?", tuple(params))
            
        cursor.execute("SELECT id, name, email, role, phone, avatar, created_at FROM users WHERE id = ?", (current_user["id"],))
        updated = dict_from_row(cursor.fetchone())
        return {"user": updated, "message": "Profile updated successfully"}

@router.post("/forgot-password")
def forgot_password(data: PasswordReset):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?", (data.email,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No account found with this email")
        
        new_hash = hash_password(data.new_password)
        cursor.execute("UPDATE users SET password_hash = ? WHERE email = ?", (new_hash, data.email))
        return {"message": "Password has been successfully updated. Please login with your new password."}
