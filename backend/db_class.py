# written by cormon and willis for cwru csds 493
# feb 26, 2025
# v 0.0.1

"""Database management module for SpartanSwap application."""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy import CheckConstraint
from flask import Flask


class DBClass:
    """Class to handle all database operations using SQLAlchemy."""
    db = SQLAlchemy()

    def __init__(self, app):
        """Initialize the database with the given Flask app."""
        self.app = app
        self.db.init_app(app)

    @classmethod
    def create_new(cls):
        """Create a new instance of the database."""
        app = Flask(__name__)
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///spartanswap.db"
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

        instance = cls(app)

        with app.app_context():
            instance.db.create_all()
            print("Database successfully created.")

        return instance
        

    def add_user(self, sub, email, name, profile_picture=None, gender=None, phone_number=None, is_admin=False):
        """Add a new user to the database."""
        with self.app.app_context():
            new_user = User(
                sub=sub,
                email=email,
                name=name,
                profile_picture=profile_picture,
                gender=gender,
                phone_number=phone_number,
                is_admin=is_admin
            )
            self.db.session.add(new_user)
            self.db.session.commit()
            print(f"Usuario {name} agregado correctamente.")
        
    def get_user_by_sub(self, sub):
        """Retrieve a user by their Google sub ID."""
        with self.app.app_context():
            user = User.query.filter_by(sub=sub).first()
            #print(type(user))
            return user
    
    def get_user_by_id(self, user_id):
        """Retrieve a user by their database ID."""
        with self.app.app_context():
            user = User.query.filter_by(id=user_id).first()
            return user
    
    def add_item(
        self,
        seller_id,
        item_type,
        category,
        color,
        price,
        condition,
        name,
        image_url=None,
        orders=0,
        description=None,
        is_custom=False,
    ):
        """Add a new item listing to the database."""
        with self.app.app_context():
            new_item = Item(
                seller_id=seller_id,
                item_type=item_type,
                category=category,
                color=color,
                price=price,
                condition=condition,
                image_url=image_url,
                name=name,
                orders=orders,
                description=description,
                is_custom=is_custom,
            )
            self.db.session.add(new_item)
            self.db.session.commit()
            print(f"Ítem {name} agregado correctamente.")
            
    def delete_item(self, item_id):
        """Delete an item listing from the database."""
        with self.app.app_context():
            item = Item.query.get(item_id)
            if item:
                self.db.session.delete(item)
                self.db.session.commit()
                print(f"Ítem {item.name} deleted.")
                return True
            else:
                print(f"Ítem {item_id} not in db.")
                return False

    def get_all_items(self, category=None, seller_id=None):
        """Retrieve all items, optionally filtered by category or seller."""
        with self.app.app_context():
            query = Item.query
            if category:
                query = query.filter_by(category=category)
            if seller_id:
                query = query.filter_by(seller_id=seller_id)
            items = query.all()
            return items
        
    def get_items_by_id(self, item_id):
        """Retrieve an item by its ID."""
        with self.app.app_context():
            item = Item.query.filter_by(id=item_id).first()
            return item
    
    def update_user(self, sub, email=None, name=None, profile_picture=None, gender=None, phone_number=None):
        """Update a user's information in the database"""
        with self.app.app_context():
            user = User.query.filter_by(sub=sub).first()
            if not user:
                print(f"User with sub {sub} not found.")
                return None

            # Update provided fields
            if email is not None:
                user.email = email
            if name is not None:
                user.name = name
            if profile_picture is not None:
                user.profile_picture = profile_picture
            if gender is not None:
                user.gender = gender
            if phone_number is not None:
                user.phone_number = phone_number

            self.db.session.commit()
            print(f"User {user.name} updated successfully.")
            return user
        
    def update_item(self, item_id, new_data):
        """Update an item's information in the database"""
        with self.app.app_context():
            item = Item.query.filter_by(id=item_id).first()
            if not item:
                print(f"Item with ID {item_id} not found.")
                return None

            # Update provided fields
            for key, value in new_data.items():
                if hasattr(item, key):
                    setattr(item, key, value)

            self.db.session.commit()
            print(f"Item {item.name} updated successfully.")
            return item


# Database object for app
db = DBClass.db


class User(db.Model):
    """Model representing a user in the database."""
    id = db.Column(db.Integer, primary_key=True)
    sub = db.Column(db.String(100), unique=True, nullable=False)
    profile_picture = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(50), nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)
    account_create_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_admin = db.Column(db.Boolean, default=False)

    items = db.relationship("Item", backref="seller", lazy=True)


class Item(db.Model):
    """Model representing an item listing in the database."""
    __tablename__ = "item"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    seller_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    item_type = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(50), nullable=True)
    price = db.Column(db.Float, nullable=False)
    condition = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    name = db.Column(db.String(255), nullable=False)
    orders = db.Column(db.Integer, default=0)
    description = db.Column(db.Text, nullable=True)
    is_custom = db.Column(db.Boolean, default=False)

    __table_args__ = (CheckConstraint("price > 0", name="check_price_positive"),)