from pydantic import BaseModel, Field
from typing import List, Optional, Any

try:
    from pydantic import EmailStr
except ImportError:
    EmailStr = str

# --- User Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    role: Optional[str] = "customer"

class UserLogin(BaseModel):
    email: str = Field(..., pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    password: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None

class PasswordReset(BaseModel):
    email: str = Field(..., pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    new_password: str = Field(..., min_length=6)

# --- Category Schemas ---
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = 0

# --- Product Schemas ---
class ProductVariantSchema(BaseModel):
    size: str
    color: str
    color_code: Optional[str] = "#000000"
    stock: int = 10

class ProductImageSchema(BaseModel):
    image_url: str
    is_primary: Optional[bool] = False

class ProductCreate(BaseModel):
    name: str
    description: str
    category_id: int
    original_price: float
    discounted_price: float
    discount_percent: Optional[int] = 0
    stock: int = 20
    fabric: Optional[str] = None
    sku: Optional[str] = None
    is_featured: Optional[bool] = False
    is_trending: Optional[bool] = False
    is_new: Optional[bool] = True
    is_bestseller: Optional[bool] = False
    images: Optional[List[str]] = []
    variants: Optional[List[ProductVariantSchema]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    original_price: Optional[float] = None
    discounted_price: Optional[float] = None
    discount_percent: Optional[int] = None
    stock: Optional[int] = None
    fabric: Optional[str] = None
    sku: Optional[str] = None
    is_featured: Optional[bool] = None
    is_trending: Optional[bool] = None
    is_new: Optional[bool] = None
    is_bestseller: Optional[bool] = None
    images: Optional[List[str]] = None
    variants: Optional[List[ProductVariantSchema]] = None

# --- Cart & Wishlist ---
class CartItemAdd(BaseModel):
    product_id: int
    size: str
    color: str
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

# --- Address ---
class AddressCreate(BaseModel):
    full_name: str
    mobile_number: str
    house_flat: str
    street: str
    area: str
    city: str
    district: str
    state: str
    pin_code: str
    is_default: Optional[bool] = False
    address_type: Optional[str] = "Home"

# --- Order ---
class OrderItemInput(BaseModel):
    product_id: int
    product_name: str
    product_image: Optional[str] = None
    size: str
    color: str
    quantity: int
    unit_price: float
    total_price: float

class OrderCreate(BaseModel):
    shipping_address_id: Optional[int] = None
    shipping_address_custom: Optional[AddressCreate] = None
    payment_method: str = "UPI"
    coupon_code: Optional[str] = None
    delivery_charge: float = 0.0
    items: Optional[List[OrderItemInput]] = None

class OrderStatusUpdate(BaseModel):
    order_status: str
    courier_name: Optional[str] = None
    tracking_number: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None

# --- Payment ---
class PaymentSimulation(BaseModel):
    order_id: int
    method: str
    amount: float
    status: str = "Paid"
    transaction_ref: Optional[str] = None

# --- Review ---
class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: str
    images: Optional[List[str]] = []

# --- Coupon ---
class CouponCreate(BaseModel):
    code: str
    discount_type: str = "percentage"
    discount_value: float
    min_order_value: Optional[float] = 0
    max_discount: Optional[float] = None
    expiry_date: Optional[str] = None
    is_active: Optional[bool] = True

class CouponApply(BaseModel):
    code: str
    subtotal: float
