from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "customer"
    phone: Optional[str] = None
    address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    phone: Optional[str] = "N/A"
    address: Optional[str] = "N/A"
    joined: str
    orders: int = 0

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class ForgotPassword(BaseModel):
    email: EmailStr

class SendOTPRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordOTPRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class ResetPassword(BaseModel):
    token: str
    new_password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

# Product Schemas
class ProductBase(BaseModel):
    name: str
    category: str
    price: float
    rating: Optional[float] = 4.5
    reviews: Optional[int] = 0
    badge: Optional[str] = None
    image: str
    features: Optional[List[str]] = []

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None
    badge: Optional[str] = None
    image: Optional[str] = None
    features: Optional[List[str]] = None

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

class OrderItemSchema(BaseModel):
    id: int
    name: str
    price: float
    quantity: int

class OrderCreate(BaseModel):
    id: Optional[str] = None
    customerName: str
    customerEmail: str
    date: Optional[str] = None
    items: List[OrderItemSchema]
    total: float
    status: Optional[str] = "Pending"

class OrderResponse(BaseModel):
    id: str
    customerName: str
    customerEmail: str
    date: str
    items: List[OrderItemSchema]
    total: float
    status: str

    class Config:
        from_attributes = True

class OrderUpdateStatus(BaseModel):
    status: str

# Cart Schemas
class CartItemCreate(BaseModel):
    id: int
    name: str
    price: float
    image: str
    quantity: Optional[int] = 1
    userEmail: Optional[str] = None

class CartItemUpdateQuantity(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    name: str
    price: float
    image: str
    quantity: int

    class Config:
        from_attributes = True

# Wishlist Schemas
class WishlistItemCreate(BaseModel):
    id: int
    name: str
    price: float
    image: str
    userEmail: Optional[str] = None

class WishlistItemResponse(BaseModel):
    id: int
    name: str
    price: float
    image: str

    class Config:
        from_attributes = True



