import express from 'express';
import { uploadTutorFiles, uploadEvidence, handleUploadError } from '../middleware/upload.js';
import { authenticateSession } from '../middleware/session.js';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js';

const router = express.Router();

// Helper function to upload to Cloudinary from memory buffer
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(buffer);
  });
};

// Upload tutor application files (profile picture + demo video)
router.post('/tutor-files', authenticateSession, uploadTutorFiles, handleUploadError, async (req, res) => {
  try {
    const files = {};
    
    if (req.files.profilePicture) {
      const profileFile = req.files.profilePicture[0];
      const profileResult = await uploadToCloudinary(profileFile.buffer, {
        folder: 'ethio-education/profiles',
        resource_type: 'image',
        transformation: [{ width: 500, height: 500, crop: 'limit', quality: 'auto' }]
      });
      files.profilePicture = profileResult.secure_url;
    }
    
    if (req.files.demoVideo) {
      const videoFile = req.files.demoVideo[0];
      const videoResult = await uploadToCloudinary(videoFile.buffer, {
        folder: 'ethio-education/videos',
        resource_type: 'video'
      });
      files.demoVideo = videoResult.secure_url;
    }

    res.json({
      success: true,
      message: 'Files uploaded successfully to Cloudinary',
      files
    });
  } catch (error) {
    console.error('Upload tutor files error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading files to Cloudinary'
    });
  }
});

// Upload evidence files for disputes
router.post('/evidence', authenticateSession, uploadEvidence, handleUploadError, (req, res) => {
  try {
    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      url: file.path, // Cloudinary URL
      size: file.size,
      publicId: file.public_id
    }));

    res.json({
      success: true,
      message: 'Evidence files uploaded successfully to Cloudinary',
      files
    });
  } catch (error) {
    console.error('Upload evidence error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading evidence to Cloudinary'
    });
  }
});

// Get user's uploaded files
router.get('/user-files/:userId', authenticateSession, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user can access these files (own files or admin)
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get files from database (assuming you store URLs in user profile)
    const user = await User.findById(userId).select('profilePicture demoVideo documents');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const files = {
      profilePicture: user.profilePicture || null,
      demoVideo: user.demoVideo || null,
      documents: user.documents || []
    };

    res.json({
      success: true,
      files
    });
  } catch (error) {
    console.error('Get user files error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving files'
    });
  }
});

// Delete file from Cloudinary
router.delete('/file/:publicId', authenticateSession, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete file'
      });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting file'
    });
  }
});

export default router;
