from db_manager import DBClass, User

db = DBClass.create_new()

# Ensure the context of the application
with db.app.app_context():
    # Email of the user we want to check
    user_email = "mrg55@case.edu"  # Usa el mismo email en la búsqueda y creación

    # Try to find the user
    seller = db.db.session.query(User).filter_by(email=user_email).first()

    # If the user does not exist, create it
    if not seller:
        print("User not found. Creating new user...")
        db.add_user(email=user_email, name="Marta")
        seller = db.db.session.query(User).filter_by(email=user_email).first()

    # Now that the user exists, add an item
    if seller:
        db.add_item(seller_id=seller.id, item_type="iPad", color="White", price=250.0, condition="Used")
        print("Item successfully added.")
    else:
        print("Error: Could not retrieve the user after creation.")
