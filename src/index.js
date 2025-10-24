// Main backend services index
// This file consolidates all backend services for easy access

// Configuration
const { firebaseConfig, admin, db, auth, storage } = require('./config/firebase');
const { RAZORPAY_CONFIG, getRazorpayOptions, PAYMENT_METHODS, SUPPORTED_PAYMENT_METHODS } = require('./config/razorpay');

// Services
const {
  initializeRazorpay,
  createRazorpayOrder,
  verifyPaymentSignature,
  processRazorpayPayment,
  getPaymentStatus,
  saveOrderToDatabase
} = require('./services/razorpayService');

const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  getUserOrders,
  updateOrderStatus,
  addContactMessage,
  saveUserCart,
  getUserCart,
  saveUserWishlist,
  getUserWishlist,
  createUserProfile,
  getUserProfile,
  getAllUsers,
  getFounderVideos,
  addFounderVideo,
  getAnnouncements,
  getActiveAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus
} = require('./services/firestore');

const {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  listUsers,
  setCustomUserClaims,
  verifyIdToken,
  createCustomToken,
  revokeRefreshTokens,
  generateEmailVerificationLink,
  generatePasswordResetLink
} = require('./services/auth');

const {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFileMetadata,
  listFiles,
  uploadProductImages,
  uploadProfileImage,
  uploadVideoFile,
  uploadFounderVideo,
  getFileSizeString,
  generateSignedUrl
} = require('./services/storage');

// Export all services
module.exports = {
  // Configuration
  firebaseConfig,
  admin,
  db,
  auth,
  storage,
  RAZORPAY_CONFIG,
  getRazorpayOptions,
  PAYMENT_METHODS,
  SUPPORTED_PAYMENT_METHODS,
  
  // Razorpay Services
  initializeRazorpay,
  createRazorpayOrder,
  verifyPaymentSignature,
  processRazorpayPayment,
  getPaymentStatus,
  saveOrderToDatabase,
  
  // Firestore Services
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  getUserOrders,
  updateOrderStatus,
  addContactMessage,
  saveUserCart,
  getUserCart,
  saveUserWishlist,
  getUserWishlist,
  createUserProfile,
  getUserProfile,
  getAllUsers,
  getFounderVideos,
  addFounderVideo,
  getAnnouncements,
  getActiveAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
  
  // Auth Services
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  listUsers,
  setCustomUserClaims,
  verifyIdToken,
  createCustomToken,
  revokeRefreshTokens,
  generateEmailVerificationLink,
  generatePasswordResetLink,
  
  // Storage Services
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFileMetadata,
  listFiles,
  uploadProductImages,
  uploadProfileImage,
  uploadVideoFile,
  uploadFounderVideo,
  getFileSizeString,
  generateSignedUrl
};
