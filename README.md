# 📚 Gallery API Documentation

A comprehensive RESTful API for a photo gallery application with user authentication, album management, and image upload capabilities.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd galleryy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/gallery
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

---

## 📋 API Overview

### Base Configuration

- **Base URL**: `http://localhost:5000`
- **API Prefix**: `/api`
- **Content Type**: `application/json`
- **Authentication**: JWT Bearer Token
- **Token Expiry**: 7 days

### API Structure

```
/api
├── /auth          # Authentication endpoints
├── /albums        # Album management
└── /images        # Image management
```

---

## 🔐 Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

**Request Schema:**

```json
{
  "username": "string (required, 3-30 characters)",
  "email": "string (required, valid email format)",
  "password": "string (required, minimum 6 characters)"
}
```

**Response Schema:**

```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "number",
      "username": "string",
      "email": "string"
    },
    "token": "string (JWT token)"
  }
}
```

**Error Responses:**

- `400` - Validation errors (missing fields, invalid format)
- `409` - Email already exists

**Example Request:**

```javascript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "john_doe",
    email: "john@example.com",
    password: "password123",
  }),
});
```

---

### Login User

```http
POST /api/auth/login
```

**Request Schema:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response Schema:**

```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "number",
      "username": "string",
      "email": "string"
    },
    "token": "string (JWT token)"
  }
}
```

**Error Responses:**

- `400` - Invalid credentials
- `401` - Authentication failed

**Example Request:**

```javascript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    password: "password123",
  }),
});
```

---

### Get User Profile

```http
GET /api/auth/profile
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response Schema:**

```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": "number",
    "username": "string",
    "email": "string"
  }
}
```

**Error Responses:**

- `401` - No token provided or invalid token

**Example Request:**

```javascript
const response = await fetch("/api/auth/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

---

## 📁 Album Endpoints

### Get All Albums

```http
GET /api/albums
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response Schema:**

```json
{
  "message": "Albums retrieved successfully",
  "data": [
    {
      "id": "number",
      "name": "string",
      "userId": "number",
      "createdAt": "string (ISO 8601 date)",
      "updatedAt": "string (ISO 8601 date)",
      "user": {
        "id": "number",
        "username": "string",
        "email": "string"
      },
      "images": [
        {
          "id": "number",
          "title": "string",
          "description": "string",
          "url": "string"
        }
      ]
    }
  ]
}
```

---

### Create Album

```http
POST /api/albums
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Schema:**

```json
{
  "name": "string (required, 1-100 characters)"
}
```

**Response Schema:**

```json
{
  "message": "Album created successfully",
  "data": {
    "id": "number",
    "name": "string",
    "userId": "number",
    "createdAt": "string (ISO 8601 date)",
    "updatedAt": "string (ISO 8601 date)"
  }
}
```

**Example Request:**

```javascript
const response = await fetch("/api/albums", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "My Vacation Photos",
  }),
});
```

---

### Get Album by ID

```http
GET /api/albums/:id
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response Schema:**

```json
{
  "message": "Album retrieved successfully",
  "data": {
    "id": "number",
    "name": "string",
    "userId": "number",
    "user": {
      "id": "number",
      "username": "string",
      "email": "string"
    },
    "images": [
      {
        "id": "number",
        "title": "string",
        "description": "string",
        "url": "string",
        "albumId": "number"
      }
    ]
  }
}
```

**Error Responses:**

- `404` - Album not found
- `403` - Not authorized to access this album

---

### Update Album

```http
PUT /api/albums/:id
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Schema:**

```json
{
  "name": "string (required, 1-100 characters)"
}
```

**Response Schema:**

```json
{
  "message": "Album updated successfully",
  "data": {
    "id": "number",
    "name": "string",
    "userId": "number",
    "createdAt": "string (ISO 8601 date)",
    "updatedAt": "string (ISO 8601 date)"
  }
}
```

**Error Responses:**

- `404` - Album not found
- `403` - Not authorized to update this album

---

### Delete Album

```http
DELETE /api/albums/:id
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response Schema:**

```json
{
  "message": "Album deleted successfully",
  "data": {
    "message": "Album deleted successfully"
  }
}
```

**Error Responses:**

- `404` - Album not found
- `403` - Not authorized to delete this album

---

### Get Album Statistics

```http
GET /api/albums/stats
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response Schema:**

```json
{
  "message": "Album statistics retrieved successfully",
  "data": [
    {
      "id": "number",
      "name": "string",
      "imageCount": "string (number as string)"
    }
  ]
}
```

---

## 🖼️ Image Endpoints

### Get Album Images

```http
GET /api/images/album/:albumId
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response Schema:**

```json
{
  "message": "Images retrieved successfully",
  "data": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "url": "string",
      "albumId": "number",
      "createdAt": "string (ISO 8601 date)",
      "updatedAt": "string (ISO 8601 date)"
    }
  ]
}
```

**Error Responses:**

- `404` - Album not found
- `403` - Not authorized to access this album

---

### Upload Single Image

```http
POST /api/images/album/:albumId
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Schema (Form Data):**

