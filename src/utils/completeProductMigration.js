// Complete Product Migration Script for Firestore
import { 
  addProduct, 
  addProductWithId,
  getProducts,
  deleteProduct
} from '../firebase/firestore';

// Import all product images
const o01 = "/assets/organza1.jpg";
const o02 = "/assets/organza1.jpg";
const o03 = "/assets/organza1.jpg";
const o04 = "/assets/organza1.jpg";
const o05 = "/assets/organza1.jpg";
const o06 = "/assets/organza1.jpg";

const k01 = "/assets/kanjivaram1.jpg";
const k02 = "/assets/kanjivaram2.jpg";
const k03 = "/assets/kanjivaram3.jpg";
const k04 = "/assets/kanjivaram4.jpg";

const b01 = "/assets/banarasi1.jpg";
const b02 = "/assets/banarasi2.jpg";
const b03 = "/assets/banarasi3.jpg";
const b04 = "/assets/banarasi4.jpg";
const b05 = "/assets/banarasi5.jpg";
const b06 = "/assets/banarasi6.jpg";

const t01 = "/assets/tussar1.jpg";
const t02 = "/assets/tussar1.jpg";
const t03 = "/assets/tussar1.jpg";
const t04 = "/assets/tussar1.jpg";

const l01 = "/assets/linen1.jpg";
const l02 = "/assets/linen1.jpg";
const l03 = "/assets/linen1.jpg";
const l04 = "/assets/linen1.jpg";

const p01 = "/assets/patola1.jpg";
const p02 = "/assets/patola1.jpg";
const p03 = "/assets/patola1.jpg";
const p04 = "/assets/patola1.jpg";

const g01 = "/assets/georgette1.jpg";
const g02 = "/assets/georgette1.jpg";
const g03 = "/assets/georgette1.jpg";
const g04 = "/assets/georgette1.jpg";

const c01 = "/assets/chiffon.jpeg";
const c02 = "/assets/chiffon.jpeg";
const c03 = "/assets/chiffon.jpeg";
const c04 = "/assets/chiffon.jpeg";

