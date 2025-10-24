import { getProducts } from '../firebase/firestore';

// Helper function to check migration status
export const checkMigrationStatus = async () => {
  try {
    console.log('🔍 Checking migration status...');
    const products = await getProducts();
    
    const status = {
      totalProducts: products.length,
      categories: {},
      hasProducts: products.length > 0,
      migrationComplete: products.length > 0
    };
    
    // Count products by category
    products.forEach(product => {
      const category = product.category || 'unknown';
      status.categories[category] = (status.categories[category] || 0) + 1;
    });
    
    console.log('📊 Migration Status:', status);
    return status;
  } catch (error) {
    console.error('❌ Error checking migration status:', error);
    return {
      totalProducts: 0,
      categories: {},
      hasProducts: false,
      migrationComplete: false,
      error: error.message
    };
  }
};

// Helper function to find a specific product
export const findProduct = async (productId) => {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
      console.log('✅ Product found:', product);
      return { found: true, product };
    } else {
      console.log('❌ Product not found:', productId);
      return { found: false, product: null };
    }
  } catch (error) {
    console.error('❌ Error finding product:', error);
    return { found: false, product: null, error: error.message };
  }
};

// Helper function to get all product IDs
export const getAllProductIds = async () => {
  try {
    const products = await getProducts();
    const ids = products.map(p => p.id);
    console.log('📋 All product IDs:', ids);
    return ids;
  } catch (error) {
    console.error('❌ Error getting product IDs:', error);
    return [];
  }
};
