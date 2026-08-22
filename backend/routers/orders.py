import json
import random
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/orders", tags=["Orders"])

INITIAL_ORDERS = [
    {
        "id": "ORD-9821",
        "customer_name": "Rahul Sharma",
        "customer_email": "rahul@gmail.com",
        "date": "2026-07-24",
        "items": [
            {"id": 1, "name": "Monstera Deliciosa", "price": 899, "quantity": 1},
            {"id": 2, "name": "Snake Plant", "price": 449, "quantity": 2}
        ],
        "total": 1797,
        "status": "Pending"
    },
    {
        "id": "ORD-9822",
        "customer_name": "Priya Patel",
        "customer_email": "priya@yahoo.com",
        "date": "2026-07-23",
        "items": [
            {"id": 3, "name": "Fiddle Leaf Fig", "price": 1299, "quantity": 1}
        ],
        "total": 1299,
        "status": "Shipped"
    },
    {
        "id": "ORD-9823",
        "customer_name": "Amit Kumar",
        "customer_email": "amit.k@outlook.com",
        "date": "2026-07-22",
        "items": [
            {"id": 4, "name": "Golden Pothos", "price": 349, "quantity": 3},
            {"id": 5, "name": "Echeveria Succulent Set", "price": 599, "quantity": 1}
        ],
        "total": 1646,
        "status": "Delivered"
    },
    {
        "id": "ORD-9824",
        "customer_name": "Sneha Reddy",
        "customer_email": "sneha.r@gmail.com",
        "date": "2026-07-20",
        "items": [
            {"id": 6, "name": "Peace Lily", "price": 499, "quantity": 1}
        ],
        "total": 499,
        "status": "Cancelled"
    }
]

def format_order_response(order: models.Order) -> dict:
    return {
        "id": order.id,
        "customerName": order.customer_name,
        "customerEmail": order.customer_email,
        "date": order.date,
        "items": order.items,
        "total": order.total,
        "status": order.status
    }

@router.get("", response_model=List[schemas.OrderResponse])
def get_orders(customer_email: Optional[str] = None, db: Session = Depends(get_db)):
    # Auto-seed initial orders if table is empty
    if db.query(models.Order).count() == 0:
        for ord_data in INITIAL_ORDERS:
            db_order = models.Order(
                id=ord_data["id"],
                customer_name=ord_data["customer_name"],
                customer_email=ord_data["customer_email"],
                date=ord_data["date"],
                items_json=json.dumps(ord_data["items"]),
                total=ord_data["total"],
                status=ord_data["status"]
            )
            db.add(db_order)
        db.commit()

    query = db.query(models.Order)
    if customer_email:
        query = query.filter(models.Order.customer_email == customer_email)
    
    orders = query.all()
    return [format_order_response(o) for o in orders]

@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return format_order_response(order)

@router.post("", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db)):
    try:
        # Generate unique Order ID if not provided or if ID already exists
        order_id = order_data.id
        if not order_id or db.query(models.Order).filter(models.Order.id == order_id).first():
            timestamp = datetime.now().strftime("%y%m%d%H%M%S")
            rand_num = random.randint(100, 999)
            order_id = f"ORD-{timestamp}{rand_num}"

        order_date = order_data.date or datetime.now().strftime("%Y-%m-%d")

        items_list = []
        for item in order_data.items:
            if hasattr(item, "model_dump"):
                items_list.append(item.model_dump())
            elif hasattr(item, "dict"):
                items_list.append(item.dict())
            elif isinstance(item, dict):
                items_list.append(item)
            else:
                items_list.append({
                    "id": getattr(item, "id", 0),
                    "name": getattr(item, "name", "Product"),
                    "price": getattr(item, "price", 0.0),
                    "quantity": getattr(item, "quantity", 1)
                })

        new_order = models.Order(
            id=order_id,
            customer_name=order_data.customerName,
            customer_email=order_data.customerEmail,
            date=order_date,
            items_json=json.dumps(items_list),
            total=order_data.total,
            status=order_data.status or "Pending"
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        return format_order_response(new_order)
    except Exception as e:
        db.rollback()
        print(f"Error creating order: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not place order: {str(e)}"
        )


@router.put("/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status(order_id: str, status_data: schemas.OrderUpdateStatus, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status_data.status
    db.commit()
    db.refresh(order)
    return format_order_response(order)

@router.delete("/{order_id}")
def delete_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(order)
    db.commit()
    return {"message": f"Order {order_id} deleted successfully."}
