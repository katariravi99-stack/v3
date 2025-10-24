import { updateProduct } from '../firebase/firestore';

// Update all Banarasi product prices to ₹2
const updateBanarasiPrices = async () => {
  const banarasiProductIds = [
    'BAN-001',
    'BAN-002', 
    'BAN-003',
    'BAN-004',
    'BAN-005',
    'BAN-006'
  ];

  console.log('🔄 Updating Banarasi product prices to ₹2...');

  for (const productId of banarasiProductIds) {
    try {
      await updateProduct(productId, { price: 2 });
      console.log(`✅ Updated ${productId} price to ₹2`);
    } catch (error) {
      console.error(`❌ Failed to update ${productId}:`, error);
    }
  }

  console.log('🎉 Banarasi price update completed!');
};

// Run the update
updateBanarasiPrices().catch(console.error);
