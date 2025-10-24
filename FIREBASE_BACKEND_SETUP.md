# Firebase Backend Setup Guide

## Current Status ✅
Your backend already has Firebase configured in the `.env` file with the following:
- Firebase project ID: `varaha-silks`
- All necessary Firebase configuration variables
- Firebase Admin SDK dependency installed

## What You Need to Complete the Setup

### 1. Firebase Service Account Key
You need to download the Firebase service account JSON file:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `varaha-silks`
3. Go to Project Settings (gear icon) → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Rename it to `firebase-service-account.json`
7. Place it in the `server/` directory

### 2. Alternative: Environment Variables Method
If you prefer not to use the JSON file, you can add these environment variables to your `.env` file:

```env
# Firebase Service Account Environment Variables
FIREBASE_PRIVATE_KEY_ID=your_private_key_id_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@varaha-silks.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id_here
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40varaha-silks.iam.gserviceaccount.com
```

### 3. Test the Setup
Once you have either the JSON file or environment variables set up, test your backend:

```bash
cd server
npm start
```

You should see:
```
✅ Firebase Admin SDK initialized with service account
✅ Varaha Silks Backend API running on http://localhost:5000
```

## Current .env Configuration
Your current `.env` file already contains:
- ✅ Firebase project configuration
- ✅ Razorpay configuration
- ✅ Server port configuration

## Firebase Services Available
Your backend is configured to use:
- **Firestore** - Database operations
- **Firebase Auth** - User authentication
- **Firebase Storage** - File uploads
- **Firebase Realtime Database** - Real-time data

## API Endpoints Available
Your backend provides these Firebase-powered endpoints:
- `/api/products` - Product management
- `/api/orders` - Order management
- `/api/cart/:userId` - Cart operations
- `/api/wishlist/:userId` - Wishlist operations
- `/api/users` - User management
- `/api/founder-videos` - Video management
- `/api/announcements` - Announcement management
- `/api/contact` - Contact form submissions

## Next Steps
1. Download the Firebase service account JSON file
2. Place it in the `server/` directory
3. Test the backend with `npm start`
4. Your Firebase backend integration will be complete!

## Troubleshooting
If you see Firebase initialization errors:
1. Check that the service account JSON file is in the correct location
2. Verify the Firebase project ID matches your actual project
3. Ensure the service account has the necessary permissions
4. Check the console logs for specific error messages
