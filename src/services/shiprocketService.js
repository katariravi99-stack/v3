const axios = require('axios');
require('dotenv').config();

class ShiprocketService {
  constructor() {
    this.baseURL = 'https://apiv2.shiprocket.in/v1/external';
    this.email = process.env.SHIPROCKET_EMAIL;
    this.password = process.env.SHIPROCKET_PASSWORD;
    this.token = null;
    this.tokenExpiry = null;
  }

  // Authenticate with Shiprocket API
  async authenticate() {
    try {
      if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
        return this.token; // Token is still valid
      }

      const response = await axios.post(`${this.baseURL}/auth/login`, {
        email: this.email,
        password: this.password
      });

      if (response.data && response.data.token) {
        this.token = response.data.token;
        // Token is valid for 240 hours (10 days)
        this.tokenExpiry = new Date(Date.now() + (240 * 60 * 60 * 1000));
        console.log('✅ Shiprocket authentication successful');
        return this.token;
      } else {
        throw new Error('Invalid response from Shiprocket API');
      }
    } catch (error) {
      console.error('❌ Shiprocket authentication failed:', error.response?.data || error.message);
      throw new Error(`Shiprocket authentication failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get authenticated headers
  async getAuthHeaders() {
    const token = await this.authenticate();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Create order in Shiprocket
  async createOrder(orderData) {
    try {
      console.log('🚀 Creating order in Shiprocket:', orderData.orderId);
      
      const headers = await this.getAuthHeaders();
      
      // Transform order data to Shiprocket format
      const shiprocketOrder = this.transformOrderData(orderData);
      
      const response = await axios.post(
        `${this.baseURL}/orders/create/adhoc`,
        shiprocketOrder,
        { headers }
      );

      console.log('🔍 Shiprocket API Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data && (response.data.order_id || response.data.channel_order_id)) {
        const orderId = response.data.order_id || response.data.channel_order_id;
        console.log('✅ Order created in Shiprocket successfully:', orderId);
        return {
          success: true,
          shiprocketOrderId: orderId,
          data: response.data
        };
      } else {
        console.log('❌ Invalid response structure:', response.data);
        throw new Error('Invalid response from Shiprocket API');
      }
    } catch (error) {
      console.error('❌ Failed to create order in Shiprocket:', error.response?.data || error.message);
      throw new Error(`Shiprocket order creation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Transform order data to Shiprocket format
  transformOrderData(orderData) {
    console.log('🔍 Transforming order data:', JSON.stringify(orderData, null, 2));
    
    // Handle both data structures - new format (individual fields) and old format (customerInfo object)
    let customerName, customerEmail, customerPhone;
    let billingAddress, billingCity, billingPincode, billingState, billingCountry;
    
    if (orderData.customerInfo && orderData.customerInfo.address) {
      // Old format: customerInfo.address structure
      const customerInfo = orderData.customerInfo;
      const address = customerInfo.address;
      
      customerName = customerInfo.name;
      customerEmail = customerInfo.email;
      customerPhone = customerInfo.phone;
      billingAddress = address.street;
      billingCity = address.city;
      billingPincode = address.pincode;
      billingState = address.state;
      billingCountry = address.country || "India";
    } else {
      // New format: individual fields
      customerName = orderData.billingCustomerName || orderData.customerName;
      customerEmail = orderData.billingEmail || orderData.customerEmail;
      customerPhone = orderData.billingPhone || orderData.customerPhone;
      billingAddress = orderData.billingAddress;
      billingCity = orderData.billingCity;
      billingPincode = orderData.billingPincode;
      billingState = orderData.billingState;
      billingCountry = orderData.billingCountry || "India";
    }
    
    // Calculate total weight (assuming average weight per item)
    const totalWeight = (orderData.cartItems || orderData.orderItems || []).reduce((total, item) => {
      return total + (item.weight || 0.5); // Default 0.5kg per item if weight not specified
    }, 0);

    // Calculate total value
    const totalValue = (orderData.cartItems || orderData.orderItems || []).reduce((total, item) => {
      return total + ((item.price || item.sellingPrice) * item.quantity);
    }, 0);

    const transformedData = {
      order_id: orderData.orderId,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "warehouse-1", // Updated to match your Shiprocket pickup location
      billing_customer_name: customerName,
      billing_last_name: (customerName || '').split(' ').slice(1).join(' ') || '',
      billing_address: billingAddress,
      billing_address_2: "",
      billing_city: billingCity,
      billing_pincode: billingPincode,
      billing_state: billingState,
      billing_country: billingCountry,
      billing_email: customerEmail,
      billing_phone: customerPhone,
      billing_alternate_phone: "",
      shipping_is_billing: true,
      shipping_customer_name: customerName,
      shipping_last_name: (customerName || '').split(' ').slice(1).join(' ') || '',
      shipping_address: billingAddress,
      shipping_address_2: "",
      shipping_city: billingCity,
      shipping_pincode: billingPincode,
      shipping_state: billingState,
      shipping_country: billingCountry,
      shipping_email: customerEmail,
      shipping_phone: customerPhone,
      order_items: (orderData.cartItems || orderData.orderItems || []).map(item => ({
        name: item.name,
        sku: item.id || item.sku || item.name,
        units: item.quantity || item.units,
        selling_price: item.price || item.sellingPrice,
        discount: 0,
        tax: 0,
        hsn: 6204, // HSN code for silk sarees
        product_category: "Silk Sarees"
      })),
      payment_method: (orderData.paymentMethod === 'COD' || orderData.paymentMethod === 'cod') ? "COD" : "Prepaid",
      sub_total: orderData.subTotal || totalValue,
      length: orderData.length || 30, // Default dimensions in cm
      breadth: orderData.breadth || 20,
      height: orderData.height || 5,
      weight: Math.max(orderData.weight || totalWeight, 0.1), // Minimum 0.1kg
      order_notes: orderData.orderNotes || "Silk saree order from Varaha Silks"
    };
    
    // Validate required fields
    const requiredFields = ['billing_customer_name', 'billing_address', 'billing_city', 'billing_pincode', 'billing_state', 'billing_email', 'billing_phone'];
    const missingFields = requiredFields.filter(field => !transformedData[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields for Shiprocket:', missingFields);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    console.log('✅ Transformed data for Shiprocket:', JSON.stringify(transformedData, null, 2));
    return transformedData;
  }

  // Assign AWB (Air Waybill) to order
  async assignAWB(shiprocketOrderId, courierId) {
    try {
      console.log('📦 Assigning AWB to order:', shiprocketOrderId);
      
      const headers = await this.getAuthHeaders();
      
      const response = await axios.post(
        `${this.baseURL}/courier/assign/awb`,
        {
          shipment_id: shiprocketOrderId,
          courier_id: courierId
        },
        { headers }
      );

      if (response.data && response.data.awb_code) {
        console.log('✅ AWB assigned successfully:', response.data.awb_code);
        return {
          success: true,
          awbCode: response.data.awb_code,
          data: response.data
        };
      } else {
        throw new Error('Invalid response from Shiprocket API');
      }
    } catch (error) {
      console.error('❌ Failed to assign AWB:', error.response?.data || error.message);
      throw new Error(`AWB assignment failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Generate shipping label
  async generateLabel(shipmentId) {
    try {
      console.log('🏷️ Generating shipping label for:', shipmentId);
      
      const headers = await this.getAuthHeaders();
      
      const response = await axios.post(
        `${this.baseURL}/courier/generate/label`,
        {
          shipment_id: shipmentId
        },
        { headers }
      );

      if (response.data && response.data.label_url) {
        console.log('✅ Shipping label generated successfully');
        return {
          success: true,
          labelUrl: response.data.label_url,
          data: response.data
        };
      } else {
        throw new Error('Invalid response from Shiprocket API');
      }
    } catch (error) {
      console.error('❌ Failed to generate shipping label:', error.response?.data || error.message);
      throw new Error(`Label generation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Track shipment
  async trackShipment(awbCode) {
    try {
      console.log('📍 Tracking shipment:', awbCode);
      
      const headers = await this.getAuthHeaders();
      
      const response = await axios.get(
        `${this.baseURL}/courier/track/awb/${awbCode}`,
        { headers }
      );

      if (response.data) {
        console.log('✅ Shipment tracking successful');
        return {
          success: true,
          trackingData: response.data,
          data: response.data
        };
      } else {
        throw new Error('Invalid response from Shiprocket API');
      }
    } catch (error) {
      console.error('❌ Failed to track shipment:', error.response?.data || error.message);
      throw new Error(`Shipment tracking failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get shipment details (more comprehensive than tracking)
  async getShipmentDetails(shiprocketOrderId) {
    try {
      console.log('📋 Getting shipment details for order:', shiprocketOrderId);
      
      const headers = await this.getAuthHeaders();
      
      const response = await axios.get(
        `${this.baseURL}/orders/show/${shiprocketOrderId}`,
        { headers }
      );

      if (response.data && response.data.data) {
        console.log('✅ Shipment details retrieved successfully');
        return {
          success: true,
          shipmentData: response.data.data,
          data: response.data.data
        };
      } else {
        throw new Error('Invalid response from Shiprocket API');
      }
    } catch (error) {
      console.error('❌ Failed to get shipment details:', error.response?.data || error.message);
      throw new Error(`Shipment details retrieval failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get all orders from Shiprocket
  async getAllOrders() {
    try {
      console.log('📦 Getting all orders from Shiprocket...');
      
      const headers = await this.getAuthHeaders();
      
      const response = await axios.get(
        `${this.baseURL}/orders`,
        { headers }
      );

      if (response.data && response.data.data) {
        console.log('✅ Orders fetched successfully from Shiprocket');
        return {
          success: true,
          orders: response.data.data,
          data: response.data
        };
      } else {
        throw new Error('Invalid response from Shiprocket API');
      }
    } catch (error) {
      console.error('❌ Failed to get orders from Shiprocket:', error.response?.data || error.message);
      throw new Error(`Failed to get orders: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get available couriers
  async getCouriers(pincode, weight) {
    try {
      console.log('🚚 Getting available couriers for pincode:', pincode);
      
      const headers = await this.getAuthHeaders();
      
      const response = await axios.get(
        `${this.baseURL}/courier/serviceability/`,
        {
          headers,
          params: {
            pickup_pincode: process.env.SHIPROCKET_PICKUP_PINCODE || "110001", // Your pickup pincode
            delivery_pincode: pincode,
            weight: weight || 0.5,
            cod: 0 // Cash on delivery amount
          }
        }
      );

      if (response.data && response.data.data) {
        console.log('✅ Available couriers fetched successfully');
        return {
          success: true,
          couriers: response.data.data,
          data: response.data
        };
      } else {
        throw new Error('Invalid response from Shiprocket API');
      }
    } catch (error) {
      console.error('❌ Failed to get couriers:', error.response?.data || error.message);
      throw new Error(`Courier serviceability check failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = new ShiprocketService();
