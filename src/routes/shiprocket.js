const express = require('express');
const router = express.Router();
const shiprocketService = require('../services/shiprocketService');

// Create order in Shiprocket
router.post('/orders/create', async (req, res) => {
  try {
    console.log('📦 Creating Shiprocket order:', req.body);
    
    const result = await shiprocketService.createOrder(req.body);
    
    res.json({
      success: true,
      message: 'Order created successfully in Shiprocket',
      data: result
    });
  } catch (error) {
    console.error('❌ Error creating Shiprocket order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order in Shiprocket',
      error: error.message
    });
  }
});

// Assign AWB to order
router.post('/assign-awb', async (req, res) => {
  try {
    const { shiprocketOrderId, courierId } = req.body;
    
    if (!shiprocketOrderId || !courierId) {
      return res.status(400).json({
        success: false,
        message: 'shiprocketOrderId and courierId are required'
      });
    }
    
    console.log('📦 Assigning AWB to order:', shiprocketOrderId);
    
    const result = await shiprocketService.assignAWB(shiprocketOrderId, courierId);
    
    res.json({
      success: true,
      message: 'AWB assigned successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Error assigning AWB:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign AWB',
      error: error.message
    });
  }
});

// Generate shipping label
router.post('/generate-label', async (req, res) => {
  try {
    const { shipmentId } = req.body;
    
    if (!shipmentId) {
      return res.status(400).json({
        success: false,
        message: 'shipmentId is required'
      });
    }
    
    console.log('🏷️ Generating shipping label for:', shipmentId);
    
    const result = await shiprocketService.generateLabel(shipmentId);
    
    res.json({
      success: true,
      message: 'Shipping label generated successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Error generating shipping label:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate shipping label',
      error: error.message
    });
  }
});

// Track shipment
router.get('/track/:awbCode', async (req, res) => {
  try {
    const { awbCode } = req.params;
    
    if (!awbCode) {
      return res.status(400).json({
        success: false,
        message: 'AWB code is required'
      });
    }
    
    console.log('📍 Tracking shipment:', awbCode);
    
    const result = await shiprocketService.trackShipment(awbCode);
    
    res.json({
      success: true,
      message: 'Shipment tracking successful',
      data: result
    });
  } catch (error) {
    console.error('❌ Error tracking shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track shipment',
      error: error.message
    });
  }
});

// Get available couriers
router.get('/couriers', async (req, res) => {
  try {
    const { pincode, weight } = req.query;
    
    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: 'Pincode is required'
      });
    }
    
    console.log('🚚 Getting available couriers for pincode:', pincode);
    
    const result = await shiprocketService.getCouriers(pincode, weight);
    
    res.json({
      success: true,
      message: 'Available couriers fetched successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Error getting couriers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available couriers',
      error: error.message
    });
  }
});


module.exports = router;
