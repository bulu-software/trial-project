from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/cart", tags=["Cart"])

def format_cart_response(item: models.CartItemModel) -> dict:
    return {
        "id": item.product_id,
        "name": item.name,
        "price": item.price,
        "image": item.image,
        "quantity": item.quantity
    }

@router.get("", response_model=List[schemas.CartItemResponse])
def get_cart(user_email: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.CartItemModel)
    if user_email:
        query = query.filter(models.CartItemModel.user_email == user_email)
    items = query.all()
    return [format_cart_response(i) for i in items]

@router.post("", response_model=schemas.CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(item_data: schemas.CartItemCreate, db: Session = Depends(get_db)):
    email = item_data.userEmail
    query = db.query(models.CartItemModel).filter(models.CartItemModel.product_id == item_data.id)
    if email:
        query = query.filter(models.CartItemModel.user_email == email)
    
    existing = query.first()
    if existing:
        existing.quantity += item_data.quantity or 1
        db.commit()
        db.refresh(existing)
        return format_cart_response(existing)
    
    new_item = models.CartItemModel(
        product_id=item_data.id,
        name=item_data.name,
        price=item_data.price,
        image=item_data.image,
        quantity=item_data.quantity or 1,
        user_email=email
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return format_cart_response(new_item)

@router.put("/{product_id}", response_model=List[schemas.CartItemResponse])
def update_cart_quantity(
    product_id: int,
    data: schemas.CartItemUpdateQuantity,
    user_email: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.CartItemModel).filter(models.CartItemModel.product_id == product_id)
    if user_email:
        query = query.filter(models.CartItemModel.user_email == user_email)
    
    item = query.first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    if data.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = data.quantity
    
    db.commit()

    all_query = db.query(models.CartItemModel)
    if user_email:
        all_query = all_query.filter(models.CartItemModel.user_email == user_email)
    return [format_cart_response(i) for i in all_query.all()]

@router.delete("/{product_id}")
def remove_from_cart(product_id: int, user_email: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.CartItemModel).filter(models.CartItemModel.product_id == product_id)
    if user_email:
        query = query.filter(models.CartItemModel.user_email == user_email)
    
    item = query.first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": f"Item {product_id} removed from cart"}

@router.delete("")
def clear_cart(user_email: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.CartItemModel)
    if user_email:
        query = query.filter(models.CartItemModel.user_email == user_email)
    
    query.delete(synchronize_session=False)
    db.commit()
    return {"message": "Cart cleared successfully"}
