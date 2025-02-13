from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy import CheckConstraint

# Inicializar la aplicación Flask
# Initializing Flask app
app = Flask(__name__)

# Configurar la base de datos SQLite
# Configuring base sqlite info
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///spartanswap.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Inicializar la extensión SQLAlchemy
# Starting SQAlchemy
db = SQLAlchemy(app)


# Definir la tabla User
# Defining User sql table
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profile_picture = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    account_create_date = db.Column(
        db.DateTime, default=datetime.utcnow, server_default=db.func.current_timestamp()
    )

    # Relación con la tabla Item
    # relationship with the item table
    items = db.relationship("Item", backref="seller", lazy=True)

    @staticmethod
    def get_user_by_email(email):
        """Buscar un usuario por email."""
        # search for a user by email
        return User.query.filter_by(email=email).first()


# defining item table
# Definir la tabla Item
class Item(db.Model):
    __tablename__ = "item"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )  # Consistencia con User
    seller_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    item_type = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(50), nullable=True)
    price = db.Column(db.Float, nullable=False)
    condition = db.Column(db.String(50), nullable=False)

    # making sure that the price is greater than 0
    # Aplicar restricción para que el precio sea mayor a 0
    __table_args__ = (CheckConstraint("price > 0", name="check_price_positive"),)


# Crear las tablas en la base de datos con manejo de errores
# Making the datatables with error handling
if __name__ == "__main__":
    try:
        with app.app_context():
            db.create_all()
            print("Base de datos creada exitosamente.")
    except Exception as e:
        print(f"Error al crear la base de datos: {e}")
