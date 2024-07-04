import User from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    // console.log("MY LOG:", req.body);
    const { firstname, lastname, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ firstname, lastname, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            message: 'Login successful',
            token,
            user: {id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            country: user.country,
            phone: user.phone,
            profilePicture: user.profilePicture
        }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};