```
title: string (optional, 1-100 characters)
description: string (optional, maximum 500 characters)
image: file (required, image file - jpg, jpeg, png, gif)
```

**Response Schema:**

```json
{
  "message": "Image uploaded successfully",
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "url": "string (path to image)",
    "albumId": "number",
    "createdAt": "string (ISO 8601 date)",
    "updatedAt": "string (ISO 8601 date)"
  }
}
```

**Error Responses:**

- `400` - Invalid file type or size (max 5MB)
- `404` - Album not found
- `403` - Not authorized to upload to this album

**Example Request:**

```javascript
const formData = new FormData();
formData.append("title", "My Photo");
formData.append("description", "A beautiful sunset");
formData.append("image", fileInput.files[0]);

const response = await fetch(`/api/images/album/${albumId}`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

---

### Upload Multiple Images

```http
POST /api/images/album/:albumId/multiple
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Schema (Form Data):**

```
images: files (required, multiple image files)
```

**Response Schema:**

```json
{
  "message": "Images uploaded successfully",
  "data": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "url": "string",
      "albumId": "number"
    }
  ]
}
```

**Example Request:**

```javascript
const formData = new FormData();
Array.from(fileInput.files).forEach((file) => {
  formData.append("images", file);
});

const response = await fetch(`/api/images/album/${albumId}/multiple`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

---

### Get Image by ID

```http
GET /api/images/:id
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response Schema:**

```json
{
  "message": "Image retrieved successfully",
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "url": "string",
    "albumId": "number",
    "album": {
      "id": "number",
      "name": "string"
    }
  }
}
```

**Error Responses:**

- `404` - Image not found
- `403` - Not authorized to access this image

---

### Update Image

```http
PUT /api/images/:id
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Schema:**

```json
{
  "title": "string (optional, 1-100 characters)",
  "description": "string (optional, maximum 500 characters)"
}
```

**Response Schema:**

```json
{
  "message": "Image updated successfully",
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "url": "string",
    "albumId": "number"
  }
}
```

**Error Responses:**

- `404` - Image not found
- `403` - Not authorized to update this image

---

### Delete Image

```http
DELETE /api/images/:id
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response Schema:**

```json
{
  "message": "Image deleted successfully",
  "data": {
    "message": "Image deleted successfully"
  }
}
```

**Error Responses:**

- `404` - Image not found
- `403` - Not authorized to delete this image

---

### Get Image Statistics

```http
GET /api/images/stats
```

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response Schema:**

```json
{
  "message": "Image statistics retrieved successfully",
  "data": [
    {
      "albumId": "number",
      "imageCount": "string (number as string)",
      "album": {
        "id": "number",
        "name": "string"
      }
    }
  ]
}
```

---

## 🔧 Frontend Integration Guide

### 1. Authentication Setup

**API Client Configuration:**

```javascript
const API_BASE = "http://localhost:5000/api";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem("token");
  }

  // Set token after login/register
  setToken(token) {
    localStorage.setItem("token", token);
  }

  // Remove token on logout
  removeToken() {
    localStorage.removeItem("token");
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      if (error.message.includes("401")) {
        this.removeToken();
        // Redirect to login
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // File upload
  async upload(endpoint, formData) {
    const token = this.getToken();
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    return data;
  }
}

const apiClient = new ApiClient();
```

### 2. Authentication Methods

```javascript
// Register new user
const register = async (userData) => {
  try {
    const response = await apiClient.post("/auth/register", userData);
    apiClient.setToken(response.data.token);
    return response;
  } catch (error) {
    throw error;
  }
};

// Login user
const login = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    apiClient.setToken(response.data.token);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get user profile
const getProfile = async () => {
  try {
    return await apiClient.get("/auth/profile");
  } catch (error) {
    throw error;
  }
};

// Logout user
const logout = () => {
  apiClient.removeToken();
  // Redirect to login page
};
```

### 3. Album Management

```javascript
// Get all albums
const getAlbums = async () => {
  return await apiClient.get("/albums");
};

// Create new album
const createAlbum = async (albumData) => {
  return await apiClient.post("/albums", albumData);
};

// Get album by ID
const getAlbum = async (albumId) => {
  return await apiClient.get(`/albums/${albumId}`);
};

// Update album
const updateAlbum = async (albumId, albumData) => {
  return await apiClient.put(`/albums/${albumId}`, albumData);
};

// Delete album
const deleteAlbum = async (albumId) => {
  return await apiClient.delete(`/albums/${albumId}`);
};

// Get album statistics
const getAlbumStats = async () => {
  return await apiClient.get("/albums/stats");
};
```

### 4. Image Management

