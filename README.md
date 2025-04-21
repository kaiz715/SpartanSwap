# SpartanSwap

SpartanSwap is a web-based platform for students at Case Western Reserve University to trade, sell, or donate items easily and securely. It is composed of a Flask backend and a Next.js frontend, enabling user authentication, product listings, image uploads, and profile management.

---

## Project Structure

```
.
├── backend
│   ├── __pycache__
│   ├── admin_list.py
│   ├── app.py
│   ├── database.py
│   ├── db_class.py
│   ├── db_demo_repl.py
│   ├── email_sender.py
│   ├── environment.py
│   ├── instance
│   ├── README.md
│   ├── requirements.txt
│   ├── seed.py
│   ├── spartanswap.db
│   └── uploads
├── spartanswap
│   ├── app
│   ├── eslint.config.mjs
│   ├── globals.d.ts
│   ├── helper.py
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── node_modules
│   ├── out
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── postcss.config.mjs
│   ├── public
│   ├── README.md
│   ├── tailwind.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── package-lock.json
└── README.md
```

---

## Key Features

-   **Google OAuth**: Secure authentication via Google accounts.
-   **JWT Authentication**: Stateless session validation for frontend-backend communication.
-   **Item Listings**: Users can create, update, view, and delete listings.
-   **User Profiles**: Profile data is fetched and stored on first login.
-   **Image Uploads**: Images are hosted externally using imgbb.
-   **Admin Tools**: Admin view provides additional controls over listings.

---

## Technology Stack

-   **Frontend**: Next.js, Tailwind CSS
-   **Backend**: Flask, SQLAlchemy, JWT, Google OAuth
-   **Database**: SQLite (development)
-   **Image Hosting**: imgbb API

---

## Setup Instructions

### Backend

1. Create a virtual environment:

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

2. Install dependencies:

    ```bash
    pip install -r backend/requirements.txt
    ```

3. Set up `.env` variables in `backend/environment.py` or use an `.env` file.

4. Run the backend:
    ```bash
    cd backend
    python app.py
    ```

### Frontend

