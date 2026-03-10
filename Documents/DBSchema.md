# Database Schema Design (MongoDB/Mongoose)

This document defines the data structure for the eCommerce platform. 
**Architect Note:** All prices stored in the `Order` model are snapshots of the price at the time of purchase. We never reference the `Product` price for historical orders to ensure data integrity if product prices change later.

## 1. User Model
Stores customer and admin credentials.

```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  isAdmin: { type: Boolean, default: false, required: true },
  addresses: [
    {
      type: {
        street: String,
        city: String,
        postalCode: String,
        country: String
      }
    }
  ],
  resetPasswordToken: String, // For password recovery
  resetPasswordExpire: Date
}