```javascript
// Get album images
const getAlbumImages = async (albumId) => {
  return await apiClient.get(`/images/album/${albumId}`);
};

// Upload single image
const uploadImage = async (albumId, file, title = "", description = "") => {
  const formData = new FormData();
  formData.append("image", file);
  if (title) formData.append("title", title);
  if (description) formData.append("description", description);

  return await apiClient.upload(`/images/album/${albumId}`, formData);
};

// Upload multiple images
const uploadMultipleImages = async (albumId, files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append("images", file);
  });

  return await apiClient.upload(`/images/album/${albumId}/multiple`, formData);
};

// Get image by ID
const getImage = async (imageId) => {
  return await apiClient.get(`/images/${imageId}`);
};

// Update image
const updateImage = async (imageId, imageData) => {
  return await apiClient.put(`/images/${imageId}`, imageData);
};

// Delete image
const deleteImage = async (imageId) => {
  return await apiClient.delete(`/images/${imageId}`);
};

// Get image statistics
const getImageStats = async () => {
  return await apiClient.get("/images/stats");
};
```

### 5. Error Handling

```javascript
// Global error handler
const handleApiError = (error) => {
  console.error("API Error:", error);

  if (error.message.includes("401")) {
    // Unauthorized - redirect to login
    logout();
    return "Please log in again";
  }

  if (error.message.includes("403")) {
    return "You do not have permission to perform this action";
  }

  if (error.message.includes("404")) {
    return "Resource not found";
  }

  if (error.message.includes("409")) {
    return "Resource already exists";
  }

  return error.message || "An unexpected error occurred";
};

// Usage in components
try {
  const albums = await getAlbums();
  // Handle success
} catch (error) {
  const errorMessage = handleApiError(error);
  // Show error to user
}
```

### 6. React Hook Example

```javascript
import { useState, useEffect } from "react";

const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        setData(result.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

// Usage
const AlbumsList = () => {
  const { data: albums, loading, error } = useApi(getAlbums);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {albums.map((album) => (
        <div key={album.id}>{album.name}</div>
      ))}
    </div>
  );
};
```

---

## 📊 Response Status Codes

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| 200         | Success                                 |
| 201         | Created                                 |
| 400         | Bad Request - Validation errors         |
| 401         | Unauthorized - Invalid or missing token |
| 403         | Forbidden - Insufficient permissions    |
| 404         | Not Found - Resource doesn't exist      |
| 409         | Conflict - Resource already exists      |
| 500         | Internal Server Error                   |

---

## 🔒 Security Considerations

### Token Management

- Store JWT tokens securely (localStorage for SPAs, httpOnly cookies for SSR)
- Implement token refresh logic for long sessions
- Clear tokens on logout and token expiration

### File Upload Security

- Validate file types on frontend before upload
- Implement file size limits
- Sanitize file names
- Use secure file storage

### Error Handling

- Don't expose sensitive information in error messages
- Log errors appropriately
- Handle network errors gracefully

---

## 🚀 Development Workflow

### 1. Setup Phase

- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Set up database
- [ ] Run migrations

### 2. Testing Phase

- [ ] Test authentication endpoints
- [ ] Test CRUD operations
- [ ] Test file uploads
- [ ] Test error scenarios

### 3. Integration Phase

- [ ] Set up API client
- [ ] Implement authentication flow
- [ ] Add protected routes
- [ ] Implement error handling

### 4. Production Phase

- [ ] Update base URL for production
- [ ] Configure CORS settings
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting

---

## 📝 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Albums Table

```sql
CREATE TABLE albums (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Images Table

```sql
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  url VARCHAR(255) NOT NULL,
  album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon
npm start           # Start production server

# Database
npm run db:create   # Create database
npm run db:drop     # Drop database
npm run db:migrate  # Run migrations
npm run db:seed     # Seed database
npm run db:reset    # Reset database (drop, create, migrate, seed)
```

---

## 📁 Project Structure

```
galleryy/
├── config/                 # Configuration files
│   ├── config.json        # Database configuration
│   ├── database.js        # Sequelize instance
│   └── env.js            # Environment variables
├── controllers/           # Request handlers
│   ├── authController.js
│   ├── albumController.js
│   └── imageController.js
├── middleware/           # Custom middleware
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── migration/           # Database migrations
├── models/             # Sequelize models
│   ├── User.js
│   ├── Album.js
│   ├── Image.js
│   └── index.js
├── routes/             # API routes
│   ├── auth.js
│   ├── albums.js
│   ├── images.js
│   └── index.js
├── seeders/           # Database seeders
├── services/          # Business logic
│   ├── authService.js
│   ├── albumService.js
│   └── imageService.js
├── utils/             # Utility functions
│   ├── jwt.js
│   ├── logger.js
│   └── multerConfig.js
├── public/            # Static files
│   └── images/        # Uploaded images
├── server.js          # Main application file
└── package.json
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the error logs

---

## 🔄 API Versioning

Current API version: v1

All endpoints are prefixed with `/api`. Future versions will use `/api/v2`, `/api/v3`, etc.

---

_This documentation is designed to be both human-readable and AI-friendly for seamless frontend integration._
