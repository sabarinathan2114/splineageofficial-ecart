# Project Folder Structure

A clean, scalable folder structure is vital for maintenance. We separate the **Client** (React) and **Server** (Node) into distinct directories.

## Root Directory
```text
/ecommerce-platform
│
├── /server                 # Backend (Node/Express)
│   ├── /config             # DB connection & config files
│   ├── /controllers        # Logic for routes (auth, products, orders)
│   ├── /models             # Mongoose Schemas (User, Product, Order)
│   ├── /routes             # API Route definitions
│   ├── /middleware         # Auth & Error handling middleware
│   ├── server.js           # Entry point
│   └── .env                # Environment variables
│
├── /client                 # Frontend (React/Redux)
│   ├── /public             # Static assets
│   ├── /src
│   │   ├── /assets         # Images, global CSS
│   │   ├── /components     # Reusable UI parts
│   │   │   ├── Header.jsx  # Navigation & Search
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── Footer.jsx
│   │   ├── /pages          # Full page views
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── ProductScreen.jsx
│   │   │   ├── CartScreen.jsx
│   │   │   ├── LoginScreen.jsx
│   │   │   └── CheckoutScreen.jsx
│   │   ├── /redux          # State Management
│   │   │   ├── store.js    # Redux store configuration
│   │   │   ├── /slices     # State slices
│   │   │   │   ├── cartSlice.js
│   │   │   │   ├── authSlice.js
│   │   │   │   └── productSlice.js
│   │   │   └── /api        # API service calls (RTK Query or Axios)
│   │   ├── /hooks          # Custom React Hooks
│   │   ├── /utils          # Helper functions (currency format, validators)
│   │   ├── App.jsx         # Main App component & Routes
│   │   └── main.jsx        # Entry point
│   └── package.json
│
└── README.md