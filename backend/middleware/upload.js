import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

// Configure Cloudinary storage for different file types
const createCloudinaryStorage = (folder, resourceType = 'auto') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `ethio-education/${folder}`,
      resource_type: resourceType,
      allowed_formats: resourceType === 'video' ? ['mp4', 'mov', 'avi', 'mkv'] : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: resourceType === 'image' ? [
        { width: 500, height: 500, crop: 'limit', quality: 'auto' }
      ] : undefined
    }
  });
};

// Different storage configurations
const profileStorage = createCloudinaryStorage('profiles', 'image');
const videoStorage = createCloudinaryStorage('videos', 'video');
const evidenceStorage = createCloudinaryStorage('evidence', 'auto');

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profilePicture') {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile pictures'), false);
    }
  } else if (file.fieldname === 'demoVideo') {
    // Accept only videos
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed for demo videos'), false);
    }
  } else if (file.fieldname === 'evidence') {
    // Accept images and documents
    const allowedTypes = ['image/', 'application/pdf', 'text/'];
    const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and text files are allowed as evidence'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Configure multer instances for different file types
const profileUpload = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
    files: 1
  }
});

const videoUpload = multer({
  storage: videoStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
    files: 1
  }
});

const evidenceUpload = multer({
  storage: evidenceStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit for evidence files
    files: 5
  }
});

// Specific upload configurations
export const uploadProfile = profileUpload.single('profilePicture');
export const uploadVideo = videoUpload.single('demoVideo');
export const uploadEvidence = evidenceUpload.array('evidence', 5);

// Combined upload for tutor files
export const uploadTutorFiles = multer({
  storage: multer.memoryStorage(), // Use memory storage for combined uploads
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 2
  }
}).fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'demoVideo', maxCount: 1 }
]);

// Error handling middleware
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Export a default multer instance for general use
export default multer;
