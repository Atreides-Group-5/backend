import Trip from '../models/tripModel.js';

// Get all trips
const getAllTrips = async (req, res, next) => {
    try {
        const trips = await Trip.find();
        res.status(200).json({ message: 'Get All Movies', trips: trips });
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

export { getAllTrips, getTripById };