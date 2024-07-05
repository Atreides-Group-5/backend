import User from '../models/userModel.js';
import { cloudinary } from '../config/cloudinaryConfig.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

export const updateUserProfile = async (req, res) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.sendStatus(401); // Unauthorized if no auth header
    }

    try {
        const token = authHeader.replace("Bearer ", "");
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
            return res.sendStatus(401); // Unauthorized if token has expired
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { firstname, lastname, email, gender, dateOfBirth, country, phone } = req.body;
        let profilePictureUrl = null;

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'profile_pictures'
                });
                profilePictureUrl = result.secure_url;
            } catch (error) {
                return res.status(500).json({ message: 'Error uploading to Cloudinary', error });
            }
        }

        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.firstname = firstname || user.firstname;
            user.lastname = lastname || user.lastname;
            user.email = email || user.email;
            user.gender = gender || user.gender;
            user.dateOfBirth = dateOfBirth || user.dateOfBirth;
            user.country = country || user.country;
            user.phone = phone || user.phone;

            if (profilePictureUrl) {
                // If user already has a profile picture, delete the old one from Cloudinary
                if (user.profilePicture) {
                    const publicId = user.profilePicture.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                user.profilePicture = profilePictureUrl;
            }

            await user.save();

            res.json({
                message: 'User profile updated successfully',
                data: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    gender: user.gender,
                    dateOfBirth: user.dateOfBirth,
                    country: user.country,
                    phone: user.phone,
                    profilePicture: user.profilePicture
                }
            });
        } catch (error) {
            console.error("Error updating user profile:", error);
            res.status(500).json({ message: 'Server error', error });
        }
    } catch (error) {
        return res.sendStatus(403); // Forbidden if token verification failed
    }
};
