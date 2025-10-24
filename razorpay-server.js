const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_RMcbXYH6jZlYF1',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '7avk1fzJsk6I4M9i1a7gjUne'
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Razorpay server is running' });
});

// Create order endpoint
app.post('/api/orders/create', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    
    console.log('Creating order:', { amount, currency, receipt, notes });
    
    const order = await razorpay.orders.create({
      amount: amount,
      currency: currency || 'INR',
      receipt: receipt,
      notes: notes || {}
    });
    
    console.log('Order created successfully:', order);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message 
    });
  }
});

// Verify payment endpoint
app.post('/api/payments/verify', async (req, res) => {
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
app.post('/api/orders/save', async (req, res) => {
  try {
    const orderData = req.body;
    
    console.log('Saving order:', orderData.orderId);
    
    // For now, we'll save to a simple JSON file
    // In production, you should integrate with your Firestore database
    const fs = require('fs').promises;
    const path = require('path');
    
    const ordersFile = path.join(__dirname, 'orders.json');
    
    // Read existing orders
    let orders = [];
    try {
      const data = await fs.readFile(ordersFile, 'utf8');
      orders = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start with empty array
      orders = [];
    }
    
    // Add new order
    const newOrder = {
      ...orderData,
      id: `order_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: orderData.customerInfo?.email || 'guest',
      orderStatus: 'confirmed',
      paymentStatus: 'completed'
    };
    
    orders.push(newOrder);
    
    // Save back to file
    await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
    
    console.log('Order saved successfully to file:', orderData.orderId);
    res.json({
      success: true,
      orderId: orderData.orderId,
      fileId: newOrder.id,
      message: 'Order saved successfully to database'
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ 
      error: 'Failed to save order',
      message: error.message 
    });
  }
});

// Get all orders endpoint (for admin dashboard)
app.get('/api/orders', async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const ordersFile = path.join(__dirname, 'orders.json');
    
    // Read orders from file
    let orders = [];
    try {
      const data = await fs.readFile(ordersFile, 'utf8');
      orders = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, return empty array
      orders = [];
    }
    
    res.json({
      success: true,
      orders: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ 
      error: 'Failed to get orders',
      message: error.message 
    });
  }
});

// Get payment status endpoint
app.get('/api/payments/status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    console.log('Getting payment status for:', paymentId);
    
    // Here you would typically fetch from your database
    // For now, we'll return a mock response
    
    // TODO: Fetch from your database
    // Example:
    // const payment = await Payment.findOne({ paymentId });
    
    res.json({
      paymentId: paymentId,
      status: 'captured',
      amount: 0,
      currency: 'INR',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ 
      error: 'Failed to get payment status',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Razorpay server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💳 Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID || 'rzp_live_RMcbXYH6jZlYF1'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
