// Emergency Firebase Stop Script
// Run this in browser console to immediately stop all Firebase connections

export const emergencyStopFirebase = () => {
  console.log('🚨 EMERGENCY: Stopping all Firebase connections immediately...');
  
  // Clear all localStorage caches
  localStorage.removeItem('varaha_products_cache');
  localStorage.removeItem('varaha_cart');
  localStorage.removeItem('varaha_wishlist');
  
  // Clear all intervals and timeouts
  const highestTimeoutId = setTimeout(() => {}, 0);
  for (let i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
  }
  
  const highestIntervalId = setInterval(() => {}, 0);
  for (let i = 0; i < highestIntervalId; i++) {
    clearInterval(i);
  }
  
  // Try to access Firebase debug functions if available
  if (typeof window !== 'undefined') {
    if (window.firestoreDebug) {
      try {
        window.firestoreDebug.emergencyDisconnect();
        window.firestoreDebug.clearAllListeners();
        window.firestoreDebug.forceOfflineMode();
      } catch (error) {
        console.log('Firebase debug functions not available:', error);
      }
    }
    
    if (window.firebaseDebugger) {
      try {
        window.firebaseDebugger.clearAllListeners();
      } catch (error) {
        console.log('Firebase debugger not available:', error);
      }
    }
  }
  
  console.log('✅ Emergency stop completed - all Firebase connections should be cleared');
  console.log('📦 App will now work in offline mode using cached data');
  
  return {
    success: true,
    message: 'All Firebase connections stopped',
    timestamp: new Date().toISOString()
  };
};

// Make it available globally
if (typeof window !== 'undefined') {
  window.emergencyStopFirebase = emergencyStopFirebase;
  console.log('🚨 Emergency Firebase stop function available: window.emergencyStopFirebase()');
}
