# written by willis erdman for csds 493
# feb 26, 2025

"""
db_repl.py
----------
A simple REPL for interacting with the Spartanswap database.

Options:
    0: Quit
    1: Add Item
    2: See All Items
"""

from db_class import (
    DBClass,
    User,
    Item,
)  # Adjust the module name if your file is named differently


def main():
    # Initialize the database and create all tables.
    db_instance = DBClass.create_new()

    while True:
        print("\n=== Spartanswap DB REPL ===")
        print("0: Quit")
        print("1: Add Item")
        print("2: See All Items")
        choice = input("Enter your choice: ").strip()

        if choice == "0":
            print("Exiting REPL.")
            break

        elif choice == "1":
            print("\n--- Add New Item ---")
            seller_id = input("Enter seller ID (integer): ").strip()
            item_type = input("Enter item type: ").strip()
            color = input("Enter color: ").strip()
            price = input("Enter price: ").strip()
            condition = input("Enter condition: ").strip()
            image_url = input(
                "Enter image URL (optional, press Enter to skip): "
            ).strip()

            # Validate seller_id and price
            try:
                seller_id = int(seller_id)
                price = float(price)
            except ValueError:
                print("Invalid input for seller ID or price. Please try again.")
                continue

            # Call add_item method from DBClass
            db_instance.add_item(
                seller_id=seller_id,
                item_type=item_type,
                color=color,
                price=price,
                condition=condition,
                image_url=image_url if image_url else None,
            )

        elif choice == "2":
            print("\n--- All Items ---")
            items = db_instance.get_all_items()
            if not items:
                print("No items found.")
            else:
                for item in items:
                    print(
                        f"ID: {item.id} | Type: {item.item_type} | Color: {item.color} | Price: {item.price} | Condition: {item.condition}"
                    )
        else:
            print("Invalid option. Please try again.")


if __name__ == "__main__":
    main()
