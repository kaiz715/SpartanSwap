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
