// Quick seeding script - run this in browser console
// Copy and paste this entire code into your browser console

const quickSeed = async () => {
  console.log('🌱 Quick seeding Firestore...');
  
  // Sample products
  const products = [
    {
      name: "Banarasi Antique Zari Brocade",
      description: "Exquisite Banarasi silk saree with intricate zari work and traditional motifs. Perfect for weddings and special occasions.",
      price: 19990,
      category: "banarasi",
      imageUrl: "/assets/banarasi.jpeg",
      stock: 8,
      inStock: true,
      featured: true,
      tags: ["wedding", "traditional", "zari", "brocade"]
    },
    {
      name: "Kanjivaram Temple Border",
      description: "Classic Kanjivaram silk saree with temple border design. Handwoven with pure silk and gold zari.",
      price: 22990,
      category: "kanjivaram",
      imageUrl: "/assets/kanjivaram.jpeg",
      stock: 5,
      inStock: true,
      featured: true,
      tags: ["temple", "border", "pure silk", "gold zari"]
    },
    {
      name: "Tussar Silk Natural",
      description: "Beautiful Tussar silk saree in natural golden color. Lightweight and perfect for daily wear.",
      price: 8990,
      category: "tussar",
      imageUrl: "/assets/tussar.jpeg",
      stock: 12,
      inStock: true,
      featured: false,
      tags: ["natural", "lightweight", "daily wear"]
    }
  ];

  try {
    // Import Firebase functions (assuming they're available globally)
    const { addDoc, collection, getFirestore } = window.firebase || {};
    
    if (!addDoc || !collection || !getFirestore) {
      console.error('❌ Firebase functions not available. Make sure Firebase is loaded.');
      return;
    }

    const db = getFirestore();
    const productsRef = collection(db, 'products');
    
    let successCount = 0;
    for (const product of products) {
      try {
        await addDoc(productsRef, {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        successCount++;
        console.log(`✅ Added: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to add ${product.name}:`, error);
      }
    }
    
    console.log(`🎉 Quick seeding complete! ${successCount} products added.`);
    
  } catch (error) {
    console.error('❌ Quick seeding failed:', error);
  }
};

// Make it available globally
window.quickSeed = quickSeed;

console.log('🌱 Quick seed function available! Run: quickSeed()');
