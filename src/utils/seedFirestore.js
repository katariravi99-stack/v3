// Data seeding script for Firestore
import { 
  addProduct, 
  getProducts 
} from '../firebase/firestore';

// Sample products data
const sampleProducts = [
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
  },
  {
    name: "Linen Cotton Blend",
    description: "Comfortable linen-cotton blend saree. Perfect for summer and casual occasions.",
    price: 4990,
    category: "linen",
    imageUrl: "/assets/linen.jpeg",
    stock: 15,
    inStock: true,
    featured: false,
    tags: ["cotton", "summer", "casual", "comfortable"]
  },
  {
    name: "Organza Party Wear",
    description: "Elegant organza saree with modern design. Perfect for parties and evening events.",
    price: 12990,
    category: "organza",
    imageUrl: "/assets/organza.jpeg",
    stock: 6,
    inStock: true,
    featured: true,
    tags: ["party", "evening", "modern", "elegant"]
  },
  {
    name: "Patola Traditional",
    description: "Authentic Patola silk saree with traditional patterns. Handwoven with natural dyes.",
    price: 15990,
    category: "patola",
    imageUrl: "/assets/patola.jpeg",
    stock: 4,
    inStock: true,
    featured: false,
    tags: ["traditional", "handwoven", "natural dyes"]
  },
  {
    name: "Georgette Floral",
    description: "Beautiful georgette saree with floral prints. Light and flowy, perfect for any occasion.",
    price: 6990,
    category: "georgette",
    imageUrl: "/assets/georgette.jpeg",
    stock: 10,
    inStock: true,
    featured: false,
    tags: ["floral", "light", "flowy", "versatile"]
  },
  {
    name: "Chiffon Evening",
    description: "Elegant chiffon saree for evening wear. Sophisticated and graceful.",
    price: 8990,
    category: "chiffon",
    imageUrl: "/assets/chiffon.jpeg",
    stock: 7,
    inStock: true,
    featured: false,
    tags: ["evening", "elegant", "sophisticated", "graceful"]
  },
  {
    name: "Banarasi Wedding Special",
    description: "Premium Banarasi saree with heavy zari work. Perfect for bridal wear.",
    price: 29990,
    category: "banarasi",
    imageUrl: "/assets/banarasi1.jpg",
    stock: 3,
    inStock: true,
    featured: true,
    tags: ["wedding", "bridal", "premium", "heavy zari"]
  },
  {
    name: "Kanjivaram Royal",
    description: "Royal Kanjivaram saree with intricate designs. A masterpiece of South Indian weaving.",
    price: 24990,
    category: "kanjivaram",
    imageUrl: "/assets/kanjivaram1.jpg",
    stock: 2,
    inStock: true,
    featured: true,
    tags: ["royal", "intricate", "south indian", "masterpiece"]
  }
];

// Function to seed Firestore with sample products
export const seedFirestore = async () => {
  try {
    console.log('🌱 Starting Firestore seeding...');
    
    // Check if products already exist
    const existingProducts = await getProducts();
    
    if (existingProducts.length > 0) {
      console.log(`📦 Found ${existingProducts.length} existing products. Skipping seeding.`);
      return { success: true, message: 'Products already exist in Firestore' };
    }
    
    // Add sample products
    const results = [];
    for (const product of sampleProducts) {
      try {
        const productId = await addProduct(product);
        results.push({ success: true, id: productId, name: product.name });
        console.log(`✅ Added: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to add ${product.name}:`, error);
        results.push({ success: false, name: product.name, error: error.message });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    console.log(`🎉 Seeding complete! ${successCount} products added, ${failCount} failed.`);
    
    return {
      success: true,
      message: `Seeded ${successCount} products successfully`,
      results
    };
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return {
      success: false,
      message: 'Seeding failed',
      error: error.message
    };
  }
};

// Function to clear all products (for testing)
export const clearAllProducts = async () => {
  try {
    console.log('🗑️ Clearing all products...');
    const products = await getProducts();
    
    // Note: You'll need to implement deleteProduct for each product
    // This is just a placeholder - implement based on your needs
    console.log(`Found ${products.length} products to delete`);
    
    return {
      success: true,
      message: `Found ${products.length} products to delete`
    };
  } catch (error) {
    console.error('❌ Failed to clear products:', error);
    return {
      success: false,
      message: 'Failed to clear products',
      error: error.message
    };
  }
};

// Make seeding functions available in browser console for easy access
if (typeof window !== 'undefined') {
  window.seedFirestore = seedFirestore;
  window.clearAllProducts = clearAllProducts;
  console.log('🌱 Seeding functions available: window.seedFirestore() and window.clearAllProducts()');
}