1. Navigate to the frontend directory:

    ```bash
    cd spartanswap
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

---

# SpartanSwap API Documentation

A RESTful API for SpartanSwap, a web application that allows users at Case Western Reserve University to buy and sell items. This API includes secure authentication via Google OAuth, user profile management, item listings, and image uploads.

## Base URL

```
http://localhost:5001
```

---

## Authentication

### `POST /signin`

Authenticate with a Google OAuth token.

**Request:**

-   Content-Type: `application/x-www-form-urlencoded`
-   Form Data:
    -   `credential`: Google ID token

**Response:**

```json
{
    "jwt_token": "eyJhbGci...",
    "CWRU_validated": true
}
```

---

## Session

### `GET /validate`

Validates the current session using the JWT token stored in cookies.

**Response:**

```json
{
    "valid": true,
    "user": "Jane Doe"
}
```

---

## Users

### `GET /api/user`

Fetch the authenticated user's profile.

**Response:**

```json
{
    "id": 1,
    "name": "Jane Doe",
    "gender": "Female",
    "phoneNumber": "1234567890",
    "emailAddresses": ["jane@case.edu"],
    "profile_picture": "...",
    "is_admin": false
}
```

---

### `PUT /api/user`

Update authenticated user profile.

**Request:**

```json
{
    "name": "Jane Doe",
    "gender": "Female",
    "phoneNumber": "1234567890",
    "profile_picture": "https://..."
}
```

**Response:**

```json
{ "message": "User updated successfully" }
```

---

### `GET /api/user_search/<user_id>`

Get public profile of another user by ID.

**Response:**

Same format as `/api/user`.

---

## Listings

### `GET /api/products`

Retrieve listings.

**Query Parameters (optional):**

-   `sellerId`: Filter by seller
-   `category`: Filter by category

**Response:**

```json
[
    {
        "id": 101,
        "sellerId": 1,
        "name": "Couch",
        "price": 120.5,
        "orders": 5,
        "image": "/essentials.jpg",
        "type": "Furniture",
        "color": "Green",
        "category": "Home Goods",
        "description": "Comfy couch",
        "isCustom": false
    }
]
```

---

### `PUT /api/add_listing`

Add a new listing.

**Request:**

```json
{
    "id": 1,
    "type": "Furniture",
    "category": "Home Goods",
    "color": "Green",
    "price": 100.0,
    "condition": "New",
    "name": "Desk",
    "orders": 3,
    "description": "Great condition",
    "isCustom": false,
    "image_url": "https://..."
}
```

**Response:**

```json
{ "message": "Listing added successfully" }
```

---

### `PUT /api/products/<product_id>`

Update an existing listing (owner or admin only).

**Request:**

```json
{
    "name": "Updated Desk",
    "price": 90.0
}
```

**Response:**

```json
{ "message": "Listing updated" }
```

---

### `DELETE /api/delete_listing`

Delete a listing (owner or admin only).

**Request:**

```json
{
    "product_id": 101
}
```

**Response:**

```json
{ "message": "Listing Deleted Successfully" }
```

---

## Image Uploads

### `POST /api/upload-profile-photo`

Upload a profile photo to imgbb.

**Form Data:**

-   `image`: image file

**Response:**

```json
{ "url": "https://imgbb.com/image.jpg" }
```

---

### `POST /api/upload-listing-photo`

Upload a listing photo to imgbb.

**Form Data:**

-   `image`: image file

**Response:**

```json
{ "url": "https://imgbb.com/image.jpg" }
```

---

## Error Handling

All endpoints return errors in the following format:

```json
{ "error": "Error message here" }
```

---

## Setup Notes

-   This API uses JWTs stored in cookies for session management.
-   Only users with `@case.edu` emails can sign in.
-   Admin privileges are determined by inclusion in `admin_list`.

## Testing

This section outlines the test cases used to validate the SpartanSwap platform, which serves as a marketplace for CWRU students. The platform allows users to log in with their CWRU Google account, browse and search for items, and create listings to sell.

Test cases were developed by Jenny Zhang, Kai Zheng, Willis Erdman, and Carmen Sendino Gutierrez. (Date: March 31, 2025)

Each test case includes the objective, preconditions, steps to reproduce, expected results, and post-conditions.

Backend test cases are located in backend/SpartanSwap.postman_collection.json

| Test Case ID | Objective                              | Precondition                                | Steps                                                             | Expected Result                              | Post-Condition                          |
| ------------ | -------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------- | --------------------------------------- |
| TC-01        | Users can sign in                      | User has a valid CWRU email                 | Click "Login with Google" and complete login                      | User receives JWT session cookie             | User stays on homepage, logged in       |
| TC-02        | Non-CWRU users cannot sign in          | User does not have a CWRU email             | Click "Login with Google" and attempt login                       | JWT cookie states user is not CWRU validated | User remains on homepage, not logged in |
| TC-03        | Unauthenticated users are redirected   | User not logged in                          | Access any non-homepage URL                                       | Redirect to homepage                         | User lands on homepage                  |
| TC-04        | Users can add descriptions to listings | Logged-in user on item posting form         | Click "Create Listing", fill in form, add description, and submit | Listing saved with description visible       | Description visible to others           |
| TC-05        | Users can add images to listings       | Logged-in user with local image file        | Click "Create Listing", select image file, and submit             | Image uploaded and linked to listing         | Image appears on listings page          |
| TC-06        | Users can create listings              | Valid CWRU login                            | Click "Create Listing" and fill in details                        | Database updates with new listing            | Listing visible to other users          |
| TC-07        | Users can view listings                | Logged-in user with access to listings page | Log in and open listings page                                     | Listings are fetched and displayed           | Listings are viewable by user           |
| TC-08        | Users can modify listings              | Logged-in user owns the listing             | View user profile, click edit on own listing                      | Fields updated and saved to database         | Updated info displayed in listings      |
| TC-09        | Users can get contact info             | Logged-in user                              | Click on a listing to view details                                | Contact info and profile displayed           | Static display of contact info          |
| TC-10        | Users can favorite listings            | Logged-in user viewing listings             | Click heart icon on a listing                                     | Item added to favorites, heart turns red     | Item remains in favorites list          |
| TC-11        | Users can remove favorites             | Listing already favorited                   | Click heart icon or 'X' in favorites tab                          | Item removed from favorites                  | Heart icon empties, item removed        |
| TC-12        | Filter listings by type, color, price  | Logged-in user viewing listings             | Apply filters on listings page                                    | Filtered results shown                       | Filters remain active until cleared     |
| TC-13        | Logo click returns to home             | User on any page                            | Click SpartanSwap logo                                            | Redirected to homepage                       | User lands on homepage                  |
