const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

// Import all backend services
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  getUserOrders,
  updateOrderStatus,
  addContactMessage,
  saveUserCart,
  getUserCart,
  saveUserWishlist,
  getUserWishlist,
  createUserProfile,
  getUserProfile,
  getAllUsers,
  getFounderVideos,
  addFounderVideo,
  getAnnouncements,
  getActiveAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  uploadProductImages,
  uploadProfileImage,
  uploadVideoFile,
  uploadFounderVideo
} = require("./index");

// Import Firebase admin for direct database access
const { db: adminDb } = require("./config/firebase");

// Import Shiprocket service
const shiprocketService = require("./services/shiprocketService");
const shiprocketRoutes = require("./routes/shiprocket");

// Import Wakeup service
let wakeupService;
try {
  wakeupService = require("./services/wakeupService");
  console.log('✅ Wakeup service loaded successfully');
  console.log('🔍 Wakeup service type:', typeof wakeupService);
  console.log('🔍 Wakeup service has start method:', typeof wakeupService.start);
  console.log('🔍 Wakeup service methods:', Object.getOwnPropertyNames(wakeupService));
} catch (error) {
  console.error('❌ Failed to load wakeup service:', error.message);
  console.error('❌ Error stack:', error.stack);
  // Create a mock wakeup service to prevent crashes
  wakeupService = {
    start: () => console.log('⚠️ Wakeup service disabled due to loading error'),
    stop: () => console.log('⚠️ Wakeup service disabled'),
    getStatus: () => ({ active: false, error: 'Service not loaded' }),
    triggerWakeup: () => console.log('⚠️ Wakeup service disabled'),
    getExternalPingRecommendations: () => ({ error: 'Service not loaded' })
  };
}

const app = express();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_RMcbXYH6jZlYF1',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '7avk1fzJsk6I4M9i1a7gjUne'
});

// --- Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:3000"],
    credentials: true
  })
);

// --- Routes
app.get("/", (req, res) => res.send("Varaha Silks Backend API - All Services Consolidated"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    time: new Date().toISOString(),
    services: "All backend services available",
    version: "2.0.0"
  });
});

