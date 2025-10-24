// Local Product Sync Utility
// This utility helps sync product changes between dashboard and main site using localStorage

export const localProductSync = {
  // Get all products from localStorage
  getProducts: () => {
    try {
      const cachedProducts = localStorage.getItem('varaha_products_cache');
      return cachedProducts ? JSON.parse(cachedProducts) : [];
    } catch (error) {
      console.error('Error getting products from localStorage:', error);
      return [];
    }
  },

  // Save products to localStorage
  saveProducts: (products) => {
    try {
      localStorage.setItem('varaha_products_cache', JSON.stringify(products));
      console.log('✅ Products saved to localStorage cache');
      return true;
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
      return false;
    }
  },

  // Update a single product
  updateProduct: (productId, updates) => {
    try {
      const products = localProductSync.getProducts();
      const updatedProducts = products.map(product => 
        product.id === productId 
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      );
      
      localProductSync.saveProducts(updatedProducts);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('productsUpdated', {
        detail: { productId, updates, products: updatedProducts }
      }));
      
      console.log('✅ Product updated in localStorage:', productId, updates);
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  },

  // Add a new product
  addProduct: (productData) => {
    try {
      const products = localProductSync.getProducts();
      const newProduct = {
        ...productData,
        id: productData.id || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const updatedProducts = [...products, newProduct];
      localProductSync.saveProducts(updatedProducts);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('productsUpdated', {
        detail: { productId: newProduct.id, updates: newProduct, products: updatedProducts }
      }));
      
      console.log('✅ Product added to localStorage:', newProduct);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  },

  // Delete a product
  deleteProduct: (productId) => {
    try {
      const products = localProductSync.getProducts();
      const updatedProducts = products.filter(product => product.id !== productId);
      localProductSync.saveProducts(updatedProducts);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('productsUpdated', {
        detail: { productId, deleted: true, products: updatedProducts }
      }));
      
      console.log('✅ Product deleted from localStorage:', productId);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  // Get product by ID
  getProductById: (productId) => {
    try {
      const products = localProductSync.getProducts();
      return products.find(product => product.id === productId) || null;
    } catch (error) {
      console.error('Error getting product by ID:', error);
      return null;
    }
  },

  // Get products by category
  getProductsByCategory: (category) => {
    try {
      const products = localProductSync.getProducts();
      return products.filter(product => 
        product.category && product.category.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error('Error getting products by category:', error);
      return [];
    }
  },

  // Clear all products
  clearAllProducts: () => {
    try {
      localStorage.removeItem('varaha_products_cache');
      console.log('✅ All products cleared from localStorage');
      return true;
    } catch (error) {
      console.error('Error clearing products:', error);
      return false;
    }
  },

  // Get sync status
  getSyncStatus: () => {
    try {
      const products = localProductSync.getProducts();
      return {
        totalProducts: products.length,
        lastUpdated: products.length > 0 ? 
          Math.max(...products.map(p => new Date(p.updatedAt || p.createdAt).getTime())) : null,
        cacheSize: JSON.stringify(products).length,
        isOnline: navigator.onLine
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        totalProducts: 0,
        lastUpdated: null,
        cacheSize: 0,
        isOnline: navigator.onLine
      };
    }
  }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.localProductSync = localProductSync;
  console.log('🔧 Local Product Sync available: window.localProductSync');
  console.log('Available methods: getProducts, saveProducts, updateProduct, addProduct, deleteProduct, getSyncStatus');
}
