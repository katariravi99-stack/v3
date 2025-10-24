// ImgBB image upload utility
// Free tier: 32 MB per image, unlimited uploads

const IMGBB_API_KEY = 'your_imgbb_api_key'; // Replace with your ImgBB API key

export const uploadToImgBB = async (file) => {
  try {
    // Convert file to base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:image/...;base64, prefix
      reader.onerror = error => reject(error);
    });

    // Upload to ImgBB
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64);
    formData.append('name', file.name);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.data.url; // Returns the image URL
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw error;
  }
};

// Setup instructions:
// 1. Go to https://imgbb.com and create a free account
// 2. Go to API section and get your API key
// 3. Replace IMGBB_API_KEY above with your actual API key
