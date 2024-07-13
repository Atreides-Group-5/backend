import express from 'express';
import multer from 'multer';
import { updateUserProfile } from '../controllers/userProfileController.js';
import { authenticateMiddleware } from '../middlewares/authMiddleware.js';

const upload = multer({ dest: 'uploads/' }); // Using multer just to handle multipart/form-data

const router = express.Router();

router.put('/:id', authenticateMiddleware, upload.single('profilePicture'), updateUserProfile);

export default router;
