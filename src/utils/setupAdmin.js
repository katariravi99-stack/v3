// Script to create admin user in Firebase Auth
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import app from '../firebase/config';

const auth = getAuth(app);

// Admin credentials
const ADMIN_EMAIL = 'admin@varahasilks.com';
const ADMIN_PASSWORD = 'Varaha@123';

// Function to create admin user
export const createAdminUser = async () => {
  try {
    console.log('🔧 Creating admin user...');
    
    // Try to create the admin user
    const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Admin user created successfully:', userCredential.user.email);
    
    return {
      success: true,
      message: 'Admin user created successfully',
      user: userCredential.user
    };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Admin user already exists');
      return {
        success: true,
        message: 'Admin user already exists',
        exists: true
      };
    } else {
      console.error('❌ Failed to create admin user:', error);
      return {
        success: false,
        message: `Failed to create admin user: ${error.message}`,
        error: error
      };
    }
  }
};

// Function to test admin login
export const testAdminLogin = async () => {
  try {
    console.log('🔧 Testing admin login...');
    
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Admin login successful:', userCredential.user.email);
    
    return {
      success: true,
      message: 'Admin login successful',
      user: userCredential.user
    };
  } catch (error) {
    console.error('❌ Admin login failed:', error);
    return {
      success: false,
      message: `Admin login failed: ${error.message}`,
      error: error
    };
  }
};

// Make functions available in browser console
if (typeof window !== 'undefined') {
  window.setupAdmin = {
    createAdminUser,
    testAdminLogin
  };
  
  console.log('🔧 Admin setup functions available:');
  console.log('- window.setupAdmin.createAdminUser()');
  console.log('- window.setupAdmin.testAdminLogin()');
}
