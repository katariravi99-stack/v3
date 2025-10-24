# Varaha Silks Backend API

A consolidated backend server for Varaha Silks e-commerce platform, combining all backend services in one organized structure.

## 🚀 Features

- **Razorpay Payment Integration** - Complete payment processing
- **Firebase Integration** - Authentication, Firestore, Storage, Realtime Database
- **Product Management** - CRUD operations for products
- **Order Management** - Order creation, tracking, and status updates
- **User Management** - User profiles, authentication, and authorization
- **Cart & Wishlist** - User cart and wishlist management
- **File Upload** - Image and video upload to Firebase Storage
- **Announcements** - Dynamic announcement system
- **Contact System** - Contact form message handling
- **Founder Videos** - Video content management

## 📁 Directory Structure

```
server/
├── src/
│   ├── config/
│   │   ├── firebase.js          # Firebase configuration
│   │   └── razorpay.js          # Razorpay configuration
│   ├── services/
│   │   ├── auth.js              # Authentication services
│   │   ├── firestore.js         # Firestore database operations
│   │   ├── razorpayService.js   # Razorpay payment services
│   │   └── storage.js           # Firebase Storage operations
│   ├── routes/
│   │   ├── health.js            # Health check routes
│   │   └── products.js          # Product routes
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling middleware
│   │   └── notFound.js          # 404 handler middleware
│   ├── data/
│   │   ├── orders.js            # Order data management
│   │   └── products.json        # Product data
│   ├── index.js                 # Main services export
│   └── server.js                # Main server file
├── razorpay-server.js           # Standalone Razorpay server
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the server directory:
   ```env
   # Server Configuration
   PORT=5000
   CLIENT_URL=http://localhost:3000

   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. **Firebase Service Account:**
   - Download your Firebase service account JSON file
   - Place it as `firebase-service-account.json` in the server root
   - Or use environment variables for production

## 🚀 Running the Server

### Main Backend Server (All Services)
```bash
# Development
npm run dev

# Production
npm start
```

### Standalone Razorpay Server
```bash
# Development
npm run dev:razorpay

# Production
npm run razorpay
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders/user/:userId` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Cart & Wishlist
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/:userId` - Save user cart
- `GET /api/wishlist/:userId` - Get user wishlist
- `POST /api/wishlist/:userId` - Save user wishlist

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user profile

### Founder Videos
- `GET /api/founder-videos` - Get all founder videos
- `POST /api/founder-videos` - Add founder video

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/active` - Get active announcements

### Contact
- `POST /api/contact` - Send contact message

### Razorpay (Legacy Endpoints)
- `POST /api/orders/create` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/orders/save` - Save order to database
- `GET /api/orders` - Get all orders
- `GET /api/payments/status/:paymentId` - Get payment status

## 🔧 Services Available

### Firebase Services
- **Authentication** - User management, custom tokens, email verification
- **Firestore** - Database operations for products, orders, users, etc.
- **Storage** - File upload and management
- **Realtime Database** - Real-time cart and wishlist sync

### Razorpay Services
- **Payment Processing** - Order creation, payment verification
- **Order Management** - Order tracking and status updates
- **Signature Verification** - Secure payment verification

### Utility Services
- **Rate Limiting** - API rate limiting to prevent abuse
- **Error Handling** - Comprehensive error handling and logging
- **File Management** - Image and video upload with metadata

## 🔒 Security Features

- **CORS Configuration** - Proper cross-origin resource sharing
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Validates all incoming data
- **Error Handling** - Secure error responses
- **Firebase Security Rules** - Database security rules
- **Payment Verification** - Secure payment signature verification

## 📊 Monitoring & Logging

- **Health Checks** - Server health monitoring
- **Request Logging** - Detailed request/response logging
- **Error Tracking** - Comprehensive error logging
- **Performance Monitoring** - Request timing and performance metrics

## 🚀 Deployment

### Environment Variables
Set the following environment variables in your production environment:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://yourdomain.com
RAZORPAY_KEY_ID=your_live_key_id
RAZORPAY_KEY_SECRET=your_live_key_secret
```

### Firebase Setup
1. Enable Firebase Admin SDK in your Firebase project
2. Generate and download service account key
3. Set up Firebase Security Rules
4. Configure Firebase Storage rules

### Razorpay Setup
1. Get live API keys from Razorpay Dashboard
2. Configure webhook endpoints
3. Set up payment methods and limits

## 🛠️ Development

### Adding New Services
1. Create service file in `src/services/`
2. Export functions from the service
3. Import and use in `src/index.js`
4. Add API endpoints in `src/server.js`

### Database Schema
- **Products** - Product information, images, pricing
- **Orders** - Order details, payment info, status
- **Users** - User profiles, authentication data
- **Carts** - User shopping cart items
- **Wishlists** - User wishlist items
- **Announcements** - Site announcements and notifications
- **Founder Videos** - Video content management
- **Contact Messages** - Contact form submissions

## 📝 API Documentation

For detailed API documentation, visit: `http://localhost:5000/api/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Varaha Silks Backend API v2.0.0** - All backend services consolidated for easy navigation and management.
