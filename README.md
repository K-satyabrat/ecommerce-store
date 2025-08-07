# 🛍️ E-Commerce Store

A full-stack e-commerce application built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, payment processing with Stripe, and admin analytics.

## ✨ Features

### 🛒 Customer Features
- **User Authentication**: Sign up, login, and profile management
- **Product Browsing**: Browse products by categories with search functionality
- **Shopping Cart**: Add/remove items, update quantities, apply coupons
- **Payment Processing**: Secure checkout with Stripe integration
- **Order Management**: View order history and track orders
- **Responsive Design**: Mobile-friendly interface with modern UI

### 👨‍💼 Admin Features
- **Product Management**: Add, edit, delete products with image uploads
- **Analytics Dashboard**: Sales reports, revenue tracking, user statistics
- **Coupon System**: Create and manage discount coupons
- **Featured Products**: Highlight special products on homepage
- **Order Management**: View and manage customer orders

### 🔧 Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Redis Caching**: Fast session and data caching
- **Image Upload**: Cloudinary integration for product images
- **Real-time Updates**: Live cart and order updates
- **Error Handling**: Comprehensive error handling and user feedback

## 🚀 Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **Stripe.js** - Payment processing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Redis** - Caching
- **Stripe** - Payment gateway
- **Cloudinary** - Image storage
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
ecommerce-store/
├── backend/                    # Backend server
│   ├── config/
│   │   └── db.js             # Database configuration
│   ├── controllers/           # Route controllers
│   │   ├── analytics.controller.js
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── coupon.controller.js
│   │   ├── payment.controller.js
│   │   └── product.controller.js
│   ├── lib/                   # External service configurations
│   │   ├── cloudinary.js
│   │   ├── redis.js
│   │   └── stripe.js
│   ├── middlewares/           # Custom middlewares
│   │   └── auth.middleware.js
│   ├── models/                # Database models
│   │   ├── coupon.model.js
│   │   ├── order.model.js
│   │   ├── product.model.js
│   │   └── user.model.js
│   ├── routes/                # API routes
│   │   ├── analytics.routes.js
│   │   ├── auth.routes.js
│   │   ├── cart.routes.js
│   │   ├── coupon.routes.js
│   │   ├── payment.routes.js
│   │   └── product.routes.js
│   ├── utils/                 # Utility functions
│   │   ├── cookieHelpers.js
│   │   └── generateToken.js
│   ├── server.js              # Main server file
│   └── env.example           # Environment variables template
│
├── frontend/                  # Frontend application
│   ├── public/               # Static assets
│   │   ├── bags.jpg
│   │   ├── glasses.png
│   │   ├── jackets.jpg
│   │   ├── jeans.jpg
│   │   ├── shoes.jpg
│   │   ├── suits.jpg
│   │   └── tshirts.jpg
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Analytics.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── CategoryItem.jsx
│   │   │   ├── CreateProductForm.jsx
│   │   │   ├── EmptyCartUI.jsx
│   │   │   ├── FeaturedProducts.jsx
│   │   │   ├── GiftCouponCard.jsx
│   │   │   ├── LoadingSpiner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrderSummary.jsx
│   │   │   ├── PeopleAlsoBought.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductsList.jsx
│   │   ├── constants/
│   │   │   └── categories.js
│   │   ├── lib/
│   │   │   └── axiosInstance.js
│   │   ├── pages/            # Page components
│   │   │   ├── AdminPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PurchaseCancelPage.jsx
│   │   │   ├── PurchaseSuccessPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── stores/           # Zustand state stores
│   │   │   ├── useCartStore.js
│   │   │   ├── useProductStore.js
│   │   │   └── useUserStore.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── env.example          # Frontend environment template
│
├── package.json              # Root package.json
├── .gitignore
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud)
- **Redis** (optional, for caching)
- **Stripe Account** (for payments)
- **Cloudinary Account** (for image uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/K-satyabrat/ecommerce-store.git
cd ecommerce-store
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

#### Backend Environment
```bash
cd backend
cp env.example .env
```

Edit `backend/.env` with your actual values:
```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce_store

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Client URL
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

#### Frontend Environment
```bash
cd frontend
cp env.example .env
```

Edit `frontend/.env` with your actual values:
```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 4. Start the Application

#### Development Mode
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

#### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart` - Remove item from cart

### Payments
- `POST /api/payment/create-checkout-session` - Create Stripe checkout
- `POST /api/payment/checkout-success` - Handle successful payment

### Coupons
- `GET /api/coupons` - Get user coupons
- `POST /api/coupons/validate` - Validate coupon code

### Analytics (Admin)
- `GET /api/analytics` - Get sales analytics

## 👥 User Roles

### Customer
- Browse products
- Add items to cart
- Apply coupons
- Complete purchases


### Admin
- Manage products
- View analytics
- Create coupons
- Manage orders
- Feature products

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** with bcrypt
- **CORS Protection** for cross-origin requests
- **Input Validation** and sanitization
- **Secure Cookie** handling

## 🙏 Acknowledgments

- **Stripe** for payment processing
- **Cloudinary** for image management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management

## Deployment_url
-https://e-store-xq62.onrender.com