// Wakeup endpoints for external ping services
app.get("/api/wakeup", (req, res) => {
  console.log('🔔 Wakeup endpoint triggered');
  res.json({ 
    status: "awake", 
    time: new Date().toISOString(),
    message: "Backend is awake and ready",
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.get("/api/wakeup/status", (req, res) => {
  const status = wakeupService && typeof wakeupService.getStatus === 'function' 
    ? wakeupService.getStatus() 
    : { active: false, error: 'Service not available' };
  res.json({
    wakeup: status,
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    }
  });
});

app.post("/api/wakeup/trigger", (req, res) => {
  console.log('🔔 Manual wakeup trigger requested');
  if (wakeupService && typeof wakeupService.triggerWakeup === 'function') {
    wakeupService.triggerWakeup();
  } else {
    console.log('⚠️ Wakeup service not available');
  }
  res.json({ 
    status: "triggered", 
    time: new Date().toISOString(),
    message: "Wakeup triggered successfully"
  });
});

app.get("/api/wakeup/recommendations", (req, res) => {
  const recommendations = wakeupService && typeof wakeupService.getExternalPingRecommendations === 'function'
    ? wakeupService.getExternalPingRecommendations()
    : { error: 'Service not available' };
  res.json(recommendations);
});

// Products API
app.get("/api/products", async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const productId = await addProduct(req.body);
    res.status(201).json({ id: productId, message: "Product created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    await updateProduct(req.params.id, req.body);
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Orders API
app.post("/api/orders", async (req, res) => {
  try {
    const orderId = await createOrder(req.body);
    res.status(201).json({ id: orderId, message: "Order created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const orders = await getUserOrders(req.params.userId);
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/orders/:id/status", async (req, res) => {
  try {
    await updateOrderStatus(req.params.id, req.body.status);
    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cart API
app.post("/api/cart/:userId", async (req, res) => {
  try {
    await saveUserCart(req.params.userId, req.body);
    res.json({ message: "Cart saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/cart/:userId", async (req, res) => {
  try {
    const cart = await getUserCart(req.params.userId);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Wishlist API
app.post("/api/wishlist/:userId", async (req, res) => {
  try {
    await saveUserWishlist(req.params.userId, req.body);
    res.json({ message: "Wishlist saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/wishlist/:userId", async (req, res) => {
  try {
    const wishlist = await getUserWishlist(req.params.userId);
    res.json(wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Users API
app.post("/api/users", async (req, res) => {
  try {
    const userId = await createUserProfile(req.body);
    res.status(201).json({ id: userId, message: "User profile created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await getUserProfile(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Founder Videos API
app.get("/api/founder-videos", async (req, res) => {
  try {
    const videos = await getFounderVideos();
    res.json(videos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/founder-videos", async (req, res) => {
  try {
    const videoId = await addFounderVideo(req.body);
    res.status(201).json({ id: videoId, message: "Founder video added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Announcements API
app.get("/api/announcements", async (req, res) => {
  try {
    const announcements = await getAnnouncements();
    res.json(announcements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/announcements/active", async (req, res) => {
  try {
    const announcements = await getActiveAnnouncements();
    res.json(announcements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create announcement
app.post("/api/announcements", async (req, res) => {
  try {
    const announcementData = req.body;
    const result = await createAnnouncement(announcementData);
    res.json({ success: true, id: result.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update announcement
app.put("/api/announcements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    await updateAnnouncement(id, updateData);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete announcement
app.delete("/api/announcements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteAnnouncement(id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle announcement status
app.patch("/api/announcements/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    await toggleAnnouncementStatus(id, isActive);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Contact Messages API
app.post("/api/contact", async (req, res) => {
  try {
    const messageId = await addContactMessage(req.body);
    res.status(201).json({ id: messageId, message: "Contact message sent successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Razorpay Payment API
app.post("/api/orders/create", async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    
    console.log('🔍 Received request to create Razorpay order:');
    console.log('📥 Request body:', req.body);
    console.log('📥 Extracted data:', { amount, currency, receipt, notes });
    
    // Validate required fields
    if (!amount || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return res.status(400).json({ 
        error: 'Invalid amount',
        message: 'Amount must be greater than 0' 
      });
    }
    
    if (!receipt) {
      console.error('❌ Missing receipt:', receipt);
      return res.status(400).json({ 
        error: 'Missing receipt',
        message: 'Receipt is required' 
      });
    }
    
    console.log('✅ Validation passed, creating Razorpay order...');
    
    const order = await razorpay.orders.create({
      amount: amount,
      currency: currency || 'INR',
      receipt: receipt,
      notes: notes || {}
    });
    
    console.log('✅ Razorpay order created successfully:', order.id);
    console.log('📤 Sending response:', order);
    res.json(order);
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message 
    });
  }
});

// Verify payment endpoint
app.post("/api/payments/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id });
    
    // Create signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '7avk1fzJsk6I4M9i1a7gjUne')
      .update(body.toString())
      .digest('hex');
    
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (isAuthentic) {
      console.log('Payment verification successful');
      res.json({
        verified: true,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature
      });
    } else {
      console.log('Payment verification failed - invalid signature');
      res.status(400).json({ 
        verified: false, 
        error: 'Invalid signature' 
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      error: 'Failed to verify payment',
      message: error.message 
    });
  }
});

// Save order endpoint
app.post("/api/orders/save", async (req, res) => {
  try {
    const orderData = req.body;
    
    console.log('Saving order:', orderData.orderId);
    
    // CRITICAL: Verify payment before saving order
    if (orderData.paymentInfo && orderData.paymentInfo.method === 'razorpay') {
      if (!orderData.paymentInfo.paymentId || !orderData.paymentInfo.signature) {
        console.error('❌ Missing payment verification data - not saving order');
        return res.status(400).json({ 
          error: 'Payment verification required',
          message: 'Order cannot be saved without proper payment verification' 
        });
      }
      
      // Verify payment signature
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = {
        razorpay_order_id: orderData.paymentInfo.orderId,
        razorpay_payment_id: orderData.paymentInfo.paymentId,
        razorpay_signature: orderData.paymentInfo.signature
      };
      
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '7avk1fzJsk6I4M9i1a7gjUne')
        .update(body.toString())
        .digest('hex');
      
      const isAuthentic = expectedSignature === razorpay_signature;
      
      if (!isAuthentic) {
        console.error('❌ Payment signature verification failed - not saving order');
        return res.status(400).json({ 
          error: 'Payment verification failed',
          message: 'Invalid payment signature - order cannot be saved' 
        });
      }
      
      console.log('✅ Payment signature verified successfully');
    }
    
    // Save to Firestore using your existing order service
    const orderId = await createOrder(orderData);
    
    console.log('Order saved successfully to Firestore:', orderId);
    
    // Create order in Shiprocket after successful payment
    try {
      console.log('🚀 Creating order in Shiprocket...');
      const shiprocketResult = await shiprocketService.createOrder(orderData);
      
      if (shiprocketResult.success) {
        console.log('✅ Order created in Shiprocket successfully:', shiprocketResult.shiprocketOrderId);
        
        // Update the order in Firestore with Shiprocket order ID
        await updateOrderStatus(orderId, {
          status: 'confirmed',
          shiprocketOrderId: shiprocketResult.shiprocketOrderId,
          shiprocketStatus: 'created',
          updatedAt: new Date()
        });
        
        res.json({
          success: true,
          orderId: orderId,
          shiprocketOrderId: shiprocketResult.shiprocketOrderId,
          message: 'Order saved successfully and created in Shiprocket'
        });
      } else {
        throw new Error('Failed to create order in Shiprocket');
      }
    } catch (shiprocketError) {
      console.error('❌ Shiprocket order creation failed:', shiprocketError.message);
      // Don't fail the entire order if Shiprocket fails
      // The order is still saved in Firestore
      res.json({
        success: true,
        orderId: orderId,
        warning: 'Order saved but Shiprocket integration failed',
        shiprocketError: shiprocketError.message,
        message: 'Order saved successfully to database'
      });
    }
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ 
      error: 'Failed to save order',
      message: error.message 
    });
  }
});

// Get payment status endpoint
app.get("/api/payments/status/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    console.log('Getting payment status for:', paymentId);
    
    // Validate payment ID format
    if (!paymentId || paymentId.trim() === '') {
      return res.status(400).json({
        error: 'Invalid payment ID',
        message: 'Payment ID cannot be empty'
      });
    }
    
    // Check if this is an order ID (starts with 'order_') or payment ID
    if (paymentId.startsWith('order_')) {
      // This is an order ID, try to find payments for this order
      try {
        console.log('Fetching payments for order ID:', paymentId);
        const payments = await razorpay.orders.fetchPayments(paymentId);
        console.log('Found payments for order:', payments);
        
        if (payments && payments.items && payments.items.length > 0) {
          const payment = payments.items[0]; // Get the first payment
          res.json({
            payment_id: payment.id,
            order_id: paymentId,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            signature: payment.signature || null,
            createdAt: new Date(payment.created_at * 1000).toISOString()
          });
        } else {
          console.log('No payments found for order:', paymentId);
          res.json({
            payment_id: null,
            order_id: paymentId,
            status: 'no_payments',
            amount: 0,
            currency: 'INR',
            signature: null,
            createdAt: null,
            message: 'Order exists but no payments found'
          });
        }
      } catch (orderError) {
        console.error('Error fetching payments for order:', orderError);
        
        // Check if it's a "not found" error
        if (orderError.statusCode === 400 && orderError.error && orderError.error.code === 'BAD_REQUEST_ERROR') {
          res.json({
            payment_id: null,
            order_id: paymentId,
            status: 'order_not_found',
            amount: 0,
            currency: 'INR',
            signature: null,
            createdAt: null,
            error: 'Order does not exist in Razorpay'
          });
        } else {
          res.json({
            payment_id: null,
            order_id: paymentId,
            status: 'error',
            amount: 0,
            currency: 'INR',
            signature: null,
            createdAt: null,
            error: orderError.message
          });
        }
      }
    } else {
      // This is a payment ID, fetch payment details directly
      try {
        console.log('Fetching payment details for payment ID:', paymentId);
        const payment = await razorpay.payments.fetch(paymentId);
        console.log('Found payment:', payment);
        
        res.json({
          payment_id: payment.id,
          order_id: payment.order_id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          signature: payment.signature || null,
          createdAt: new Date(payment.created_at * 1000).toISOString()
        });
      } catch (paymentError) {
        console.error('Error fetching payment:', paymentError);
        
        // Check if it's a "not found" error
        if (paymentError.statusCode === 400 && paymentError.error && paymentError.error.code === 'BAD_REQUEST_ERROR') {
          res.status(404).json({
            error: 'Payment not found',
            message: 'The payment ID does not exist in Razorpay',
            payment_id: paymentId,
            status: 'not_found'
          });
        } else {
          res.status(500).json({
            error: 'Failed to fetch payment',
            message: paymentError.message,
            payment_id: paymentId
          });
        }
      }
    }
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ 
      error: 'Failed to get payment status',
      message: error.message 
    });
  }
});

// Use Shiprocket routes
app.use('/api/shiprocket', shiprocketRoutes);


// Sync order with Shiprocket data (with admin privileges)
app.post("/api/shiprocket/sync-order", async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    console.log(`🔄 Syncing order with Shiprocket: ${orderId}`);
    
    // Get the order from Firestore using admin privileges
    const orderDoc = await adminDb.collection('orders').where('orderId', '==', orderId).get();
    
    if (orderDoc.empty) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const orderDocData = orderDoc.docs[0];
    const order = { id: orderDocData.id, ...orderDocData.data() };
    
    // Get all orders from Shiprocket
    const shiprocketResult = await shiprocketService.getAllOrders();
    
    if (!shiprocketResult.success || !shiprocketResult.orders || !Array.isArray(shiprocketResult.orders)) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders from Shiprocket'
      });
    }
    
    // Find matching order in Shiprocket data
    const shiprocketOrder = shiprocketResult.orders.find(srOrder => 
      srOrder.order_id === order.orderId || 
      srOrder.channel_order_id === order.orderId
    );
    
    if (!shiprocketOrder) {
      return res.json({
        success: false,
        message: `Order ${orderId} not found in Shiprocket`
      });
    }
    
    // Prepare update data with only defined values
    const updateData = {
      shiprocketLastUpdated: new Date(),
      updatedAt: new Date()
    };
    
    if (shiprocketOrder.id || shiprocketOrder.order_id) {
      updateData.shiprocketOrderId = shiprocketOrder.id || shiprocketOrder.order_id;
    }
    if (shiprocketOrder.awb_code) {
      updateData.shiprocketAWB = shiprocketOrder.awb_code;
      updateData.awbCode = shiprocketOrder.awb_code;
    }
    if (shiprocketOrder.status) {
      updateData.shiprocketStatus = shiprocketOrder.status;
    }
    if (shiprocketOrder.courier_name) {
      updateData.courierName = shiprocketOrder.courier_name;
    }
    if (shiprocketOrder.tracking_url) {
      updateData.trackingUrl = shiprocketOrder.tracking_url;
    }
    
    // Update Firestore order with Shiprocket data using admin privileges
    await adminDb.collection('orders').doc(order.id).update(updateData);
    
    console.log(`✅ Updated Firestore order ${orderId} with Shiprocket data`);
    
    res.json({
      success: true,
      message: `Order ${orderId} synced successfully with Shiprocket`,
      shiprocketOrderId: updateData.shiprocketOrderId,
      awbCode: updateData.awbCode,
      status: updateData.shiprocketStatus
    });
    
  } catch (error) {
    console.error(`❌ Error syncing order with Shiprocket:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to sync order with Shiprocket'
    });
  }
});

// Create real Shiprocket order and update Firestore (with admin privileges)
app.post("/api/shiprocket/create-real-order", async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    console.log(`🚀 Creating real Shiprocket order for: ${orderId}`);
    
    // Get the order from Firestore using admin privileges
    const orderDoc = await adminDb.collection('orders').where('orderId', '==', orderId).get();
    
    if (orderDoc.empty) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const orderDocData = orderDoc.docs[0];
    const order = { id: orderDocData.id, ...orderDocData.data() };
    
    // Check if order already has Shiprocket data
    if (order.shiprocketOrderId && order.shiprocketCreated) {
      return res.json({
        success: false,
        message: 'Order already exists in Shiprocket',
        shiprocketOrderId: order.shiprocketOrderId
      });
    }
    
    // Prepare order data for Shiprocket API
    const shiprocketOrderData = {
      orderId: order.orderId,
      orderDate: order.createdAt?.toDate ? order.createdAt.toDate().toISOString() : new Date(order.createdAt || order.timestamp).toISOString(),
      billingCustomerName: order.customerInfo?.name || 'Customer',
      billingLastName: "",
      billingAddress: order.customerInfo?.address?.street || '',
      billingAddress2: "",
      billingCity: order.customerInfo?.address?.city || '',
      billingPincode: order.customerInfo?.address?.pincode || '',
      billingState: order.customerInfo?.address?.state || '',
      billingCountry: order.customerInfo?.address?.country || 'India',
      billingPhone: order.customerInfo?.phone || '',
      billingEmail: order.customerInfo?.email || '',
      shippingIsBilling: true,
      orderItems: (order.cartItems || []).map(item => ({
        name: item.name || 'Product',
        sku: item.id || 'SKU001',
        units: item.quantity || 1,
        sellingPrice: item.price || 0
      })),
      paymentMethod: order.paymentInfo?.method === 'cod' ? 'COD' : 'Prepaid',
      subTotal: order.paymentInfo?.amount || order.total || 0,
      length: 30, // Default dimensions in cm
      breadth: 20,
      height: 5,
      weight: 0.5 // Default weight in kg
    };
    
    console.log('📋 Creating order in Shiprocket:', shiprocketOrderData);
    
    // Create order in Shiprocket
    const shiprocketResult = await shiprocketService.createOrder(shiprocketOrderData);
    
    if (shiprocketResult.success && shiprocketResult.data) {
      // Update Firestore order with real Shiprocket data using admin privileges
      await adminDb.collection('orders').doc(order.id).update({
        shiprocketOrderId: shiprocketResult.data.order_id || shiprocketResult.data.channel_order_id,
        shiprocketStatus: 'NEW',
        shiprocketCreated: true,
        shiprocketLastUpdated: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✅ Updated Firestore order ${orderId} with real Shiprocket data`);
      
      res.json({
        success: true,
        shiprocketOrderId: shiprocketResult.data.order_id || shiprocketResult.data.channel_order_id,
        message: 'Order successfully created in Shiprocket'
      });
    } else {
      throw new Error('Failed to create order in Shiprocket');
    }
    
  } catch (error) {
    console.error(`❌ Error creating real Shiprocket order:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to create order in Shiprocket'
    });
  }
});

// File Upload API
app.post("/api/upload", async (req, res) => {
  try {
    // This would need proper file handling middleware like multer
    res.status(501).json({ error: "File upload endpoint needs proper implementation" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- 404 + Error handlers
app.use(require("./middleware/notFound"));
app.use(require("./middleware/errorHandler"));

// --- Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Varaha Silks Backend API running on http://localhost:${PORT}`);
  console.log(`📡 All backend services consolidated and available`);
  
  // Start automatic wakeup service
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_WAKEUP === 'true') {
    if (wakeupService && typeof wakeupService.start === 'function') {
      wakeupService.start();
    } else {
      console.log('⚠️ Wakeup service not available or start method missing');
    }
  } else {
    console.log('🔄 Wakeup service disabled in development mode');
  }
  
  console.log(`🔧 Available endpoints:`);
  console.log(`   - GET  /api/health - Health check`);
  console.log(`   - GET  /api/wakeup - Wakeup endpoint for external ping services`);
  console.log(`   - GET  /api/wakeup/status - Wakeup service status`);
  console.log(`   - POST /api/wakeup/trigger - Manual wakeup trigger`);
  console.log(`   - GET  /api/wakeup/recommendations - External ping service recommendations`);
  console.log(`   - GET  /api/products - Get all products`);
  console.log(`   - POST /api/products - Create product`);
  console.log(`   - GET  /api/orders/user/:userId - Get user orders`);
  console.log(`   - POST /api/orders - Create order`);
  console.log(`   - GET  /api/cart/:userId - Get user cart`);
  console.log(`   - POST /api/cart/:userId - Save user cart`);
  console.log(`   - GET  /api/wishlist/:userId - Get user wishlist`);
  console.log(`   - POST /api/wishlist/:userId - Save user wishlist`);
  console.log(`   - GET  /api/users - Get all users`);
  console.log(`   - POST /api/users - Create user profile`);
  console.log(`   - GET  /api/founder-videos - Get founder videos`);
  console.log(`   - POST /api/founder-videos - Add founder video`);
  console.log(`   - GET  /api/announcements - Get announcements`);
  console.log(`   - GET  /api/announcements/active - Get active announcements`);
  console.log(`   - POST /api/contact - Send contact message`);
  console.log(`   💳 RAZORPAY PAYMENT ENDPOINTS:`);
  console.log(`   - POST /api/orders/create - Create Razorpay order`);
  console.log(`   - POST /api/payments/verify - Verify payment signature`);
  console.log(`   - POST /api/orders/save - Save order to database`);
  console.log(`   - GET  /api/payments/status/:paymentId - Get payment status`);
  console.log(`   🚀 SHIPROCKET SHIPPING ENDPOINTS:`);
  console.log(`   - POST /api/shiprocket/orders/create - Create order in Shiprocket`);
  console.log(`   - POST /api/shiprocket/assign-awb - Assign AWB to order`);
  console.log(`   - POST /api/shiprocket/generate-label - Generate shipping label`);
  console.log(`   - GET  /api/shiprocket/track/:awbCode - Track shipment`);
  console.log(`   - GET  /api/shiprocket/couriers - Get available couriers`);
});
