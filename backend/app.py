from flask import Flask, Response, abort, jsonify, redirect, request, session, url_for
from flask_cors import CORS
from database import db
from db_class import User, Item
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
app.secret_key = "super secure secret key"

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///spartanswap.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
with app.app_context():
    db_instance = DBClass(app)
    db_instance.db.create_all() 

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
        #print("right here willis: ", type(user))
        if user:
            user_data = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "profile_picture": user.profile_picture,
            }
            #return user_data
            return user
        else:
            return False
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False
    

@app.route("/validate", methods=["GET"])
def validate():
    token = request.cookies.get("jwt_token")
    if not token:
        return jsonify({"error": "Not logged in"}), 401

    user = validate_session(token)
    
    if user:
        return jsonify({"valid": True, "user": user.name}), 200
    else:
        return jsonify({"valid": False}), 401


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

# Replace the existing initialization with:
with app.app_context():
    # Explicitly create all tables
    #db_instance.db.drop_all()
    if not os.path.exists('instance/spartanswap.db'):
        db_instance.db.create_all()
        print("Created new database")
    else:
        print("Using existing database")
    
    """ # Create a test user first
    db_instance.add_user(
        sub="test-user-123",
        email="test@case.edu",
        name="Test User"
    ) """
    
    # Then add the test item
    db_instance.add_item(
        seller_id=1,  # Matches the test user's ID
        item_type="Furniture",
        category="Home Goods",
        color="Green",
        price=199.23,
        condition="New",
        name="Test Item",
        orders=24,
        description="Test description",
        is_custom=True
    )


@app.route("/api/products", methods=["GET"])
def get_products():
    print("listings got")
    category = request.args.get('category')
    items = db_instance.get_all_items(category=category)
    
    products = []
    for item in items:
        print(item.name)
        product_data = {
            "id": item.id,
            "sellerId": item.seller_id,
            "name": item.name,
            "price": item.price,
            "orders": item.orders,
            "image": item.image_url if item.image_url else "/essentials.jpg",
            "type": item.item_type,
            "color": item.color,
            "category": item.category,
            "description": item.description,
            "isCustom": item.is_custom
        }
        products.append(product_data)
    return jsonify(products)

@app.route("/api/user", methods=["GET"])
def get_user():
    token = request.cookies.get("jwt_token")
    #print(token)
    if not token:
        return jsonify({"error": "Not logged in"}), 401

    try:
        data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        print(data)
        user = db_instance.get_user_by_sub(data["sub"])
        print(user.phone_number)
        if user:
            user_data = {
                "id": user.id,
                "name": user.name,
                "gender": user.gender,
                "phoneNumber": user.phone_number,
                "emailAddresses": [user.email],
                "profile_picture": user.profile_picture,
            }
            print(user_data)
            return jsonify(user_data)
        else:
            return jsonify({"error": "User not found"}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

@app.route("/api/user_search/<int:user_id>", methods=["GET"])
def user_search(user_id):
    token = request.cookies.get("jwt_token")
    user = validate_session(token)
    
    if not user:
        return jsonify({"error": "Not logged in or invalid token"}), 401

    try:
        print(user_id)
        user = db_instance.get_user_by_id(user_id)
        if user:
            user_data = {
                "id": user.id,
                "name": user.name,
                "gender": user.gender,
                "phoneNumber": user.phone_number,
                "emailAddresses": [user.email],
                "profile_picture": user.profile_picture,
            }
            print(user_data)
            return jsonify(user_data)
        else:
            return jsonify({"error": "User not found"}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

@app.route("/api/user", methods=["PUT"])
def update_user():
    token = request.cookies.get("jwt_token")
    user = validate_session(token)
    
    if not user:
        return jsonify({"error": "Not logged in or invalid token"}), 401

    profile_data = request.json
    
    try:
        # Update fields directly without app context wrapper
        user.name = profile_data.get("name", user.name)
        user.gender = profile_data.get("gender", user.gender)
        user.phone_number = profile_data.get("phoneNumber", user.phone_number)  # Note: phoneNumber vs phone_number
        user.profile_picture = profile_data.get("profilePhoto", user.profile_picture)

        # Explicitly add to session and commit
        db_instance.db.session.add(user)
        db_instance.db.session.commit()
        
        return jsonify({"message": "User updated successfully"}), 200
        
    except Exception as e:
        db_instance.db.session.rollback()
        print(f"Error updating user: {str(e)}")
        return jsonify({"error": "Database update failed"}), 500
    
@app.route("/api/add_listing", methods=["PUT"])
def add_listing():
    token = request.cookies.get("jwt_token")
    user = validate_session(token)
    
    if not user:
        return jsonify({"error": "Not logged in or invalid token"}), 401

    listing_data = request.json
    try:
        # Update fields directly without app context wrapper
        db_instance.add_item(
            seller_id=listing_data["id"],  # Matches the test user's ID
            item_type=listing_data["type"],
            category=listing_data["category"],
            color=listing_data["color"],
            price=listing_data["price"],
            condition="New",
            name=listing_data["name"],
            orders=listing_data["orders"],
            description=listing_data["description"],
            is_custom=listing_data["isCustom"],
            image_url=listing_data["image_url"]
        )
        
        return jsonify({"message": "Listing added successfully"}), 200
        
    except Exception as e:
        db_instance.db.session.rollback()
        print(f"Error adding item: {str(e)}")
        return jsonify({"error": "Database update failed"}), 500

# Crear las tablas en la base de datos con manejo de errores
# Making the datatables with error handling
if __name__ == "__main__":
    try:
        app.run(port=5001, debug=True)
    except Exception as e:
        print(f"Error al crear la base de datos: {e}")
