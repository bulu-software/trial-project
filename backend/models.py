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

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(150), nullable=False)
    date = Column(String(20), nullable=False)
    items_json = Column(Text, nullable=False)  # JSON representation of items
    total = Column(Float, nullable=False)
    status = Column(String(20), default="Pending", nullable=False)

    @property
    def items(self):
        try:
            return json.loads(self.items_json) if self.items_json else []
        except Exception:
            return []

    @items.setter
    def items(self, val):
        self.items_json = json.dumps(val)

class CartItemModel(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_email = Column(String(150), index=True, nullable=True)
    product_id = Column(Integer, nullable=False)
    name = Column(String(150), nullable=False)
    price = Column(Float, nullable=False)
    image = Column(Text, nullable=False)
    quantity = Column(Integer, default=1, nullable=False)

class WishlistItemModel(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_email = Column(String(150), index=True, nullable=True)
    product_id = Column(Integer, nullable=False)
    name = Column(String(150), nullable=False)
    price = Column(Float, nullable=False)
    image = Column(Text, nullable=False)


