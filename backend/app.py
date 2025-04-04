from flask import Flask, Response, abort, jsonify, redirect, request, session, url_for
from flask_cors import CORS
from database import db
from google.oauth2 import id_token
from google.auth.transport import requests
from environment import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from datetime import datetime
import jwt
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from db_class import DBClass
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///spartanswap.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
db_instance = DBClass(app)

# Configure CORS
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)


# Create tables on startup
with app.app_context():
    db_instance.db.create_all()

# OAuth 2 client setup
# client = WebApplicationClient(GOOGLE_CLIENT_ID)

def validate_session(token):
    try:
        data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        user = db_instance.get_user_by_sub(data["sub"])
        if user:
            user_data = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "profile_picture": user.profile_picture,
            }
            return jsonify(user_data)
        else:
            False
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False
    

@app.route("/")
def hello_world():
    return "Hello, World!"


@app.route("/signin", methods=["POST"])
def signin():
    try:
        token = request.form["credential"]
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )
        print(idinfo)

        # jsonify returns a response object
        return_data = {}
        if "hd" not in idinfo:
            return_data["CWRU_validated"] = False
        elif idinfo["hd"] == "case.edu":
            if db_instance.get_user_by_sub(idinfo["sub"]) is None:
                db_instance.add_user(
                    sub=idinfo["sub"],
                    email=idinfo["email"],
                    name=idinfo["name"],
                    profile_picture=idinfo["picture"],
                )
            
            return_data["jwt_token"] = jwt.encode(
                {
                    "sub": idinfo["sub"],
                    "name": idinfo["name"],
                    "iat": datetime.now().timestamp(),
                    "exp": datetime.now().timestamp() + 604800,
                },
                app.secret_key,
                algorithm="HS256",
            )
            return_data["CWRU_validated"] = True
        else:
            return_data["CWRU_validated"] = False
        return jsonify(return_data)
    except Exception as e:
        print(e)
        abort(403)


# @app.route("/login/callback")
# def callback():
#     return "Google login test"

db_instance.add_item(
    seller_id=1,
    item_type="Furniture",
    color="Green",
    price=199.23,
    condition="New",
    name="something added in the backend",  # New required field
    orders=24,  # New field
)


@app.route("/api/products", methods=["GET"])
def get_products():
    items = db_instance.get_all_items()
    products = []
    for item in items:
        product_data = {
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "orders": item.orders,
            "image": item.image_url if item.image_url else "/essentials.jpg",
            "type": item.item_type,
            "color": item.color,
        }
        products.append(product_data)
    return jsonify(products)

@app.route("/api/user", methods=["GET"])
def get_user():
    token = request.cookies.get("jwt_token")
    if not token:
        return jsonify({"error": "Not logged in"}), 401

    try:
        data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        user = db_instance.get_user_by_sub(data["sub"])
        if user:
            user_data = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "profile_picture": user.profile_picture,
            }
            return jsonify(user_data)
        else:
            return jsonify({"error": "User not found"}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

# Crear las tablas en la base de datos con manejo de errores
# Making the datatables with error handling
if __name__ == "__main__":
    try:
        app.run(port=5001, debug=True)
    except Exception as e:
        print(f"Error al crear la base de datos: {e}")
