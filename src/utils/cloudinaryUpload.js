// Cloudinary image upload utility
// Free tier: 25 GB storage, 25 GB bandwidth per month

const CLOUDINARY_CLOUD_NAME = 'your_cloud_name'; // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset'; // Replace with your upload preset

export const uploadToCloudinary = async (file) => {
  try {
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'varaha-silks/products'); // Organize images in folders

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Returns the image URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Setup instructions:
// 1. Go to https://cloudinary.com and create a free account
// 2. Get your Cloud Name from the dashboard
// 3. Create an Upload Preset:
//    - Go to Settings > Upload
//    - Create new upload preset
//    - Set Signing Mode to "Unsigned" for client-side uploads
//    - Set Folder to "varaha-silks/products"
// 4. Replace CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET above
