const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  const serviceAccount = require('../../firebase-service-account.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://varaha-silks-default-rtdb.firebaseio.com"
  });
}

const db = admin.firestore();

// Create a new order
const createOrder = async (orderData) => {
  try {
    console.log('Creating order in Firestore:', orderData.orderId);
    
    const orderRef = await db.collection('orders').add({
      ...orderData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Order created with ID:', orderRef.id);
    return { id: orderRef.id, ...orderData };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get all orders
const getAllOrders = async () => {
  try {
    const snapshot = await db.collection('orders')
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

// Get orders by user email
const getOrdersByUser = async (userEmail) => {
  try {
    const snapshot = await db.collection('orders')
      .where('userId', '==', userEmail)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
  try {
    await db.collection('orders').doc(orderId).update({
      orderStatus: status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Order status updated:', orderId, status);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  updateOrderStatus
};
