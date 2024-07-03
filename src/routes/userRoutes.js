import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { validateRegistration } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', loginUser);

export default router;