// Complete product database with all products from the website
const ALL_PRODUCTS = [
  // BANARASI PRODUCTS
  {
    id: "BAN-001",
    name: "Banarasi Antique Zari Brocade",
    description: "Exquisite Banarasi silk saree with intricate zari work and traditional motifs. Perfect for weddings and special occasions.",
    price: 2,
    category: "banarasi",
    imageUrl: "/assets/banarasi.jpeg",
    stock: 8,
    inStock: true,
    featured: true,
    tags: ["wedding", "traditional", "zari", "brocade"],
    color: "Red",
    zari: "Heavy",
    occasion: "Wedding",
    rating: 4.8,
    reviews: 156,
    weight: "800g",
    fabric: "Pure Silk",
    care: "Dry Clean Only"
  },
  {
    id: "BAN-002",
    name: "Banarasi Wedding Special",
    description: "Premium Banarasi saree with heavy zari work. Perfect for bridal wear.",
    price: 2,
    category: "banarasi",
    imageUrl: "/assets/banarasi1.jpg",
    stock: 3,
    inStock: true,
    featured: true,
    tags: ["wedding", "bridal", "premium", "heavy zari"],
    color: "Maroon",
    zari: "Heavy",
    occasion: "Wedding",
    rating: 4.9,
    reviews: 89,
    weight: "900g",
    fabric: "Pure Silk",
    care: "Dry Clean Only"
  },
  {
    id: "BAN-003",
    name: "Banarasi Royal Elegance",
    description: "Royal Banarasi saree with intricate designs and premium zari work.",
    price: 2,
    category: "banarasi",
    imageUrl: "/assets/banarasi2.jpg",
    stock: 5,
    inStock: true,
    featured: true,
    tags: ["royal", "elegant", "premium", "intricate"],
    color: "Gold",
    zari: "Heavy",
    occasion: "Wedding",
    rating: 4.7,
    reviews: 134,
    weight: "850g",
    fabric: "Pure Silk",
    care: "Dry Clean Only"
  },
  {
    id: "BAN-004",
    name: "Banarasi Traditional Classic",
    description: "Classic Banarasi saree with traditional patterns and moderate zari work.",
    price: 2,
    category: "banarasi",
    imageUrl: "/assets/banarasi3.jpg",
    stock: 7,
    inStock: true,
    featured: false,
    tags: ["traditional", "classic", "moderate zari"],
    color: "Green",
    zari: "Moderate",
    occasion: "Festival",
    rating: 4.6,
    reviews: 98,
    weight: "750g",
    fabric: "Pure Silk",
    care: "Dry Clean Only"
  },
  {
    id: "BAN-005",
    name: "Banarasi Party Wear",
    description: "Modern Banarasi saree perfect for parties and evening events.",
    price: 2,
    category: "banarasi",
    imageUrl: "/assets/banarasi4.jpg",
    stock: 6,
    inStock: true,
    featured: false,
    tags: ["party", "modern", "evening", "elegant"],
    color: "Navy Blue",
    zari: "Light",
    occasion: "Party",
    rating: 4.5,
    reviews: 76,
    weight: "700g",
    fabric: "Pure Silk",
    care: "Dry Clean Only"
  },
  {
    id: "BAN-006",
    name: "Banarasi Designer Special",
    description: "Designer Banarasi saree with contemporary patterns and premium finish.",
    price: 2,
    category: "banarasi",
    imageUrl: "/assets/banarasi5.jpg",
    stock: 4,
    inStock: true,
    featured: true,
    tags: ["designer", "contemporary", "premium", "unique"],
    color: "Purple",
    zari: "Heavy",
    occasion: "Wedding",
    rating: 4.8,
    reviews: 112,
    weight: "820g",
    fabric: "Pure Silk",
    care: "Dry Clean Only"
  },

  // KANJIVARAM PRODUCTS
  {
    id: "KAN-001",
    name: "Kanjivaram Temple Border",
    description: "Classic Kanjivaram silk saree with temple border design. Handwoven with pure silk and gold zari.",
    price: 22990,
    category: "kanjivaram",
    imageUrl: "/assets/kanjivaram.jpeg",
    stock: 5,
    inStock: true,
    featured: true,
    tags: ["temple", "border", "pure silk", "gold zari"],
    color: "Red",
    zari: "Heavy",
    occasion: "Wedding",
    rating: 4.9,
    reviews: 145,
    weight: "900g",
    fabric: "Pure Silk",
    care: "Dry Clean Only"
  },
  {
    id: "KAN-002",
    name: "Kanjivaram Royal",
    description: "Royal Kanjivaram saree with intricate designs. A masterpiece of South Indian weaving.",
    price: 24990,
    category: "kanjivaram",
    imageUrl: "/assets/kanjivaram1.jpg",
    stock: 2,
    inStock: true,
    featured: true,
    tags: ["royal", "intricate", "south indian", "masterpiece"],
    color: "Gold",
    zari: "Heavy",
    occasion: "Wedding",
    rating: 4.8,
    reviews: 98,
    weight: "950g",
    fabric: "Pure Silk",
    care: "Dry Clean Only"
  },
  {
    id: "KAN-003",
    name: "Kanjivaram Traditional",
    description: "Traditional Kanjivaram saree with classic South Indian motifs and patterns.",
    price: 19990,
    category: "kanjivaram",
    imageUrl: "/assets/kanjivaram2.jpg",
    stock: 6,
    inStock: true,
    featured: false,
    tags: ["traditional", "classic", "south indian", "motifs"],
    color: "Green",
    zari: "Moderate",
    occasion: "Festival",
    rating: 4.7,
    reviews: 123,
    weight: "850g",
    fabric: "Pure Silk",
    care: "Dry Clean Only"
  },
  {
    id: "KAN-004",
    name: "Kanjivaram Modern",
    description: "Modern Kanjivaram saree with contemporary designs and elegant finish.",
    price: 18990,
    category: "kanjivaram",
    imageUrl: "/assets/kanjivaram3.jpg",
    stock: 4,
    inStock: true,
    featured: false,
    tags: ["modern", "contemporary", "elegant", "designer"],
    color: "Blue",
    zari: "Light",
    occasion: "Party",
    rating: 4.6,
    reviews: 87,
    weight: "800g",
    fabric: "Pure Silk",
    care: "Dry Clean Only"
  },
  {
    id: "KAN-005",
    name: "Kanjivaram Bridal",
    description: "Bridal Kanjivaram saree with heavy zari work and traditional patterns.",
    price: 27990,
    category: "kanjivaram",
    imageUrl: "/assets/kanjivaram4.jpg",
    stock: 3,
    inStock: true,
    featured: true,
    tags: ["bridal", "heavy zari", "traditional", "wedding"],
    color: "Maroon",
    zari: "Heavy",
    occasion: "Wedding",
    rating: 4.9,
    reviews: 156,
    weight: "1000g",
    fabric: "Pure Silk",
    care: "Dry Clean Only"
  },

  // TUSSAR PRODUCTS
  {
    id: "TUS-001",
    name: "Tussar Silk Natural",
    description: "Beautiful Tussar silk saree in natural golden color. Lightweight and perfect for daily wear.",
    price: 8990,
    category: "tussar",
    imageUrl: "/assets/tussar.jpeg",
    stock: 12,
    inStock: true,
    featured: false,
    tags: ["natural", "lightweight", "daily wear"],
    color: "Golden",
    zari: "None",
    occasion: "Casual",
    rating: 4.4,
    reviews: 89,
    weight: "400g",
    fabric: "Tussar Silk",
    care: "Hand Wash"
  },
  {
    id: "TUS-002",
    name: "Tussar Printed",
    description: "Elegant Tussar saree with beautiful printed patterns and comfortable fit.",
    price: 7990,
    category: "tussar",
    imageUrl: "/assets/tussar1.jpg",
    stock: 10,
    inStock: true,
    featured: false,
    tags: ["printed", "elegant", "comfortable", "versatile"],
    color: "Cream",
    zari: "None",
    occasion: "Casual",
    rating: 4.3,
    reviews: 67,
    weight: "380g",
    fabric: "Tussar Silk",
    care: "Hand Wash"
  },
  {
    id: "TUS-003",
    name: "Tussar Embroidered",
    description: "Tussar saree with delicate embroidery work and traditional motifs.",
    price: 10990,
    category: "tussar",
    imageUrl: "/assets/tussar1.jpg",
    stock: 8,
    inStock: true,
    featured: false,
    tags: ["embroidered", "delicate", "traditional", "motifs"],
    color: "Pink",
    zari: "Light",
    occasion: "Festival",
    rating: 4.5,
    reviews: 78,
    weight: "450g",
    fabric: "Tussar Silk",
    care: "Hand Wash"
  },
  {
    id: "TUS-004",
    name: "Tussar Designer",
    description: "Designer Tussar saree with contemporary patterns and modern appeal.",
    price: 11990,
    category: "tussar",
    imageUrl: "/assets/tussar1.jpg",
    stock: 6,
    inStock: true,
    featured: true,
    tags: ["designer", "contemporary", "modern", "unique"],
    color: "Orange",
    zari: "Light",
    occasion: "Party",
    rating: 4.6,
    reviews: 92,
    weight: "420g",
    fabric: "Tussar Silk",
    care: "Hand Wash"
  },

  // LINEN PRODUCTS
  {
    id: "LIN-001",
    name: "Linen Cotton Blend",
    description: "Comfortable linen-cotton blend saree. Perfect for summer and casual occasions.",
    price: 4990,
    category: "linen",
    imageUrl: "/assets/linen.jpeg",
    stock: 15,
    inStock: true,
    featured: false,
    tags: ["cotton", "summer", "casual", "comfortable"],
    color: "White",
    zari: "None",
    occasion: "Casual",
    rating: 4.2,
    reviews: 134,
    weight: "300g",
    fabric: "Linen Cotton",
    care: "Machine Wash"
  },
  {
    id: "LIN-002",
    name: "Linen Pure",
    description: "Pure linen saree with natural texture and breathable fabric.",
    price: 5990,
    category: "linen",
    imageUrl: "/assets/linen1.jpg",
    stock: 12,
    inStock: true,
    featured: false,
    tags: ["pure linen", "natural", "breathable", "textured"],
    color: "Beige",
    zari: "None",
    occasion: "Casual",
    rating: 4.3,
    reviews: 98,
    weight: "320g",
    fabric: "Pure Linen",
    care: "Machine Wash"
  },
  {
    id: "LIN-003",
    name: "Linen Embroidered",
    description: "Linen saree with beautiful embroidery work and elegant finish.",
    price: 7990,
    category: "linen",
    imageUrl: "/assets/linen1.jpg",
    stock: 8,
    inStock: true,
    featured: false,
    tags: ["embroidered", "elegant", "beautiful", "finish"],
    color: "Light Blue",
    zari: "Light",
    occasion: "Festival",
    rating: 4.4,
    reviews: 76,
    weight: "350g",
    fabric: "Linen Cotton",
    care: "Hand Wash"
  },
  {
    id: "LIN-004",
    name: "Linen Designer",
    description: "Designer linen saree with contemporary patterns and modern appeal.",
    price: 8990,
    category: "linen",
    imageUrl: "/assets/linen1.jpg",
    stock: 6,
    inStock: true,
    featured: true,
    tags: ["designer", "contemporary", "modern", "appeal"],
    color: "Mint Green",
    zari: "Light",
    occasion: "Party",
    rating: 4.5,
    reviews: 89,
    weight: "340g",
    fabric: "Pure Linen",
    care: "Hand Wash"
  },

  // ORGANZA PRODUCTS
  {
    id: "ORG-001",
    name: "Organza Party Wear",
    description: "Elegant organza saree with modern design. Perfect for parties and evening events.",
    price: 12990,
    category: "organza",
    imageUrl: "/assets/organza.jpeg",
    stock: 6,
    inStock: true,
    featured: true,
    tags: ["party", "evening", "modern", "elegant"],
    color: "Pearl White",
    zari: "None",
    occasion: "Wedding",
    rating: 4.8,
    reviews: 198,
    weight: "200g",
    fabric: "Pure Organza",
    care: "Dry Clean Only"
  },
  {
    id: "ORG-002",
    name: "Pure Organza Elegance",
    description: "Pure organza saree with elegant drape and sophisticated appeal.",
    price: 12999,
    category: "organza",
    imageUrl: "/assets/organza1.jpg",
    stock: 8,
    inStock: true,
    featured: true,
    tags: ["pure", "elegance", "sophisticated", "drape"],
    color: "Pearl White",
    zari: "None",
    occasion: "Wedding",
    rating: 4.8,
    reviews: 198,
    weight: "200g",
    fabric: "Pure Organza",
    care: "Dry Clean Only"
  },
  {
    id: "ORG-003",
    name: "Organza Sheer Magic",
    description: "Sheer organza saree with magical appeal and graceful drape.",
    price: 14999,
    category: "organza",
    imageUrl: "/assets/organza1.jpg",
    stock: 5,
    inStock: true,
    featured: false,
    tags: ["sheer", "magic", "graceful", "drape"],
    color: "Blush Pink",
    zari: "None",
    occasion: "Party",
    rating: 4.6,
    reviews: 156,
    weight: "180g",
    fabric: "Pure Organza",
    care: "Dry Clean Only"
  },
  {
    id: "ORG-004",
    name: "Crystal Organza Grace",
    description: "Crystal organza saree with graceful appeal and elegant finish.",
    price: 16999,
    category: "organza",
    imageUrl: "/assets/organza1.jpg",
    stock: 4,
    inStock: true,
    featured: true,
    tags: ["crystal", "grace", "elegant", "finish"],
    color: "Ivory",
    zari: "None",
    occasion: "Festival",
    rating: 4.4,
    reviews: 134,
    weight: "220g",
    fabric: "Pure Organza",
    care: "Dry Clean Only"
  },
  {
    id: "ORG-005",
    name: "Organza Summer Breeze",
    description: "Light organza saree perfect for summer occasions and casual wear.",
    price: 11999,
    category: "organza",
    imageUrl: "/assets/organza1.jpg",
    stock: 7,
    inStock: true,
    featured: false,
    tags: ["summer", "breeze", "light", "casual"],
    color: "Mint Green",
    zari: "None",
    occasion: "Casual",
    rating: 4.7,
    reviews: 167,
    weight: "190g",
    fabric: "Pure Organza",
    care: "Dry Clean Only"
  },
  {
    id: "ORG-006",
    name: "Premium Organza Silk",
    description: "Premium organza silk saree with luxurious feel and elegant appeal.",
    price: 18999,
    category: "organza",
    imageUrl: "/assets/organza1.jpg",
    stock: 3,
    inStock: true,
    featured: true,
    tags: ["premium", "silk", "luxurious", "elegant"],
    color: "Champagne",
    zari: "None",
    occasion: "Formal",
    rating: 4.9,
    reviews: 123,
    weight: "210g",
    fabric: "Organza Silk",
    care: "Dry Clean Only"
  },
  {
    id: "ORG-007",
    name: "Organza Designer Wear",
    description: "Designer organza saree with contemporary patterns and modern appeal.",
    price: 15999,
    category: "organza",
    imageUrl: "/assets/organza1.jpg",
    stock: 5,
    inStock: true,
    featured: false,
    tags: ["designer", "contemporary", "modern", "appeal"],
    color: "Lavender",
    zari: "None",
    occasion: "Engagement",
    rating: 4.5,
    reviews: 145,
    weight: "195g",
    fabric: "Pure Organza",
    care: "Dry Clean Only"
  },

  // PATOLA PRODUCTS
  {
    id: "PAT-001",
    name: "Patola Traditional",
    description: "Authentic Patola silk saree with traditional patterns. Handwoven with natural dyes.",
    price: 15990,
    category: "patola",
    imageUrl: "/assets/patola.jpeg",
    stock: 4,
    inStock: true,
    featured: false,
    tags: ["traditional", "handwoven", "natural dyes"],
    color: "Red",
    zari: "None",
    occasion: "Festival",
    rating: 4.6,
    reviews: 89,
    weight: "500g",
    fabric: "Patola Silk",
    care: "Dry Clean Only"
  },
  {
    id: "PAT-002",
    name: "Patola Modern",
    description: "Modern Patola saree with contemporary designs and elegant patterns.",
    price: 17990,
    category: "patola",
    imageUrl: "/assets/patola1.jpg",
    stock: 3,
    inStock: true,
    featured: true,
    tags: ["modern", "contemporary", "elegant", "patterns"],
    color: "Green",
    zari: "Light",
    occasion: "Party",
    rating: 4.7,
    reviews: 76,
    weight: "520g",
    fabric: "Patola Silk",
    care: "Dry Clean Only"
  },
  {
    id: "PAT-003",
    name: "Patola Designer",
    description: "Designer Patola saree with unique patterns and premium finish.",
    price: 19990,
    category: "patola",
    imageUrl: "/assets/patola1.jpg",
    stock: 2,
    inStock: true,
    featured: true,
    tags: ["designer", "unique", "premium", "finish"],
    color: "Blue",
    zari: "Moderate",
    occasion: "Wedding",
    rating: 4.8,
    reviews: 98,
    weight: "550g",
    fabric: "Patola Silk",
    care: "Dry Clean Only"
  },
  {
    id: "PAT-004",
    name: "Patola Heritage",
    description: "Heritage Patola saree with traditional motifs and authentic craftsmanship.",
    price: 21990,
    category: "patola",
    imageUrl: "/assets/patola1.jpg",
    stock: 1,
    inStock: true,
    featured: true,
    tags: ["heritage", "traditional", "authentic", "craftsmanship"],
    color: "Maroon",
    zari: "Heavy",
    occasion: "Wedding",
    rating: 4.9,
    reviews: 112,
    weight: "580g",
    fabric: "Patola Silk",
    care: "Dry Clean Only"
  },

  // GEORGETTE PRODUCTS
  {
    id: "GEO-001",
    name: "Georgette Floral",
    description: "Beautiful georgette saree with floral prints. Light and flowy, perfect for any occasion.",
    price: 6990,
    category: "georgette",
    imageUrl: "/assets/georgette.jpeg",
    stock: 10,
    inStock: true,
    featured: false,
    tags: ["floral", "light", "flowy", "versatile"],
    color: "Pink",
    zari: "None",
    occasion: "Casual",
    rating: 4.3,
    reviews: 123,
    weight: "250g",
    fabric: "Pure Georgette",
    care: "Hand Wash"
  },
  {
    id: "GEO-002",
    name: "Georgette Embroidered",
    description: "Elegant georgette saree with delicate embroidery work and graceful appeal.",
    price: 8990,
    category: "georgette",
    imageUrl: "/assets/georgette1.jpg",
    stock: 8,
    inStock: true,
    featured: false,
    tags: ["embroidered", "elegant", "delicate", "graceful"],
    color: "Blue",
    zari: "Light",
    occasion: "Festival",
    rating: 4.4,
    reviews: 98,
    weight: "280g",
    fabric: "Pure Georgette",
    care: "Hand Wash"
  },
  {
    id: "GEO-003",
    name: "Georgette Designer",
    description: "Designer georgette saree with contemporary patterns and modern appeal.",
    price: 10990,
    category: "georgette",
    imageUrl: "/assets/georgette1.jpg",
    stock: 6,
    inStock: true,
    featured: true,
    tags: ["designer", "contemporary", "modern", "appeal"],
    color: "Purple",
    zari: "Light",
    occasion: "Party",
    rating: 4.5,
    reviews: 87,
    weight: "270g",
    fabric: "Pure Georgette",
    care: "Hand Wash"
  },
  {
    id: "GEO-004",
    name: "Georgette Party Wear",
    description: "Party wear georgette saree with elegant drape and sophisticated finish.",
    price: 12990,
    category: "georgette",
    imageUrl: "/assets/georgette1.jpg",
    stock: 5,
    inStock: true,
    featured: true,
    tags: ["party", "elegant", "sophisticated", "finish"],
    color: "Black",
    zari: "Moderate",
    occasion: "Party",
    rating: 4.6,
    reviews: 134,
    weight: "290g",
    fabric: "Pure Georgette",
    care: "Hand Wash"
  },

  // CHIFFON PRODUCTS
  {
    id: "CHI-001",
    name: "Chiffon Evening",
    description: "Elegant chiffon saree for evening wear. Sophisticated and graceful.",
    price: 8990,
    category: "chiffon",
    imageUrl: "/assets/chiffon.jpeg",
    stock: 7,
    inStock: true,
    featured: false,
    tags: ["evening", "elegant", "sophisticated", "graceful"],
    color: "Navy Blue",
    zari: "None",
    occasion: "Party",
    rating: 4.4,
    reviews: 112,
    weight: "200g",
    fabric: "Pure Chiffon",
    care: "Hand Wash"
  },
  {
    id: "CHI-002",
    name: "Chiffon Printed",
    description: "Beautiful chiffon saree with printed patterns and comfortable fit.",
    price: 7990,
    category: "chiffon",
    imageUrl: "/assets/chiffon.jpeg",
    stock: 9,
    inStock: true,
    featured: false,
    tags: ["printed", "beautiful", "comfortable", "fit"],
    color: "Green",
    zari: "None",
    occasion: "Casual",
    rating: 4.3,
    reviews: 89,
    weight: "190g",
    fabric: "Pure Chiffon",
    care: "Hand Wash"
  },
  {
    id: "CHI-003",
    name: "Chiffon Embroidered",
    description: "Elegant chiffon saree with delicate embroidery work and graceful appeal.",
    price: 10990,
    category: "chiffon",
    imageUrl: "/assets/chiffon.jpeg",
    stock: 6,
    inStock: true,
    featured: true,
    tags: ["embroidered", "elegant", "delicate", "graceful"],
    color: "Red",
    zari: "Light",
    occasion: "Festival",
    rating: 4.5,
    reviews: 98,
    weight: "220g",
    fabric: "Pure Chiffon",
    care: "Hand Wash"
  },
  {
    id: "CHI-004",
    name: "Chiffon Designer",
    description: "Designer chiffon saree with contemporary patterns and modern appeal.",
    price: 12990,
    category: "chiffon",
    imageUrl: "/assets/chiffon.jpeg",
    stock: 4,
    inStock: true,
    featured: true,
    tags: ["designer", "contemporary", "modern", "appeal"],
    color: "Maroon",
    zari: "Light",
    occasion: "Wedding",
    rating: 4.6,
    reviews: 76,
    weight: "210g",
    fabric: "Pure Chiffon",
    care: "Hand Wash"
  }
];

