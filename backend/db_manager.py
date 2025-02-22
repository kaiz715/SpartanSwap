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
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///spartanswap.db'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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

    def add_item(self, seller_id, item_type, color, price, condition):
        """Método para agregar un ítem a la base de datos"""
        with self.app.app_context():
            new_item = Item(seller_id=seller_id, item_type=item_type, color=color, price=price, condition=condition)
            self.db.session.add(new_item)
            self.db.session.commit()
            print(f"Ítem {item_type} agregado correctamente.")

# Define the database models
class User(DBClass.db.Model):
    id = DBClass.db.Column(DBClass.db.Integer, primary_key=True)
    profile_picture = DBClass.db.Column(DBClass.db.String(255), nullable=True)
    email = DBClass.db.Column(DBClass.db.String(100), unique=True, nullable=False)
    name = DBClass.db.Column(DBClass.db.String(100), nullable=False)
    account_create_date = DBClass.db.Column(DBClass.db.DateTime, default=datetime.utcnow)

    items = DBClass.db.relationship('Item', backref='seller', lazy=True)

class Item(DBClass.db.Model):
    id = DBClass.db.Column(DBClass.db.Integer, primary_key=True)
    date = DBClass.db.Column(DBClass.db.DateTime, default=lambda: datetime.now(timezone.utc))
    seller_id = DBClass.db.Column(DBClass.db.Integer, DBClass.db.ForeignKey('user.id'), nullable=False)
    item_type = DBClass.db.Column(DBClass.db.String(50), nullable=False)
    color = DBClass.db.Column(DBClass.db.String(50), nullable=True)
    price = DBClass.db.Column(DBClass.db.Float, nullable=False)
    condition = DBClass.db.Column(DBClass.db.String(50), nullable=False)

    __table_args__ = (CheckConstraint('price > 0', name='check_price_positive'),)
