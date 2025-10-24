// Migration utility to create Firestore profiles for existing Firebase Auth users
import { createUserFromAuthData } from '../firebase/firestore';
import { auth } from '../firebase/config';

// Function to migrate current user to Firestore
export const migrateCurrentUser = async () => {
  try {
    console.log('🔄 Starting user migration...');
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('⚠️ No authenticated user found');
      return { success: false, message: 'No authenticated user' };
    }
    
    console.log('👤 Migrating user:', currentUser.email);
    const result = await createUserFromAuthData(currentUser, {
      name: currentUser.displayName || 'User',
      email: currentUser.email,
      phone: '',
      displayName: currentUser.displayName || 'User'
    });
    
    console.log('✅ Migration result:', result);
    return result;
  } catch (error) {
    console.error('❌ Migration error:', error);
    return { success: false, message: error.message };
  }
};

// Function to check if current user exists in Firestore
export const checkUserExists = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { exists: false, message: 'No authenticated user' };
    }
    
    const { getDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../firebase/config');
    
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);
    
    return { 
      exists: userSnap.exists(), 
      data: userSnap.exists() ? userSnap.data() : null 
    };
  } catch (error) {
    console.error('❌ Error checking user existence:', error);
    return { exists: false, error: error.message };
  }
};

// Make functions available in browser console for debugging
if (typeof window !== 'undefined') {
  window.userMigration = {
    migrateCurrentUser,
    checkUserExists
  };
  
  console.log('🔧 User migration functions available:');
  console.log('- window.userMigration.migrateCurrentUser() - Migrate current user to Firestore');
  console.log('- window.userMigration.checkUserExists() - Check if current user exists in Firestore');
}
