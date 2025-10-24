# Shiprocket Setup Guide

## The Issue
You're getting a 500 Internal Server Error when trying to create orders in Shiprocket because the backend server is missing the required environment variables.

## Required Setup

### 1. Create .env file in server directory
Create a file called `.env` in the `server/` directory with the following content:

```env
# Shiprocket Configuration
SHIPROCKET_EMAIL=your-email@example.com
SHIPROCKET_PASSWORD=your-password
SHIPROCKET_PICKUP_PINCODE=110001

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000

# Razorpay Configuration (if not already set)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 2. Get Shiprocket Credentials
1. Go to [Shiprocket Dashboard](https://app.shiprocket.in/)
2. Sign up/Login to your account
3. Go to Settings > API Settings
4. Note down your email and password
5. Update the `.env` file with your actual credentials

### 3. Set Pickup Location
1. In Shiprocket dashboard, go to Settings > Pickup Locations
2. Add your store address as pickup location
3. Note the pincode and update `SHIPROCKET_PICKUP_PINCODE` in `.env`

### 4. Start the Backend Server
```bash
cd server
npm install
npm start
```

### 5. Test the Connection
Once the server is running, you can test the Shiprocket connection by visiting:
```
http://localhost:5000/api/shiprocket/test
```

## Alternative: Disable Shiprocket Integration Temporarily

If you want to test orders without Shiprocket integration, you can modify the checkout process to skip Shiprocket creation temporarily.

## Expected Result
After proper setup:
- ✅ Orders will be created in Shiprocket automatically
- ✅ AWB codes will be generated
- ✅ Shipping labels can be printed
- ✅ Tracking will work properly

## Troubleshooting

### Error: "Shiprocket authentication failed"
- Check your email and password in .env file
- Ensure your Shiprocket account is active
- Verify API access is enabled in Shiprocket dashboard

### Error: "Invalid pickup location"
- Set up pickup location in Shiprocket dashboard
- Update SHIPROCKET_PICKUP_PINCODE in .env file

### Error: "500 Internal Server Error"
- Check if backend server is running on port 5000
- Verify .env file exists and has correct format
- Check server logs for detailed error messages
