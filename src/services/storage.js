const { storage } = require('../config/firebase');

// File upload operations using Firebase Admin Storage
const uploadFile = async (file, path, metadata = {}) => {
  try {
    const bucket = storage.bucket();
    const fileUpload = bucket.file(path);
    
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype || 'application/octet-stream',
        metadata: metadata
      }
    });
    
    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Error uploading file:', error);
        reject(error);
      });
      
      stream.on('finish', async () => {
        try {
          // Make the file publicly accessible
          await fileUpload.makePublic();
          
          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;
          
          console.log('✅ File uploaded successfully:', publicUrl);
          resolve({
            url: publicUrl,
            path: path,
            name: file.originalname || file.name,
            size: file.size
          });
        } catch (error) {
          reject(error);
        }
      });
      
      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const uploadMultipleFiles = async (files, basePath) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const filePath = `${basePath}/${file.originalname || file.name}`;
      return uploadFile(file, filePath);
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

const deleteFile = async (filePath) => {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(filePath);
    
    await file.delete();
    console.log('✅ File deleted successfully:', filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

const getFileMetadata = async (filePath) => {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(filePath);
    
    const [metadata] = await file.getMetadata();
    return metadata;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
};

const listFiles = async (directoryPath) => {
  try {
    const bucket = storage.bucket();
    const [files] = await bucket.getFiles({
      prefix: directoryPath,
      delimiter: '/'
    });

    const fileList = await Promise.all(
      files.map(async (file) => {
        const [metadata] = await file.getMetadata();
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60 * 24 // 24 hours
        });
        
        return {
          name: file.name,
          fullPath: file.name,
          downloadURL: url,
          metadata: metadata
        };
      })
    );

    return fileList;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

const uploadProductImages = async (productId, images) => {
  try {
    const basePath = `products/${productId}/images`;
    const results = await uploadMultipleFiles(images, basePath);
    return results.map(result => result.url);
  } catch (error) {
    console.error('Error uploading product images:', error);
    throw error;
  }
};

const uploadProfileImage = async (userId, imageFile) => {
  try {
    const fileExtension = imageFile.originalname?.split('.').pop() || 'jpg';
    const fileName = `profile.${fileExtension}`;
    const filePath = `users/${userId}/${fileName}`;
    
    const result = await uploadFile(imageFile, filePath);
    return result.url;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

const uploadVideoFile = async (videoFile, path, onProgress = null) => {
  try {
    const bucket = storage.bucket();
    const fileUpload = bucket.file(path);
    
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: videoFile.mimetype || 'video/mp4',
      }
    });
    
    return new Promise((resolve, reject) => {
      let uploadedBytes = 0;
      
      stream.on('error', (error) => {
        console.error('Error uploading video:', error);
        reject(error);
      });
      
      stream.on('data', (chunk) => {
        uploadedBytes += chunk.length;
        if (onProgress && videoFile.size) {
          const progress = (uploadedBytes / videoFile.size) * 100;
          onProgress(progress);
        }
      });
      
      stream.on('finish', async () => {
        try {
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;
          
          console.log('✅ Video uploaded successfully:', publicUrl);
          resolve({
            url: publicUrl,
            path: path,
            name: videoFile.originalname || videoFile.name,
            size: videoFile.size
          });
        } catch (error) {
          reject(error);
        }
      });
      
      stream.end(videoFile.buffer);
    });
  } catch (error) {
    console.error('Error uploading video file:', error);
    throw error;
  }
};

const uploadFounderVideo = async (videoFile, posterFile, productImgFile, metadata) => {
  try {
    const timestamp = Date.now();
    const videoPath = `founder-videos/${timestamp}/${videoFile.originalname || videoFile.name}`;
    const posterPath = `founder-videos/${timestamp}/poster.${posterFile.originalname?.split('.').pop() || 'jpg'}`;
    const productImgPath = `founder-videos/${timestamp}/product.${productImgFile.originalname?.split('.').pop() || 'jpg'}`;

    // Upload files in parallel
    const [videoResult, posterResult, productImgResult] = await Promise.all([
      uploadVideoFile(videoFile, videoPath),
      uploadFile(posterFile, posterPath),
      uploadFile(productImgFile, productImgPath)
    ]);

    return {
      videoURL: videoResult.url,
      posterURL: posterResult.url,
      productImgURL: productImgResult.url,
      metadata: {
        ...metadata,
        videoSize: videoFile.size,
        posterSize: posterFile.size,
        productImgSize: productImgFile.size,
        uploadedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Error uploading founder video:', error);
    throw error;
  }
};

const getFileSizeString = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const generateSignedUrl = async (filePath, expiresIn = 3600) => {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(filePath);
    
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000
    });
    
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFileMetadata,
  listFiles,
  uploadProductImages,
  uploadProfileImage,
  uploadVideoFile,
  uploadFounderVideo,
  getFileSizeString,
  generateSignedUrl
};
