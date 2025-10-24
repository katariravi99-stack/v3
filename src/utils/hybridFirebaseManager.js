// Hybrid Firebase Manager
// This utility manages both Firebase and local storage based on environment and quota status

export const hybridFirebaseManager = {
  // Configuration
  config: {
    isProduction: process.env.NODE_ENV === 'production',
    isFirebaseEnabled: true, // Always use Firebase
    maxRetries: 3,
    retryDelay: 2000,
    quotaCheckInterval: 300000, // 5 minutes
    localFallbackEnabled: false // Disabled - use Firebase only
  },

  // Quota monitoring
  quotaStatus: {
    isExceeded: false,
    lastCheck: null,
    requestCount: 0,
    requestLimit: 50, // Conservative limit for production
    requestWindow: 300000 // 5 minutes
  },

  // Check if Firebase should be used
  shouldUseFirebase: () => {
    const { isFirebaseEnabled } = hybridFirebaseManager.config;
    
    // Always use Firebase if enabled
    if (isFirebaseEnabled) {
      console.log('🔥 Using Firebase Firestore');
      return true;
    }
    
    console.log('🚫 Firebase disabled - this should not happen');
    return false;
  },

  // Update quota status
  updateQuotaStatus: (isExceeded = false) => {
    hybridFirebaseManager.quotaStatus.isExceeded = isExceeded;
    hybridFirebaseManager.quotaStatus.lastCheck = Date.now();
    
    if (isExceeded) {
      console.log('🚨 Quota exceeded detected - switching to local storage');
      hybridFirebaseManager.config.isFirebaseEnabled = false;
    }
  },

  // Increment request count
  incrementRequestCount: () => {
    const now = Date.now();
    const { requestCount, requestLimit, requestWindow } = hybridFirebaseManager.quotaStatus;
    
    // Reset counter if window has passed
    if (now - hybridFirebaseManager.quotaStatus.lastCheck > requestWindow) {
      hybridFirebaseManager.quotaStatus.requestCount = 0;
      hybridFirebaseManager.quotaStatus.lastCheck = now;
    }
    
    hybridFirebaseManager.quotaStatus.requestCount++;
    
    // Check if approaching limit
    if (hybridFirebaseManager.quotaStatus.requestCount >= requestLimit) {
      console.warn(`⚠️ Approaching request limit: ${hybridFirebaseManager.quotaStatus.requestCount}/${requestLimit}`);
    }
  },

  // Get products from Firebase
  getProducts: async () => {
    try {
      console.log('📡 Fetching products from Firebase...');
      hybridFirebaseManager.incrementRequestCount();
      
      // Import Firebase functions dynamically to avoid issues
      const { getProducts } = await import('../firebase/firestore');
      const products = await getProducts();
      
      console.log('✅ Products fetched from Firebase:', products.length);
      return products;
    } catch (error) {
      console.error('❌ Error fetching products from Firebase:', error);
      throw error; // Don't fallback to local storage
    }
  },

  // Update product in Firebase
  updateProduct: async (productId, updates) => {
    try {
      console.log('📡 Updating product in Firebase:', productId);
      hybridFirebaseManager.incrementRequestCount();
      
      // Import Firebase functions dynamically to avoid issues
      const { updateProduct } = await import('../firebase/firestore');
      await updateProduct(productId, updates);
      
      console.log('✅ Product updated in Firebase:', productId);
      
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('productsUpdated'));
      }
      
      // Return updated product data
      const { getProducts } = await import('../firebase/firestore');
      const products = await getProducts();
      return products;
    } catch (error) {
      console.error('❌ Error updating product in Firebase:', error);
      throw error;
    }
  },

  // Add product to Firebase
  addProduct: async (productData) => {
    try {
      console.log('📡 Adding product to Firebase:', productData.name);
      hybridFirebaseManager.incrementRequestCount();
      
      // Import Firebase functions dynamically to avoid issues
      const { addProduct } = await import('../firebase/firestore');
      const firebaseId = await addProduct(productData);
      
      console.log('✅ Product added to Firebase:', firebaseId);
      
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('productsUpdated'));
      }
      
      // Return updated product data
      const { getProducts } = await import('../firebase/firestore');
      const products = await getProducts();
      return products;
    } catch (error) {
      console.error('❌ Error adding product to Firebase:', error);
      throw error;
    }
  },

  // Delete product from Firebase
  deleteProduct: async (productId) => {
    try {
      console.log('📡 Deleting product from Firebase:', productId);
      hybridFirebaseManager.incrementRequestCount();
      
      // Import Firebase functions dynamically to avoid issues
      const { deleteProduct } = await import('../firebase/firestore');
      await deleteProduct(productId);
      
      console.log('✅ Product deleted from Firebase:', productId);
      
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('productsUpdated'));
      }
      
      // Return updated product data
      const { getProducts } = await import('../firebase/firestore');
      const products = await getProducts();
      return products;
    } catch (error) {
      console.error('❌ Error deleting product from Firebase:', error);
      throw error;
    }
  },

  // Get local products (deprecated - using Firebase only)
  getLocalProducts: () => {
    console.warn('⚠️ getLocalProducts is deprecated - using Firebase only');
    return [];
  },

  // Sync all local changes to Firebase (deprecated - using Firebase only)
  syncAllToFirebase: async () => {
    console.log('🔄 Sync not needed - using Firebase directly');
    return { synced: 0, errors: 0 };
  },

  // Get current status
  getStatus: () => {
    return {
      config: hybridFirebaseManager.config,
      quotaStatus: hybridFirebaseManager.quotaStatus,
      shouldUseFirebase: hybridFirebaseManager.shouldUseFirebase(),
      mode: 'Firebase Only'
    };
  },

  // Reset quota status (for when quota resets)
  resetQuotaStatus: () => {
    hybridFirebaseManager.quotaStatus.isExceeded = false;
    hybridFirebaseManager.quotaStatus.requestCount = 0;
    hybridFirebaseManager.quotaStatus.lastCheck = Date.now();
    hybridFirebaseManager.config.isFirebaseEnabled = true;
    console.log('✅ Quota status reset - Firebase re-enabled');
  },

  // Force enable Firebase (for testing)
  forceEnableFirebase: () => {
    hybridFirebaseManager.config.isFirebaseEnabled = true;
    hybridFirebaseManager.config.localFallbackEnabled = false;
    hybridFirebaseManager.quotaStatus.isExceeded = false;
    console.log('🚀 Firebase force enabled');
  }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.hybridFirebaseManager = hybridFirebaseManager;
  console.log('🔧 Hybrid Firebase Manager available: window.hybridFirebaseManager');
  console.log('Available methods: getProducts, updateProduct, addProduct, deleteProduct, syncAllToFirebase, getStatus, resetQuotaStatus');
}
