// Network connectivity helper utilities

export const checkNetworkConnectivity = async () => {
  try {
    // Check if we're online
    if (!navigator.onLine) {
      return { online: false, reason: 'Browser reports offline' };
    }
    
    // Try to fetch a small resource to test actual connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-cache'
      });
      clearTimeout(timeoutId);
      return { online: true, reason: 'Network test successful' };
    } catch (error) {
      clearTimeout(timeoutId);
      return { online: false, reason: 'Network test failed', error: error.message };
    }
  } catch (error) {
    return { online: false, reason: 'Connectivity check failed', error: error.message };
  }
};

export const getNetworkStatus = () => {
  return {
    online: navigator.onLine,
    connectionType: navigator.connection?.effectiveType || 'unknown',
    downlink: navigator.connection?.downlink || 'unknown',
    rtt: navigator.connection?.rtt || 'unknown'
  };
};

export const waitForNetwork = async (maxWaitTime = 30000) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const connectivity = await checkNetworkConnectivity();
    if (connectivity.online) {
      return true;
    }
    
    // Wait 2 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return false;
};

export const showNetworkStatus = () => {
  const status = getNetworkStatus();
  console.log('🌐 Network Status:', status);
  return status;
};
