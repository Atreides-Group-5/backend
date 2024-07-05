import Trip from '../models/tripModel.js';

// Get all trips
const getAllTrips = async (req, res, next) => {
    try {
        const trips = await Trip.find();
        res.status(200).json({ message: 'Get All Trips', trips: trips });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getTripById = async (req, res, next) => {
    try {
        const trip = await Trip.findById({ _id: req.params.id });
        res.status(200).json({ message: 'Successfully retrieved trip', trip: trip });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

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

export { getAllTrips, getTripById, createTrip };