// Function to migrate all products to Firestore
export const migrateAllProducts = async () => {
  try {
    console.log('🚀 Starting complete product migration...');
    
    // Check if products already exist
    const existingProducts = await getProducts();
    
    if (existingProducts.length > 0) {
      console.log(`📦 Found ${existingProducts.length} existing products.`);
      console.log(`⚠️ Found ${existingProducts.length} existing products. Skipping duplicates and adding new products only.`);
    }
    
    // Add all products
    const results = [];
    let successCount = 0;
    let failCount = 0;
    
    for (const product of ALL_PRODUCTS) {
      try {
        // Check if product already exists
        const existingProduct = existingProducts.find(p => p.id === product.id);
        if (existingProduct) {
          console.log(`⏭️ Skipping existing product: ${product.name}`);
          results.push({ success: true, id: product.id, name: product.name, skipped: true });
          continue;
        }
        
        // Use setDoc with specific product ID instead of addDoc
        const productId = await addProductWithId(product.id, product);
        results.push({ success: true, id: productId, name: product.name });
        successCount++;
        console.log(`✅ Added: ${product.name} (${product.category}) with ID: ${product.id}`);
      } catch (error) {
        console.error(`❌ Failed to add ${product.name}:`, error);
        results.push({ success: false, name: product.name, error: error.message });
        failCount++;
      }
    }
    
    console.log(`🎉 Migration complete! ${successCount} products added, ${failCount} failed.`);
    
    return {
      success: true,
      message: `Migration complete! Added ${successCount} products, skipped ${results.filter(r => r.skipped).length}, failed ${failCount}.`,
      results,
      summary: {
        total: ALL_PRODUCTS.length,
        added: successCount,
        failed: failCount,
        skipped: results.filter(r => r.skipped).length
      }
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      message: 'Migration failed',
      error: error.message
    };
  }
};

