import Trip from '../models/tripModel.js';

// Get all trips
const getAllTrips = async (req, res, next) => {
    try {
        const trips = await Trip.find();
        res.status(200).json({ message: 'Get All Movies', trips: trips });
    } catch (error) {
        const trips = await Trip.find();
        res.status(404).json({ message: error.message });
    }
}

export { getAllTrips };