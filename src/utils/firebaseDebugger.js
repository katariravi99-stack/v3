// Firebase Debug Utility
// This utility helps debug and manage Firebase connections to prevent continuous requests

export const firebaseDebugger = {
  // Track active listeners
  activeListeners: new Set(),
  
  // Add listener to tracking
  addListener: (name, unsubscribe) => {
    console.log(`🔍 Adding Firebase listener: ${name}`);
    firebaseDebugger.activeListeners.add({ name, unsubscribe });
    console.log(`📊 Total active listeners: ${firebaseDebugger.activeListeners.size}`);
  },
  
  // Remove listener from tracking
  removeListener: (name) => {
    console.log(`🔍 Removing Firebase listener: ${name}`);
    const listener = Array.from(firebaseDebugger.activeListeners).find(l => l.name === name);
    if (listener) {
      listener.unsubscribe();
      firebaseDebugger.activeListeners.delete(listener);
    }
    console.log(`📊 Total active listeners: ${firebaseDebugger.activeListeners.size}`);
  },
  
  // Clear all listeners
  clearAllListeners: () => {
    console.log(`🧹 Clearing all ${firebaseDebugger.activeListeners.size} Firebase listeners`);
    firebaseDebugger.activeListeners.forEach(listener => {
      try {
        listener.unsubscribe();
      } catch (error) {
        console.error(`Error clearing listener ${listener.name}:`, error);
      }
    });
    firebaseDebugger.activeListeners.clear();
    console.log(`✅ All Firebase listeners cleared`);
  },
  
  // Get listener status
  getStatus: () => {
    const listeners = Array.from(firebaseDebugger.activeListeners).map(l => l.name);
    return {
      count: firebaseDebugger.activeListeners.size,
      listeners: listeners
    };
  },
  
  // Log current status
  logStatus: () => {
    const status = firebaseDebugger.getStatus();
    console.log(`📊 Firebase Debug Status:`, status);
    return status;
  }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.firebaseDebugger = firebaseDebugger;
  console.log('🔧 Firebase debugger available: window.firebaseDebugger');
  console.log('Available methods: addListener, removeListener, clearAllListeners, getStatus, logStatus');
}
