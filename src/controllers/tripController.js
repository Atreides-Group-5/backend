import Trip from '../models/tripModel.js';
import { cloudinary } from '../config/cloudinaryConfig.js';

// Get all trips
const getAllTrips = async (req, res, next) => {
    try {
        const trips = await Trip.find();
        res.status(200).json({ message: 'Get All Trips', trips: trips });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Get trip by id
const getTripById = async (req, res, next) => {
    try {
        const trip = await Trip.findById({ _id: req.params.id });
        res.status(200).json({ message: 'Successfully retrieved trip', trip: trip });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// Create trip
const createTrip = async (req, res, next) => {
    try {
        const {
            name,
            duration_days,
            destination_from,
            destination_to,
            rating,
            price,
            description,
            sub_expenses,
            images
        } = req.body;
        const tripData = {
            name,
            duration_days,
            destination_from,
            destination_to,
            rating,
            price,
            description,
            sub_expenses,
            images
        };
        // VALIDATE tripData done by mongoose
        const trip = await Trip.create(tripData);
        res.status(201).json({ message: 'Created Trip', trip: trip });
    } catch (error) {
        next(error);
    }
}

// Update trip
const updateTrip = async (req, res) => {
    const { id } = req.params;
    const { name, duration_days, destination_from, destination_to, rating, price, description, sub_expenses, images } = req.body;
    // let profilePictureUrl = null;

    // if (req.file) {
    //     try {
    //         const result = await cloudinary.uploader.upload(req.file.path, {
    //             folder: 'profile_pictures'
    //         });
    //         profilePictureUrl = result.secure_url;
    //     } catch (error) {
    //         return res.status(500).json({ message: 'Error uploading to Cloudinary', error });
    //     }
    // }

    try {
        let trip = await Trip.findById(id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        trip.name = name || trip.name;
        trip.duration_days = duration_days || trip.duration_days;
        trip.destination_from = destination_from || trip.destination_from;
        trip.destination_to = destination_to || trip.destination_to;
        trip.rating = rating || trip.rating;
        trip.price = price || trip.price;
        trip.description = description || trip.description;
        trip.sub_expenses = sub_expenses || trip.sub_expenses;
        trip.images = images || trip.images;

        // if (profilePictureUrl) {
        //     // If trip already has a profile picture, delete the old one from Cloudinary
        //     if (trip.image) {
        //         const publicId = trip.image.split('/').pop().split('.')[0];
        //         await cloudinary.uploader.destroy(publicId);
        //     }
        //     trip.image = profilePictureUrl;
        // }

        res.json({
            message: 'Trip updated successfully',
            trip: {
                id: trip._id,
                name: trip.name,
                duration_days: trip.duration_days,
                destination_from: trip.destination_from,
                destination_to: trip.destination_to,
                rating: trip.rating,
                price: trip.price,
                description: trip.description,
                sub_expenses: trip.sub_expenses,
                images: trip.images
            }
        });
    } catch (error) {
        console.error("Error updating trip:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export { getAllTrips, getTripById, createTrip, updateTrip };