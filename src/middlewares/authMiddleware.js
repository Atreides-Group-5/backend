// src/middlewares/authMiddleware.js
import { body, validationResult } from 'express-validator';

export const validateRegistration = [
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('passwordConfirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
