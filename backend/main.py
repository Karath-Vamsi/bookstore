import json
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import Float, ForeignKey, Text, create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from typing import List, Optional

SQLALCHEMY_DATABASE_URL = "sqlite:///./library.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    coverURL = Column(String)
    price = Column(String)
    reviews = relationship("Review", back_populates="product")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    user = Column(String)
    rating = Column(Float)
    comment = Column(Text)
    product_id = Column(Integer, ForeignKey("products.id"))
    product = relationship("Product", back_populates="reviews")

Base.metadata.create_all(bind=engine)

class ReviewBase(BaseModel):
    user: str
    rating: float
    comment: str

class ProductBase(BaseModel):
    title: str
    author: str
    coverURL: str
    price: str

class ProductResponse(ProductBase):
    id: int
    reviews: List[ReviewBase] = []

@app.post("/products/")
def create_product(product: ProductBase):
    db = SessionLocal()
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    db.close()
    return db_product

@app.get("/products/")
def read_products(title: Optional[str] = Query(None), author: Optional[str] = Query(None)):
    db = SessionLocal()
    query = db.query(Product)
    if title:
        query = query.filter(Product.title.ilike(f"%{title}%"))
    if author:
        query = query.filter(Product.author.ilike(f"%{author}%"))
    products = query.all()
    db.close()
    return products

@app.get("/products/{product_id}")
def read_product(product_id: int):
    db = SessionLocal()
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        db.close()
        raise HTTPException(status_code=404, detail="Product not found")
    db.close()
    return product

@app.put("/products/{product_id}")
def update_product(product_id: int, product: ProductBase):
    db = SessionLocal()
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product is None:
        db.close()
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    db.close()
    return db_product

@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    db = SessionLocal()
    db_item = db.query(Product).filter(Product.id == product_id).first()
    if db_item is None:
        db.close()
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_item)
    db.commit()
    db.close()
    return db_item

@app.post("/products/{product_id}/reviews/")
def create_review(product_id: int, review: ReviewBase):
    db = SessionLocal()
    db_review = Review(**review.dict(), product_id=product_id)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    db.close()
    return db_review

@app.get("/products/{product_id}/reviews/")
def read_reviews(product_id: int):
    db = SessionLocal()
    reviews = db.query(Review).filter(Review.product_id == product_id).all()
    db.close()
    return reviews

@app.get("/")
def read_root():
    return {"message": "Welcome to the Product API"}
