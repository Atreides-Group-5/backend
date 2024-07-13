// src/middlewares/authMiddleware.js
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

export const validateRegistration = [
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')

    ,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const authenticateMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Unauthenticated');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await userService.getUserById(decoded.id);
    // if (!user) throw new Error('Unauthenticated');
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const authenticateAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Unauthenticated');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await userService.getUserById(decoded.id);
    console.log(decoded);
    if (!decoded.isAdmin) throw new Error('Unauthenticated');
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};