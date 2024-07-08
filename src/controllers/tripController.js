import Trip from "../models/tripModel.js";
import { cloudinary } from "../config/cloudinaryConfig.js";

// Get all trips
const getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find();
    res.status(200).json({ message: "Get All Trips", trips: trips });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get trip by id
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById({ _id: req.params.id });
    res
      .status(200)
      .json({ message: "Successfully retrieved trip", trip: trip });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

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
      images,
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
      images,
    };
    // VALIDATE tripData done by mongoose
    const trip = await Trip.create(tripData);
    res.status(201).json({ message: "Created Trip", trip: trip });
  } catch (error) {
    next(error);
  }
};

// Update trip
const updateTrip = async (req, res) => {
  const { id } = req.params;

  try {
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "ไม่พบข้อมูลทริป" });
    }

    // อัปเดตเฉพาะฟิลด์ที่มีการส่งข้อมูลใหม่มาใน request
    trip.name = req.body.name || trip.name;
    trip.duration_days = req.body.duration_days || trip.duration_days;
    trip.destination_from = req.body.destination_from || trip.destination_from;
    trip.destination_to = req.body.destination_to || trip.destination_to;
    trip.rating = req.body.rating || trip.rating;
    trip.price = req.body.price || trip.price;
    trip.description = req.body.description || trip.description;
    trip.sub_expenses = req.body.sub_expenses || trip.sub_expenses;
    trip.images = req.body.images || trip.images;

    // บันทึกข้อมูล trip ที่อัปเดตแล้ว
    await trip.save();

    res.json({
      message: "Trip updated successfully",
      trip, // คุณสามารถส่งกลับ trip object ที่อัปเดตแล้วได้เลย
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params; // Get trip ID from request parameters

    // Find and delete the trip
    const deletedTrip = await Trip.findByIdAndDelete(id);

    if (!deletedTrip) {
      return res.status(404).json({ message: "ไม่พบข้อมูลทริป" });
    }

    // If the trip had an image, delete it from Cloudinary (if implemented)
    // if (deletedTrip.image) {
    //   const publicId = deletedTrip.image.split('/').pop().split('.')[0];
    //   await cloudinary.uploader.destroy(publicId);
    // }

    res.status(200).json({ message: "ลบข้อมูลทริปเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบข้อมูลทริป:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", error });
  }
};
export { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
