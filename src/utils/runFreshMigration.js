import { clearAllProducts, migrateAllProducts } from './completeProductMigration';
import { checkMigrationStatus } from './migrationHelper';

// Function to run a completely fresh migration
export const runFreshMigration = async () => {
  try {
    console.log('🚀 Starting fresh migration process...');
    
    // Step 1: Check current status
    console.log('📊 Checking current migration status...');
    const beforeStatus = await checkMigrationStatus();
    console.log('Before migration:', beforeStatus);
    
    // Step 2: Clear all existing products
    console.log('🧹 Clearing all existing products...');
    const clearResult = await clearAllProducts();
    console.log('Clear result:', clearResult);
    
    // Step 3: Run fresh migration
    console.log('🔄 Running fresh migration...');
    const migrationResult = await migrateAllProducts();
    console.log('Migration result:', migrationResult);
    
    // Step 4: Check final status
    console.log('📊 Checking final migration status...');
    const afterStatus = await checkMigrationStatus();
    console.log('After migration:', afterStatus);
    
    // Step 5: Verify specific products
    console.log('🔍 Verifying key products...');
    const keyProducts = ['TUS-002', 'BAN-001', 'KAN-001'];
    for (const productId of keyProducts) {
      try {
        const { getProducts } = await import('../firebase/firestore');
        const products = await getProducts();
        const product = products.find(p => p.id === productId);
        console.log(`${productId}: ${product ? '✅ Found' : '❌ Missing'} - ${product?.name || 'N/A'}`);
      } catch (error) {
        console.error(`Error checking ${productId}:`, error);
      }
    }
    
    return {
      success: true,
      beforeStatus,
      afterStatus,
      migrationResult,
      clearResult
    };
    
  } catch (error) {
    console.error('❌ Fresh migration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to check if a specific product exists
export const checkSpecificProduct = async (productId) => {
  try {
    const { getProducts } = await import('../firebase/firestore');
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
      console.log(`✅ Product ${productId} found:`, product);
      return { found: true, product };
    } else {
      console.log(`❌ Product ${productId} not found`);
      return { found: false, product: null };
    }
  } catch (error) {
    console.error(`❌ Error checking product ${productId}:`, error);
    return { found: false, product: null, error: error.message };
  }
};
