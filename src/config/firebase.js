// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBkLEz6ADgOx78QEJDrJrd1Lnepuwqii0g",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "varaha-silks.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "varaha-silks",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "varaha-silks.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "812217696139",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:812217696139:web:83372cb58b290576de798e",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-YLDS7WHED6"
};

// For server-side Firebase Admin SDK
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    // Try to load service account from file
    const serviceAccount = require('../../firebase-service-account.json');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://varaha-silks-default-rtdb.firebaseio.com"
    });
    console.log('✅ Firebase Admin SDK initialized with service account');
  } catch (error) {
    console.warn('⚠️ Firebase service account not found, trying environment variables...');
    
    // Try to use environment variables
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      try {
        const serviceAccount = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: process.env.FIREBASE_AUTH_URI,
          token_uri: process.env.FIREBASE_TOKEN_URI,
          auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
          client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
        };
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://varaha-silks-default-rtdb.firebaseio.com"
        });
        console.log('✅ Firebase Admin SDK initialized with environment variables');
      } catch (envError) {
        console.error('❌ Failed to initialize with environment variables:', envError.message);
        throw envError;
      }
    } else {
      console.warn('⚠️ No Firebase credentials found, using default credentials (may not work in development)');
      // Use default credentials (for production environments like Google Cloud)
      try {
        admin.initializeApp({
          projectId: "varaha-silks",
          databaseURL: "https://varaha-silks-default-rtdb.firebaseio.com"
        });
        console.log('✅ Firebase Admin SDK initialized with default credentials');
      } catch (defaultError) {
        console.error('❌ Failed to initialize Firebase Admin SDK:', defaultError.message);
        console.error('❌ Please set up Firebase credentials or service account file');
        throw defaultError;
      }
    }
  }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = {
  firebaseConfig,
  admin,
  db,
  auth,
  storage
};
