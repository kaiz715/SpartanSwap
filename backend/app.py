from flask import Flask, Response, abort, jsonify, redirect, request, session, url_for
from flask_cors import CORS
from database import db
from db_class import User, Item
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from environment import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from datetime import datetime
from admin_list import admin_list
from email_sender import send_email
import jwt
import os
import requests
import base64
import json


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

def validate_session(token, is_admin=False):
    #docstring
    """
    Validate the session token and check if the user is an admin.
    Args:
        token (str): The JWT token to validate.
        is_admin (bool): Flag to check if the user is an admin.
    Returns:
        dict: User data if valid, False otherwise.
    """
    try:
        data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        user = db_instance.get_user_by_sub(data["sub"])
        #print("right here willis: ", type(user))
        if user:
            # Check if the user is an admin
            if is_admin and not user.is_admin:
                return False
            
            user_data = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "profile_picture": user.profile_picture,
                "is_admin": user.is_admin,
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
    # docstring
    """
    Validate the session token and check if the user is logged in.
    Returns:
        Response: JSON response indicating whether the user is logged in or not.
    """

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
    # docstring
    """
    Sign in the user using Google OAuth 2.0.
    Returns:
        Response: JSON response containing the JWT token and validation status.
    """

    try:
        token = request.form["credential"]
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), GOOGLE_CLIENT_ID
        )

        # jsonify returns a response object
        return_data = {}
        
        
        # if True:
        # comment next 3 lines below and uncomment line above to test with noncwru emails
        if "hd" not in idinfo:
            return_data["CWRU_validated"] = False
        elif idinfo["hd"] == "case.edu":
            if db_instance.get_user_by_sub(idinfo["sub"]) is None:
                db_instance.add_user(
                    sub=idinfo["sub"],
                    email=idinfo["email"],
                    name=idinfo["name"],
                    profile_picture=idinfo["picture"],
                    is_admin=idinfo["email"] in admin_list,
                )
                send_email(
                    idinfo["email"],
                    "Welcome to SpartanSwap!",
                    "Thank you for signing up for SpartanSwap. We hope you enjoy the platform!",
                )
            
            return_data["jwt_token"] = jwt.encode(
                {
                    "sub": idinfo["sub"],
                    "id": db_instance.get_user_by_sub(idinfo["sub"]).id,
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
    """ db_instance.add_item(
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
    ) """


@app.route("/api/products", methods=["GET"])
def get_products():
    # docstring
    """
    Get all products based on seller ID or category.
    Returns:
        Response: JSON response containing the list of products.
    """

    seller_id = request.args.get("sellerId")
    if seller_id:
        items = db_instance.get_all_items(seller_id=seller_id)
    else:
        category = request.args.get('category')
        items = db_instance.get_all_items(category=category)
    
    products = []
    for item in items:
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
    # docstring
    """
    Get user information based on the JWT token.
    Returns:
        Response: JSON response containing the user information.
    """

    token = request.cookies.get("jwt_token")
    #print(token)
    if not token:
        return jsonify({"error": "Not logged in"}), 401

    try:
        data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        user = db_instance.get_user_by_sub(data["sub"])
        if user:
            user_data = {
                "id": user.id,
                "name": user.name,
                "gender": user.gender,
                "phoneNumber": user.phone_number,
                "emailAddresses": [user.email],
                "profile_picture": user.profile_picture,
                "is_admin": user.is_admin,
            }
            return jsonify(user_data)
        else:
            return jsonify({"error": "User not found"}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

@app.route("/api/user_search/<int:user_id>", methods=["GET"])
def user_search(user_id):
    # docstring
    """
    Get user information based on the user ID.
    Args:
        user_id (int): The ID of the user to search for.
    Returns:
        Response: JSON response containing the user information.
    """

    token = request.cookies.get("jwt_token")
    user = validate_session(token)
    
    if not user:
        return jsonify({"error": "Not logged in or invalid token"}), 401

    try:
        seller = db_instance.get_user_by_id(user_id)
        if seller:
            user_data = {
                "id": seller.id,
                "name": seller.name,
                "gender": seller.gender,
                "phoneNumber": seller.phone_number,
                "emailAddresses": [seller.email],
                "profile_picture": seller.profile_picture,
                "is_admin": seller.is_admin,
            }
            if user.id != seller.id:
                send_email(
                    seller.email,
                    f"{seller.name} : Listing Search",
                    f"User {user.name} has searched for your listing. \nThank you for using SpartanSwap!",
                )
            return jsonify(user_data)
        else:
            return jsonify({"error": "User not found"}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

@app.route("/api/user", methods=["PUT"])
def update_user():
    # docstring
    """
    Update user information based on the JWT token.
    Returns:
        Response: JSON response indicating the success or failure of the update.
    """

    token = request.cookies.get("jwt_token")
    user = validate_session(token)
    
    if not user:
        return jsonify({"error": "Not logged in or invalid token"}), 401

    profile_data = request.json
    print(profile_data)
    try:
        # Update fields directly without app context wrapper
        user.name = profile_data.get("name", user.name)
        user.gender = profile_data.get("gender", user.gender)
        user.phone_number = profile_data.get("phoneNumber", user.phone_number)  # Note: phoneNumber vs phone_number

        user.profile_picture = profile_data.get("profile_picture", user.profile_picture)

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
    # docstring
    """
    Add a new listing to the database.
    Returns:
        Response: JSON response indicating the success or failure of the addition.
    """

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
    
@app.route("/api/delete_listing", methods=["DELETE"])
def delete_listing():
    # docstring
    """
    Delete a listing from the database.
    Returns:
        Response: JSON response indicating the success or failure of the deletion.
    """

    token = request.cookies.get("jwt_token")
    user = validate_session(token)
    
    if not user:
        return jsonify({"error": "Not logged in, or invalid token"}), 401

    listing_data = request.json
    product_id = listing_data.get("product_id")
    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400
    
    seller_id = db_instance.get_items_by_id(product_id).seller_id
    
    # Check if the user is an admin
    if not user.is_admin and user.id != seller_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    
    try:
        if db_instance.delete_item(listing_data["product_id"]):
            return jsonify({"message": "Listing Deleted Successfully"}), 200
        else:
            return jsonify({"error": "Listing not found"}), 404
    except Exception as e:
        return jsonify({"error": "Database update failed"}), 500

@app.route("/api/upload-profile-photo", methods=["POST"])
def upload_profile_photo():
    # docstring
    """
    Upload a profile photo to imgbb and return the URL.
    Returns:
        Response: JSON response containing the URL of the uploaded image.
    """

    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No file provided"}), 400

    imgbb_api_key = "aaeb2e69efbfbf1b37e059229378b797"
    url = "https://api.imgbb.com/1/upload"
    payload = {
        "key": imgbb_api_key,
        "image": base64.b64encode(file.read()),
    }

    response = requests.post(url, data=payload)
    if response.status_code == 200:
        data = response.json()
        return jsonify({"url": data["data"]["url"]})
    else:
        return jsonify({"error": "Failed to upload to imgbb"}), 500
    
@app.route("/api/upload-listing-photo", methods=["POST"])
def upload_listing_photo():
    # docstring
    """
    Upload a listing photo to imgbb and return the URL.
    Returns:
        Response: JSON response containing the URL of the uploaded image.
    """

    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No file provided"}), 400

    imgbb_api_key = "aaeb2e69efbfbf1b37e059229378b797"
    url = "https://api.imgbb.com/1/upload"
    payload = {
        "key": imgbb_api_key,
        "image": base64.b64encode(file.read()),
    }

    response = requests.post(url, data=payload)
    if response.status_code == 200:
        data = response.json()
        return jsonify({"url": data["data"]["url"]})
    else:
        return jsonify({"error": "Failed to upload to imgbb"}), 500
    
@app.route("/api/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    # docstring
    """
    Update a product listing in the database.
    Args:
        product_id (int): The ID of the product to update.
    Returns:
        Response: JSON response indicating the success or failure of the update.
    """

    token = request.cookies.get("jwt_token")
    user = validate_session(token)
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    item = db_instance.get_items_by_id(product_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404

    # Only creator or admin can edit 
    if not user.is_admin and user.id != item.seller_id:
        return jsonify({"error": "Unauthorized"}), 403
    data = request.json
    try:
        db_instance.update_item(product_id, data)
        return jsonify({"message": "Listing updated"}), 200
    except Exception as e:
        print("exception:", e)
        return jsonify({"error": str(e)}), 500

# Crear las tablas en la base de datos con manejo de errores
# Making the datatables with error handling
if __name__ == "__main__":
    try:
        app.run(port=5001, debug=True)
    except Exception as e:
        print(f"Error al crear la base de datos: {e}")
