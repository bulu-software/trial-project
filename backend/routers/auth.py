import secrets
from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_password_hash, verify_password, create_access_token, get_current_user, get_current_admin
from email_service import create_reset_token, verify_reset_token, send_reset_password_email, send_otp_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

COOKIE_MAX_AGE = 60 * 60 * 24 * 7  # 7 days in seconds
OTP_STORE: dict[str, dict] = {}
MAX_OTP_ATTEMPTS = 5

@router.post("/register", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: schemas.UserRegister, response: Response, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )
    
    # Hash password and create user
    hashed_pwd = get_password_hash(user_data.password)
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_pwd,
        role=user_data.role if user_data.role in ["customer", "admin"] else "customer",
        phone=user_data.phone,
        address=user_data.address,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate JWT token
    access_token = create_access_token(data={"sub": new_user.email, "role": new_user.role})
    
    # Set Secure HttpOnly Cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=COOKIE_MAX_AGE,
        samesite="lax",
        secure=False,  # Set to True in HTTPS production
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=schemas.TokenResponse)
def login(login_data: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    # Set Secure HttpOnly Cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=COOKIE_MAX_AGE,
        samesite="lax",
        secure=False,  # Set to True in HTTPS production
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", samesite="lax")
    return {"message": "Logged out successfully"}

@router.get("/profile", response_model=schemas.UserResponse)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=schemas.UserResponse)
def update_profile(
    profile_data: schemas.ProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.name is not None:
        current_user.name = profile_data.name
    if profile_data.phone is not None:
        current_user.phone = profile_data.phone
    if profile_data.address is not None:
        current_user.address = profile_data.address
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/change-password")
def change_password(
    pwd_data: schemas.PasswordChange,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(pwd_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )
    
    current_user.hashed_password = get_password_hash(pwd_data.new_password)
    db.commit()
    return {"message": "Password changed successfully."}

@router.post("/send-otp")
def send_otp(
    data: schemas.SendOTPRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    email_clean = data.email.lower().strip()
    user = db.query(models.User).filter(models.User.email == email_clean).first()
    
    # Generic success message to prevent user enumeration
    success_msg = f"If an account exists with {data.email}, a verification code has been sent."
    
    if not user:
        return {"message": success_msg}
    
    # Cryptographically secure 6-digit numeric OTP
    otp_code = f"{secrets.randbelow(1000000):06d}"
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    OTP_STORE[email_clean] = {
        "otp": otp_code,
        "expires_at": expires_at,
        "attempts": 0
    }
    
    background_tasks.add_task(send_otp_email, user.email, user.name, otp_code)
    
    return {"message": success_msg}

@router.post("/verify-otp")
def verify_otp(data: schemas.VerifyOTPRequest):
    email_clean = data.email.lower().strip()
    record = OTP_STORE.get(email_clean)
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP request found for this email address. Please click Send OTP first.",
        )
    
    if datetime.utcnow() > record["expires_at"]:
        OTP_STORE.pop(email_clean, None)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP code has expired. Please request a new code.",
        )

    # Attempt rate limit
    record["attempts"] += 1
    if record["attempts"] > MAX_OTP_ATTEMPTS:
        OTP_STORE.pop(email_clean, None)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many failed attempts. This OTP code has been invalidated. Please request a new one.",
        )
        
    if record["otp"] != data.otp.strip():
        remaining = MAX_OTP_ATTEMPTS - record["attempts"]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid OTP code. {remaining} attempt(s) remaining.",
        )
        
    return {"message": "OTP verified successfully.", "verified": True}

@router.post("/reset-password-otp")
def reset_password_otp(data: schemas.ResetPasswordOTPRequest, db: Session = Depends(get_db)):
    email_clean = data.email.lower().strip()
    record = OTP_STORE.get(email_clean)
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP session. Please request a new OTP code.",
        )
        
    if datetime.utcnow() > record["expires_at"]:
        OTP_STORE.pop(email_clean, None)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP code has expired. Please request a new code.",
        )

    if record["otp"] != data.otp.strip():
        record["attempts"] += 1
        if record["attempts"] >= MAX_OTP_ATTEMPTS:
            OTP_STORE.pop(email_clean, None)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Too many failed attempts. Please request a new OTP code.",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code. Please check and try again.",
        )
        
    user = db.query(models.User).filter(models.User.email == email_clean).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account associated with this email address was not found.",
        )
        
    if len(data.new_password) < 8 or len(data.new_password) > 32:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be between 8 and 32 characters long.",
        )
        
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    
    # Remove OTP record after successful reset
    OTP_STORE.pop(email_clean, None)
    
    return {"message": "Password reset successfully. You can now login with your new password."}

@router.post("/forgot-password")
def forgot_password(
    data: schemas.ForgotPassword,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Alias for send-otp to maintain backward compatibility
    return send_otp(schemas.SendOTPRequest(email=data.email), background_tasks, db)

@router.post("/reset-password")
def reset_password(data: schemas.ResetPassword, db: Session = Depends(get_db)):
    email = verify_reset_token(data.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset link. Please request a new one.",
        )
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account associated with this token was not found.",
        )
    
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password reset successfully. You can now login with your new password."}

@router.get("/customers", response_model=List[schemas.CustomerResponse])
def get_customers(
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    users = db.query(models.User).all()
    result = []
    for u in users:
        joined_str = u.created_at.strftime("%Y-%m-%d") if u.created_at else "2026-01-01"
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "phone": u.phone or "N/A",
            "address": u.address or "N/A",
            "joined": joined_str,
            "orders": 1 if u.role == "customer" else 0
        })
    return result
