import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/products", tags=["Products"])

INITIAL_PRODUCTS = [
    {
        "name": "Monstera Deliciosa",
        "category": "Indoor",
        "price": 899,
        "rating": 4.8,
        "reviews": 312,
        "badge": "Bestseller",
        "image": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600",
        "features": ["Air-purifying", "Pet-safe alternative", "Fast-growing"],
    },
    {
        "name": "Snake Plant",
        "category": "Low-light",
        "price": 449,
        "rating": 4.9,
        "reviews": 268,
        "badge": "Easy care",
        "image": "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=600",
        "features": ["Drought-tolerant", "Air-purifying"],
    },
    {
        "name": "Fiddle Leaf Fig",
        "category": "Indoor",
        "price": 1299,
        "rating": 4.6,
        "reviews": 154,
        "badge": "New",
        "image": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600",
        "features": ["Statement piece", "Bright indirect light"],
    },
    {
        "name": "Golden Pothos",
        "category": "Low-light",
        "price": 349,
        "rating": 4.7,
        "reviews": 401,
        "badge": None,
        "image": "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600",
        "features": ["Trailing vine", "Beginner-friendly"],
    },
    {
        "name": "Echeveria Succulent Set",
        "category": "Succulent",
        "price": 599,
        "rating": 4.5,
        "reviews": 187,
        "badge": None,
        "image": "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600",
        "features": ["Low water", "Set of 3"],
    },
    {
        "name": "Peace Lily",
        "category": "Flowering",
        "price": 499,
        "rating": 4.7,
        "reviews": 223,
        "badge": "Bestseller",
        "image": "https://images.unsplash.com/photo-1519064438923-de4de326dfd1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UGVhY2UlMjBMaWx5JTIwcGluayUyMHBvdHxlbnwwfHwwfHx8MA%3D%3D",
        "features": ["Blooms indoors", "Air-purifying"],
    },
    {
        "name": "Catharanthus Roseus",
        "category": "Low-light",
        "price": 549,
        "rating": 4.8,
        "reviews": 296,
        "badge": None,
        "image": "https://images.unsplash.com/photo-1726196484058-565c844de9b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2F0aGFyYW50aHVzJTIwcm9zZXVzfGVufDB8fDB8fHww",
        "features": ["Drought-tolerant", "Glossy leaves"],
    },
    {
        "name": "Jade Plant",
        "category": "Flowering",
        "price": 749,
        "rating": 4.6,
        "reviews": 132,
        "badge": "New",
        "image": "https://images.unsplash.com/photo-1616189597001-9046fce2594d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SmFkZSUyMFBsYW50fGVufDB8fDB8fHww",
        "features": ["Long-lasting blooms", "Bright indirect light"],
    },
]

from auth import get_current_admin

# Public Route: Customers & Guests can browse all products
@router.get("", response_model=List[schemas.ProductResponse])
def get_products(category: Optional[str] = None, db: Session = Depends(get_db)):
    # Auto-seed database if empty
    if db.query(models.Product).count() == 0:
        for p in INITIAL_PRODUCTS:
            db_prod = models.Product(
                name=p["name"],
                category=p["category"],
                price=p["price"],
                rating=p["rating"],
                reviews=p["reviews"],
                badge=p["badge"],
                image=p["image"],
                features_json=json.dumps(p["features"])
            )
            db.add(db_prod)
        db.commit()

    query = db.query(models.Product)
    if category and category.lower() != "all":
        query = query.filter(models.Product.category.ilike(f"%{category}%"))
    
    products = query.all()
    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "price": p.price,
            "rating": p.rating,
            "reviews": p.reviews,
            "badge": p.badge,
            "image": p.image,
            "features": p.features
        })
    return result

# Public Route: View single product details
@router.get("/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {
        "id": product.id,
        "name": product.name,
        "category": product.category,
        "price": product.price,
        "rating": product.rating,
        "reviews": product.reviews,
        "badge": product.badge,
        "image": product.image,
        "features": product.features
    }

# Admin Only Route: Add a new product
@router.post("", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    prod_data: schemas.ProductCreate,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_prod = models.Product(
        name=prod_data.name,
        category=prod_data.category,
        price=prod_data.price,
        rating=prod_data.rating or 4.5,
        reviews=prod_data.reviews or 0,
        badge=prod_data.badge,
        image=prod_data.image,
        features_json=json.dumps(prod_data.features or [])
    )
    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)
    return {
        "id": new_prod.id,
        "name": new_prod.name,
        "category": new_prod.category,
        "price": new_prod.price,
        "rating": new_prod.rating,
        "reviews": new_prod.reviews,
        "badge": new_prod.badge,
        "image": new_prod.image,
        "features": new_prod.features
    }

# Admin Only Route: Update an existing product
@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: int,
    prod_data: schemas.ProductUpdate,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if prod_data.name is not None:
        product.name = prod_data.name
    if prod_data.category is not None:
        product.category = prod_data.category
    if prod_data.price is not None:
        product.price = prod_data.price
    if prod_data.rating is not None:
        product.rating = prod_data.rating
    if prod_data.reviews is not None:
        product.reviews = prod_data.reviews
    if prod_data.badge is not None:
        product.badge = prod_data.badge
    if prod_data.image is not None:
        product.image = prod_data.image
    if prod_data.features is not None:
        product.features_json = json.dumps(prod_data.features)

    db.commit()
    db.refresh(product)
    return {
        "id": product.id,
        "name": product.name,
        "category": product.category,
        "price": product.price,
        "rating": product.rating,
        "reviews": product.reviews,
        "badge": product.badge,
        "image": product.image,
        "features": product.features
    }

# Admin Only Route: Delete a product
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": f"Product #{product_id} deleted successfully."}
