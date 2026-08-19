from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

COOKIE_MAX_AGE = 60 * 60 * 24 * 7  # 7 days in seconds

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

@router.post("/forgot-password")
def forgot_password(data: schemas.ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email address.",
        )
    if data.new_password:
        user.hashed_password = get_password_hash(data.new_password)
        db.commit()
        return {"message": "Password reset successfully. You can now login with your new password."}
    
    return {"message": f"Password reset instructions sent to {data.email}."}
