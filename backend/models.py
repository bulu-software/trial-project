import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Enum, DateTime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum("customer", "admin", name="user_roles"), default="customer", nullable=False)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    rating = Column(Float, default=4.5)
    reviews = Column(Integer, default=0)
    badge = Column(String(50), nullable=True)
    image = Column(Text, nullable=False)
    features_json = Column(Text, nullable=True, default="[]")

    @property
    def features(self):
        try:
            return json.loads(self.features_json) if self.features_json else []
        except Exception:
            return []

    @features.setter
    def features(self, val):
        self.features_json = json.dumps(val)
