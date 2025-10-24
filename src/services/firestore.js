const { db } = require('../config/firebase');

// Collections
const PRODUCTS_COLLECTION = "products";
const FOUNDER_VIDEOS_COLLECTION = "founderVideos";
const ORDERS_COLLECTION = "orders";
const CONTACT_MESSAGES_COLLECTION = "contactMessages";
const CARTS_COLLECTION = "carts";
const WISHLISTS_COLLECTION = "wishlists";
const ANNOUNCEMENTS_COLLECTION = "announcements";

// Helper function to check if product exists
const productExists = async (productId) => {
  try {
    const productRef = db.collection(PRODUCTS_COLLECTION).doc(productId);
    const productSnap = await productRef.get();
    return productSnap.exists;
  } catch (error) {
    console.error('Error checking if product exists:', error);
    return false;
  }
};

// Rate limiting variables
let requestCount = 0;
let lastRequestTime = 0;
const REQUEST_LIMIT = 10; // Max 10 requests per minute
const REQUEST_WINDOW = 60000; // 1 minute window

// Rate limiting function
const checkRateLimit = () => {
  const now = Date.now();
  
  // Reset counter if window has passed
  if (now - lastRequestTime > REQUEST_WINDOW) {
    requestCount = 0;
    lastRequestTime = now;
  }
  
  // Check if we've exceeded the limit
  if (requestCount >= REQUEST_LIMIT) {
    const waitTime = REQUEST_WINDOW - (now - lastRequestTime);
    console.warn(`🚫 Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
    return false;
  }
  
  requestCount++;
  return true;
};

// Products operations
const getProducts = async (retryCount = 0) => {
  // Check rate limit first
  if (!checkRateLimit()) {
    console.log('📦 Using cached products due to rate limiting');
    return [];
  }
  
  const maxRetries = 1;
  const baseTimeout = 10000;
  const retryDelay = 2000;
  
  try {
    const productsRef = db.collection(PRODUCTS_COLLECTION);
    const snapshot = await productsRef.get();
    
    console.log(`✅ Products loaded successfully${retryCount > 0 ? ` (retry ${retryCount})` : ''}: ${snapshot.docs.length} products`);
    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      const { id: customId, ...dataWithoutId } = data;
      return { 
        id: doc.id,
        ...dataWithoutId,
        customId: customId || null
      };
    });
    
    return products;
  } catch (error) {
    console.error(`Error getting products (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < maxRetries && (error.message.includes('timeout') || error.message.includes('network') || error.message.includes('unavailable'))) {
      console.log(`🔄 Retrying get products in ${retryDelay}ms... (attempt ${retryCount + 2}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return getProducts(retryCount + 1);
    }
    
    return [];
  }
};

const getProductById = async (productId) => {
  try {
    const productRef = db.collection(PRODUCTS_COLLECTION).doc(productId);
    const snapshot = await productRef.get();
    if (snapshot.exists) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

const addProduct = async (productData) => {
  try {
    if (!productData.name || !productData.description || !productData.price) {
      throw new Error("Missing required fields: name, description, and price are required");
    }

    if (typeof productData.price !== 'number' || productData.price <= 0) {
      throw new Error("Price must be a positive number");
    }

    let productId = productData.id;
    if (!productId) {
      const category = productData.category || 'general';
      const nameWords = productData.name.toLowerCase().split(' ').slice(0, 2);
      const prefix = category.substring(0, 3).toUpperCase();
      const suffix = nameWords.map(word => word.substring(0, 2)).join('').toUpperCase();
      productId = `${prefix}-${suffix}`;
      
      let counter = 1;
      let finalId = productId;
      while (await productExists(finalId)) {
        finalId = `${productId}-${counter.toString().padStart(3, '0')}`;
        counter++;
      }
      productId = finalId;
    }
    
    const productRef = db.collection(PRODUCTS_COLLECTION).doc(productId);
    
    await productRef.set({
      ...productData,
      id: productId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log("✅ Product added successfully with custom ID:", productId);
    return productId;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

const updateProduct = async (productId, productData) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required for update");
    }

    if (productData.price !== undefined && (typeof productData.price !== 'number' || productData.price <= 0)) {
      throw new Error("Price must be a positive number");
    }

    const productRef = db.collection(PRODUCTS_COLLECTION).doc(productId);
    
    const productSnap = await productRef.get();
    
    if (!productSnap.exists) {
      throw new Error(`Product with ID "${productId}" not found.`);
    }
    
    await productRef.update({
      ...productData,
      updatedAt: new Date(),
    });
    
    console.log(`✅ Product updated successfully: ${productId}`);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

const deleteProduct = async (productId) => {
  try {
    const productRef = db.collection(PRODUCTS_COLLECTION).doc(productId);
    await productRef.delete();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Orders operations
const createOrder = async (orderData) => {
  try {
    const ordersRef = db.collection(ORDERS_COLLECTION);
    const docRef = await ordersRef.add({
      ...orderData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

const getUserOrders = async (userId) => {
  try {
    console.log('🔍 getUserOrders (server): Fetching orders for user:', userId);
    
    const ordersRef = db.collection(ORDERS_COLLECTION);
    
    // First, try to get orders by userId (without orderBy to avoid index requirement)
    const userIdQuery = ordersRef.where("userId", "==", userId);
    const userIdSnapshot = await userIdQuery.get();
    
    // Then, try to get orders by customerInfo.email (without orderBy to avoid index requirement)
    const customerEmailQuery = ordersRef.where("customerInfo.email", "==", userId);
    const customerEmailSnapshot = await customerEmailQuery.get();
    
    // Also try customerEmail field (alternative field name)
    const customerEmailAltQuery = ordersRef.where("customerEmail", "==", userId);
    const customerEmailAltSnapshot = await customerEmailAltQuery.get();
    
    // Also try loggedInUserEmail field (for orders placed by logged-in users)
    const loggedInUserEmailQuery = ordersRef.where("loggedInUserEmail", "==", userId);
    const loggedInUserEmailSnapshot = await loggedInUserEmailQuery.get();
    
    // Combine all results and remove duplicates
    const allOrders = new Map();
    
    // Add orders from userId query
    userIdSnapshot.docs.forEach(doc => {
      allOrders.set(doc.id, { id: doc.id, ...doc.data() });
    });
    
    // Add orders from customerInfo.email query
    customerEmailSnapshot.docs.forEach(doc => {
      allOrders.set(doc.id, { id: doc.id, ...doc.data() });
    });
    
    // Add orders from customerEmail query
    customerEmailAltSnapshot.docs.forEach(doc => {
      allOrders.set(doc.id, { id: doc.id, ...doc.data() });
    });
    
    // Add orders from loggedInUserEmail query
    loggedInUserEmailSnapshot.docs.forEach(doc => {
      allOrders.set(doc.id, { id: doc.id, ...doc.data() });
    });
    
    const orders = Array.from(allOrders.values()).sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || a.timestamp);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || b.timestamp);
      return dateB - dateA;
    });
    
    console.log('📦 getUserOrders (server): Found orders:', orders.length);
    console.log('📦 getUserOrders (server): Orders found:', orders.map(o => ({ id: o.id, email: o.customerInfo?.email, userId: o.userId, loggedInUserEmail: o.loggedInUserEmail })));
    
    return orders;
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw error;
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = db.collection(ORDERS_COLLECTION).doc(orderId);
    await orderRef.update({
      status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Contact messages
const addContactMessage = async (messageData) => {
  try {
    const messagesRef = db.collection(CONTACT_MESSAGES_COLLECTION);
    const docRef = await messagesRef.add({
      ...messageData,
      read: false,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding contact message:", error);
    throw error;
  }
};

// Cart operations
const saveUserCart = async (userId, cartItems) => {
  if (!checkRateLimit()) {
    console.log("🚫 Rate limit exceeded - cart saved to localStorage only");
    return;
  }
  
  try {
    const cartRef = db.collection(CARTS_COLLECTION).doc(userId);
    await cartRef.set({
      userId,
      items: cartItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });
    console.log("✅ Cart saved to Firebase");
  } catch (error) {
    console.error("Error saving cart:", error);
    throw error;
  }
};

const getUserCart = async (userId) => {
  try {
    const cartRef = db.collection(CARTS_COLLECTION).doc(userId);
    const cartSnap = await cartRef.get();
    
    if (cartSnap.exists) {
      return cartSnap.data().items || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting user cart:", error);
    return [];
  }
};

// Wishlist operations
const saveUserWishlist = async (userId, wishlistItems) => {
  if (!checkRateLimit()) {
    console.log("🚫 Rate limit exceeded - wishlist saved to localStorage only");
    return;
  }
  
  try {
    const wishlistRef = db.collection(WISHLISTS_COLLECTION).doc(userId);
    await wishlistRef.set({
      userId,
      items: wishlistItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });
    console.log("✅ Wishlist saved to Firebase");
  } catch (error) {
    console.error("Error saving wishlist:", error);
    throw error;
  }
};

const getUserWishlist = async (userId) => {
  try {
    const wishlistRef = db.collection(WISHLISTS_COLLECTION).doc(userId);
    const wishlistSnap = await wishlistRef.get();
    
    if (wishlistSnap.exists) {
      return wishlistSnap.data().items || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting user wishlist:", error);
    return [];
  }
};

// User operations
const createUserProfile = async (userData) => {
  try {
    const userRef = db.collection('users').doc(userData.uid);
    
    await userRef.set({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      status: 'active'
    });
    
    console.log("✅ User profile created successfully:", userData.uid);
    return userData.uid;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

const getUserProfile = async (userId) => {
  try {
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const usersRef = db.collection('users').orderBy('createdAt', 'desc');
    const snapshot = await usersRef.get();
    
    return snapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

// Founder Videos operations
const getFounderVideos = async () => {
  try {
    const videosRef = db.collection(FOUNDER_VIDEOS_COLLECTION).orderBy("order", "asc");
    const snapshot = await videosRef.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting founder videos:", error);
    throw error;
  }
};

const addFounderVideo = async (videoData) => {
  try {
    if (!videoData.title) {
      throw new Error("Missing required field: title is required");
    }

    if (videoData.type === 'instagram' || videoData.type === 'youtube' || videoData.type === 'clean-video') {
      if (!videoData.instagramUrl) {
        const platform = videoData.type === 'instagram' ? 'Instagram' : 
                        videoData.type === 'youtube' ? 'YouTube' : 'Video';
        throw new Error(`Missing required field: ${platform} URL is required for ${platform} videos`);
      }
    } else {
      if (!videoData.src) {
        throw new Error("Missing required field: video source is required for video files");
      }
    }

    const videosRef = db.collection(FOUNDER_VIDEOS_COLLECTION);
    const docRef = await videosRef.add({
      ...videoData,
      order: videoData.order || 0,
      isActive: videoData.isActive !== undefined ? videoData.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log("✅ Founder video added successfully:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding founder video:", error);
    throw error;
  }
};

// Announcement operations
const getAnnouncements = async () => {
  try {
    const announcementsRef = db.collection(ANNOUNCEMENTS_COLLECTION).orderBy('createdAt', 'desc');
    const snapshot = await announcementsRef.get();
    
    const announcements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return announcements.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (b.priority || 1) - (a.priority || 1);
      }
      return new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt);
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

const getActiveAnnouncements = async () => {
  try {
    const announcementsRef = db.collection(ANNOUNCEMENTS_COLLECTION);
    const q = announcementsRef.where('isActive', '==', true);
    const snapshot = await q.get();
    
    const now = new Date();
    const allAnnouncements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const announcements = allAnnouncements.filter(announcement => {
      let startDate = null;
      let endDate = null;
      
      if (announcement.startDate) {
        if (announcement.startDate.toDate) {
          startDate = announcement.startDate.toDate();
        } else {
          startDate = new Date(announcement.startDate);
        }
      }
      
      if (announcement.endDate) {
        if (announcement.endDate.toDate) {
          endDate = announcement.endDate.toDate();
        } else {
          endDate = new Date(announcement.endDate);
        }
      }
      
      if (!startDate && !endDate) {
        return true;
      }
      
      if (startDate && now < startDate) {
        return false;
      }
      if (endDate && now > endDate) {
        return false;
      }
      
      return true;
    });
    
    return announcements.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (b.priority || 1) - (a.priority || 1);
      }
      return new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt);
    });
  } catch (error) {
    console.error('Error fetching active announcements:', error);
    throw error;
  }
};

// Create announcement
const createAnnouncement = async (announcementData) => {
  try {
    const announcementsRef = db.collection(ANNOUNCEMENTS_COLLECTION);
    const docRef = await announcementsRef.add({
      ...announcementData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Announcement created with ID:', docRef.id);
    return { id: docRef.id };
  } catch (error) {
    console.error('❌ Error creating announcement:', error);
    throw error;
  }
};

// Update announcement
const updateAnnouncement = async (announcementId, updateData) => {
  try {
    const announcementRef = db.collection(ANNOUNCEMENTS_COLLECTION).doc(announcementId);
    await announcementRef.update({
      ...updateData,
      updatedAt: new Date()
    });
    
    console.log('✅ Announcement updated:', announcementId);
  } catch (error) {
    console.error('❌ Error updating announcement:', error);
    throw error;
  }
};

// Delete announcement
const deleteAnnouncement = async (announcementId) => {
  try {
    const announcementRef = db.collection(ANNOUNCEMENTS_COLLECTION).doc(announcementId);
    await announcementRef.delete();
    
    console.log('✅ Announcement deleted:', announcementId);
  } catch (error) {
    console.error('❌ Error deleting announcement:', error);
    throw error;
  }
};

// Toggle announcement status
const toggleAnnouncementStatus = async (announcementId, isActive) => {
  try {
    const announcementRef = db.collection(ANNOUNCEMENTS_COLLECTION).doc(announcementId);
    await announcementRef.update({
      isActive: isActive,
      updatedAt: new Date()
    });
    
    console.log('✅ Announcement status toggled:', announcementId, isActive);
  } catch (error) {
    console.error('❌ Error toggling announcement status:', error);
    throw error;
  }
};

module.exports = {
  // Products
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  
  // Orders
  createOrder,
  getUserOrders,
  updateOrderStatus,
  
  // Contact
  addContactMessage,
  
  // Cart & Wishlist
  saveUserCart,
  getUserCart,
  saveUserWishlist,
  getUserWishlist,
  
  // Users
  createUserProfile,
  getUserProfile,
  getAllUsers,
  
  // Founder Videos
  getFounderVideos,
  addFounderVideo,
  
  // Announcements
  getAnnouncements,
  getActiveAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus
};
