from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])

def format_wishlist_response(item: models.WishlistItemModel) -> dict:
    return {
        "id": item.product_id,
        "name": item.name,
        "price": item.price,
        "image": item.image
    }

@router.get("", response_model=List[schemas.WishlistItemResponse])
def get_wishlist(user_email: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.WishlistItemModel)
    if user_email:
        query = query.filter(models.WishlistItemModel.user_email == user_email)
    items = query.all()
    return [format_wishlist_response(i) for i in items]

@router.post("", response_model=schemas.WishlistItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(item_data: schemas.WishlistItemCreate, db: Session = Depends(get_db)):
    email = item_data.userEmail
    query = db.query(models.WishlistItemModel).filter(models.WishlistItemModel.product_id == item_data.id)
    if email:
        query = query.filter(models.WishlistItemModel.user_email == email)
    
    existing = query.first()
    if existing:
        return format_wishlist_response(existing)
    
    new_item = models.WishlistItemModel(
        product_id=item_data.id,
        name=item_data.name,
        price=item_data.price,
        image=item_data.image,
        user_email=email
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return format_wishlist_response(new_item)

@router.post("/toggle")
def toggle_wishlist(item_data: schemas.WishlistItemCreate, db: Session = Depends(get_db)):
    email = item_data.userEmail
    query = db.query(models.WishlistItemModel).filter(models.WishlistItemModel.product_id == item_data.id)
    if email:
        query = query.filter(models.WishlistItemModel.user_email == email)
    
    existing = query.first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"wishlisted": False, "message": f"Item {item_data.id} removed from wishlist"}
    
    new_item = models.WishlistItemModel(
        product_id=item_data.id,
        name=item_data.name,
        price=item_data.price,
        image=item_data.image,
        user_email=email
    )
    db.add(new_item)
    db.commit()
    return {"wishlisted": True, "message": f"Item {item_data.id} added to wishlist"}

@router.delete("/{product_id}")
def remove_from_wishlist(product_id: int, user_email: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.WishlistItemModel).filter(models.WishlistItemModel.product_id == product_id)
    if user_email:
        query = query.filter(models.WishlistItemModel.user_email == user_email)
    
    item = query.first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": f"Item {product_id} removed from wishlist"}

@router.delete("")
def clear_wishlist(user_email: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.WishlistItemModel)
    if user_email:
        query = query.filter(models.WishlistItemModel.user_email == user_email)
    
    query.delete(synchronize_session=False)
    db.commit()
    return {"message": "Wishlist cleared successfully"}
