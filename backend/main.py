import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import auth, products, orders, cart, wishlist

from sqlalchemy import inspect, text

# Create all MySQL tables automatically & alter columns if needed
try:
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    if "orders" in inspector.get_table_names():
        columns = [c["name"] for c in inspector.get_columns("orders")]
        with engine.begin() as conn:
            if "customer_name" not in columns:
                conn.execute(text("ALTER TABLE orders ADD COLUMN customer_name VARCHAR(100) NULL"))
            if "customer_email" not in columns:
                conn.execute(text("ALTER TABLE orders ADD COLUMN customer_email VARCHAR(150) NULL"))
            if "date" not in columns:
                conn.execute(text("ALTER TABLE orders ADD COLUMN date VARCHAR(20) NULL"))
            if "items_json" not in columns:
                conn.execute(text("ALTER TABLE orders ADD COLUMN items_json TEXT NULL"))
            if "total" not in columns:
                conn.execute(text("ALTER TABLE orders ADD COLUMN total FLOAT NULL"))
            if "status" not in columns:
                conn.execute(text("ALTER TABLE orders ADD COLUMN status VARCHAR(20) DEFAULT 'Pending'"))
    print("MySQL Tables & Columns verified/synced successfully in 'plant_shop'.")
except Exception as e:
    print(f"Warning: Could not auto-create/sync tables: {e}")


app = FastAPI(
    title="Plant Shop API",
    description="FastAPI Backend for Plant Shop with MySQL Database",
    version="1.0.0"
)

# Enable CORS for React Frontend (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:[0-9]+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(wishlist.router, prefix="/api")



@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Plant Shop API is running successfully with MySQL!",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