// Function to clear all products (for testing)
export const clearAllProducts = async () => {
  try {
    console.log('🗑️ Clearing all products...');
    const products = await getProducts();
    
    if (products.length === 0) {
      console.log('No products found to delete');
      return { success: true, message: 'No products found' };
    }
    
    console.log(`⚠️ WARNING: About to delete all ${products.length} products!`);
    // Note: In a real application, you would use a proper confirmation dialog
    // For now, we'll proceed with deletion (use with caution)
    
    let deletedCount = 0;
    for (const product of products) {
      try {
        await deleteProduct(product.id);
        deletedCount++;
        console.log(`🗑️ Deleted: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to delete ${product.name}:`, error);
      }
    }
    
    console.log(`✅ Deleted ${deletedCount} products`);
    return {
      success: true,
      message: `Deleted ${deletedCount} products`,
      deletedCount
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

// Function to get product statistics
export const getProductStats = async () => {
  try {
    const products = await getProducts();
    
    const stats = {
      total: products.length,
      byCategory: {},
      byPrice: {
        under5000: 0,
        under10000: 0,
        under20000: 0,
        over20000: 0
      },
      inStock: 0,
      outOfStock: 0,
      featured: 0,
      averagePrice: 0
    };
    
    let totalPrice = 0;
    
    products.forEach(product => {
      // Category stats
      stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1;
      
      // Price stats
      if (product.price < 5000) stats.byPrice.under5000++;
      else if (product.price < 10000) stats.byPrice.under10000++;
      else if (product.price < 20000) stats.byPrice.under20000++;
      else stats.byPrice.over20000++;
      
      // Stock stats
      if (product.inStock) stats.inStock++;
      else stats.outOfStock++;
      
      // Featured stats
      if (product.featured) stats.featured++;
      
      totalPrice += product.price;
    });
    
    stats.averagePrice = products.length > 0 ? Math.round(totalPrice / products.length) : 0;
    
    return stats;
  } catch (error) {
    console.error('❌ Failed to get product stats:', error);
    return null;
  }
};

// Make functions available in browser console for easy access
if (typeof window !== 'undefined') {
  window.migrateAllProducts = migrateAllProducts;
  window.clearAllProducts = clearAllProducts;
  window.getProductStats = getProductStats;
  console.log('🌱 Product migration functions available:');
  console.log('- window.migrateAllProducts() - Migrate all products to Firestore');
  console.log('- window.clearAllProducts() - Clear all products from Firestore');
  console.log('- window.getProductStats() - Get product statistics');
}
