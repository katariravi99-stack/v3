// Utility to check current authentication status
import { getAuth } from 'firebase/auth';
import app from '../firebase/config';

const auth = getAuth(app);

// Function to check current authentication status
export const checkAuthStatus = () => {
  const user = auth.currentUser;
  const localStorageAdmin = localStorage.getItem('adminLoggedIn') === 'true';
  const adminUser = localStorage.getItem('adminUser');
  
  console.log('🔍 Current Authentication Status:');
  console.log('- Firebase Auth User:', user ? user.email : 'Not logged in');
  console.log('- Firebase Auth UID:', user ? user.uid : 'N/A');
  console.log('- LocalStorage Admin:', localStorageAdmin);
  console.log('- LocalStorage Admin User:', adminUser);
  
  return {
    firebaseUser: user,
    firebaseEmail: user ? user.email : null,
    firebaseUid: user ? user.uid : null,
    localStorageAdmin,
    localStorageAdminUser: adminUser,
    isAdmin: user ? user.email === 'admin@varahasilks.com' : false
  };
};

// Function to force sign out and clear all auth data
export const clearAllAuth = async () => {
  try {
    // Sign out from Firebase Auth
    if (auth.currentUser) {
      await auth.signOut();
      console.log('✅ Signed out from Firebase Auth');
    }
    
    // Clear localStorage
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminUid');
    console.log('✅ Cleared localStorage admin data');
    
    return { success: true, message: 'All authentication data cleared' };
  } catch (error) {
    console.error('❌ Failed to clear auth data:', error);
    return { success: false, message: error.message };
  }
};

// Function to manually sign in as admin
export const manualAdminSignIn = async () => {
  try {
    const { signInWithEmail, signOutUser } = await import('../firebase/auth');
    
    // First sign out current user
    if (auth.currentUser) {
      await signOutUser();
      console.log('✅ Signed out current user');
    }
    
    // Clear localStorage
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminUid');
    
    // Sign in as admin
    const user = await signInWithEmail('admin@varahasilks.com', 'Varaha@123');
    
    console.log('✅ Manual admin sign in successful:', user.email);
    
    // Update localStorage
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('adminUser', user.email);
    localStorage.setItem('adminUid', user.uid);
    
    return { success: true, user };
  } catch (error) {
    console.error('❌ Manual admin sign in failed:', error);
    return { success: false, error: error.message };
  }
};

// Function to force switch to admin user
export const switchToAdmin = async () => {
  try {
    console.log('🔄 Switching to admin user...');
    
    // Clear all auth data first
    await clearAllAuth();
    
    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sign in as admin
    const result = await manualAdminSignIn();
    
    if (result.success) {
      console.log('✅ Successfully switched to admin user');
      // Reload the page to refresh the auth state
      window.location.reload();
    }
    
    return result;
  } catch (error) {
    console.error('❌ Failed to switch to admin:', error);
    return { success: false, error: error.message };
  }
};

// Make functions available in browser console
if (typeof window !== 'undefined') {
  window.authDebug = {
    checkAuthStatus,
    clearAllAuth,
    manualAdminSignIn,
    switchToAdmin
  };
  
  console.log('🔧 Auth debug functions available:');
  console.log('- window.authDebug.checkAuthStatus()');
  console.log('- window.authDebug.clearAllAuth()');
  console.log('- window.authDebug.manualAdminSignIn()');
  console.log('- window.authDebug.switchToAdmin()');
}
