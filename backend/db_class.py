# written by cormon and willis for cwru csds 493
# feb 26, 2025
# v 0.0.1


from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy import CheckConstraint
from flask import Flask


class DBClass:
    db = SQLAlchemy()

    def __init__(self, app):
        self.app = app
        self.db.init_app(app)

    @classmethod
    def create_new(cls):
        """Method for initializing the database"""
        app = Flask(__name__)
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///spartanswap.db"
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

        instance = cls(app)

        with app.app_context():
            instance.db.create_all()
            print("Database successfully created.")

        return instance

    def add_user(self, email, name, profile_picture=None):
        """Method to add a user to the database"""
        with self.app.app_context():
            new_user = User(email=email, name=name, profile_picture=profile_picture)
            self.db.session.add(new_user)
            self.db.session.commit()
            print(f"Usuario {name} agregado correctamente.")

    def add_item(
        self,
        seller_id,
        item_type,
        color,
        price,
        condition,
        name,
        image_url=None,
        orders=0,
    ):
        """Method to add an item to the database"""
        with self.app.app_context():
            new_item = Item(
                seller_id=seller_id,
                item_type=item_type,
                color=color,
                price=price,
                condition=condition,
                image_url=image_url,
                name=name,
                orders=orders,
            )
            self.db.session.add(new_item)
            self.db.session.commit()
            print(f"Ítem {name} agregado correctamente.")

    def get_all_items(self):
        """Method to retrieve all items from the database"""
        with self.app.app_context():
            items = Item.query.all()
            return items


db = DBClass.db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profile_picture = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    account_create_date = db.Column(db.DateTime, default=datetime.utcnow)

    items = db.relationship("Item", backref="seller", lazy=True)


class Item(db.Model):
    __tablename__ = "item"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    seller_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    item_type = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(50), nullable=True)
    price = db.Column(db.Float, nullable=False)
    condition = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    # New fields
    name = db.Column(db.String(255), nullable=False)
    orders = db.Column(db.Integer, default=0)

    __table_args__ = (CheckConstraint("price > 0", name="check_price_positive"),)
