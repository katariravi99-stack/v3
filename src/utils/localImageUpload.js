// Local image upload utility (for development)
// Stores images as base64 in localStorage and provides URLs

export const uploadImageLocally = async (file) => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `product_${timestamp}.${fileExtension}`;
    
    // Convert file to base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
    
    // Store in localStorage
    const imageKey = `product_image_${timestamp}`;
    localStorage.setItem(imageKey, base64);
    
    // Create a local URL
    const localUrl = `/assets/products/${fileName}`;
    
    // Store the mapping in localStorage
    const imageMappings = JSON.parse(localStorage.getItem('imageMappings') || '{}');
    imageMappings[localUrl] = imageKey;
    localStorage.setItem('imageMappings', JSON.stringify(imageMappings));
    
    console.log('🖼️ Image stored locally:', localUrl);
    return localUrl;
  } catch (error) {
    console.error('Local upload error:', error);
    throw error;
  }
};

// Function to get base64 image from localStorage
export const getLocalImage = (imageUrl) => {
  const imageMappings = JSON.parse(localStorage.getItem('imageMappings') || '{}');
  const imageKey = imageMappings[imageUrl];
  return imageKey ? localStorage.getItem(imageKey) : null;
};

// Function to create a blob URL from base64
export const createBlobUrl = (base64) => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });
  return URL.createObjectURL(blob);
};
