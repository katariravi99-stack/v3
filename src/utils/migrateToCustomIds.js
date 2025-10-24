// Migration utility to convert auto-generated IDs to custom IDs
import { getProducts, addProductWithId, deleteProduct } from '../firebase/firestore';

export const migrateToCustomIds = async () => {
  try {
    console.log('🔄 Starting migration to custom IDs...');
    
    // Get all products with auto-generated IDs
    const products = await getProducts();
    console.log(`📦 Found ${products.length} products to migrate`);
    
    const migrationResults = [];
    
    for (const product of products) {
      try {
        // Skip if already has custom ID format
        if (product.id && (product.id.includes('-') || product.id.length < 20)) {
          console.log(`⏭️ Skipping ${product.id} - already has custom ID format`);
          continue;
        }
        
        // Generate custom ID based on category and name
        const category = product.category || 'general';
        const nameWords = product.name.toLowerCase().split(' ').slice(0, 2);
        const prefix = category.substring(0, 3).toUpperCase();
        const suffix = nameWords.map(word => word.substring(0, 2)).join('').toUpperCase();
        let customId = `${prefix}-${suffix}`;
        
        // Add number if ID already exists
        let counter = 1;
        let finalId = customId;
        while (migrationResults.some(r => r.newId === finalId)) {
          finalId = `${customId}-${counter.toString().padStart(3, '0')}`;
          counter++;
        }
        customId = finalId;
        
        // Create new product with custom ID
        const newProductData = {
          ...product,
          id: customId
        };
        
        // Add new product with custom ID
        await addProductWithId(customId, newProductData);
        
        // Delete old product with auto-generated ID
        await deleteProduct(product.id);
        
        migrationResults.push({
          oldId: product.id,
          newId: customId,
          name: product.name,
          success: true
        });
        
        console.log(`✅ Migrated: ${product.id} → ${customId} (${product.name})`);
        
      } catch (error) {
        console.error(`❌ Failed to migrate ${product.id}:`, error);
        migrationResults.push({
          oldId: product.id,
          newId: null,
          name: product.name,
          success: false,
          error: error.message
        });
      }
    }
    
    console.log('🎉 Migration completed!');
    console.log('📊 Results:', migrationResults);
    
    return {
      total: products.length,
      successful: migrationResults.filter(r => r.success).length,
      failed: migrationResults.filter(r => !r.success).length,
      results: migrationResults
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
  window.migrateToCustomIds = migrateToCustomIds;
  console.log('🔧 Migration function available: window.migrateToCustomIds()');
}
