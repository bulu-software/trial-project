import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import auth, products

# Create all MySQL tables automatically
try:
    Base.metadata.create_all(bind=engine)
    print("MySQL Tables verified/created successfully in 'plant_shop'.")
except Exception as e:
    print(f"Warning: Could not auto-create tables: {e}")

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
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")

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
