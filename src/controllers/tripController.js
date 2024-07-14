import Trip from "../models/tripModel.js";
import { cloudinary } from "../config/cloudinaryConfig.js";
import multer from "multer";

const TARGET_FOLDER = "voyage/trips";

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all trips with pagination
const getAllTrips = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skipIndex = (page - 1) * limit;

    const totalTrips = await Trip.countDocuments();
    const totalPages = Math.ceil(totalTrips / limit);

    const trips = await Trip.find()
      .sort({ _id: -1 }) // เรียงลำดับจากใหม่ไปเก่า
      .limit(limit)
      .skip(skipIndex)
      .exec();

    res.status(200).json({
      message: "Get All Trips",
      trips: trips,
      currentPage: page,
      totalPages: totalPages,
      totalTrips: totalTrips,
    });
  } catch (error) {
    next(error);
  }
};

// Get trip by id
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "ไม่พบข้อมูลทริป" });
    }
    res
      .status(200)
      .json({ message: "Successfully retrieved trip", trip: trip });
  } catch (error) {
    next(error); // Use next() to pass the error to the error-handling middleware
  }
};

// Create trip
const createTrip = async (req, res, next) => {
  try {
    // Log request data for debugging
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const {
      name,
      duration_days,
      destination_from,
      destination_to,
      rating,
      price,
      description,
      sub_expenses,
    } = req.body;

    let cloudinaryImages = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        try {
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: TARGET_FOLDER, resource_type: "auto" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(file.buffer);
          });
          cloudinaryImages.push(result.secure_url);
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
        }
      }
    }

    const tripData = {
      name,
      duration_days,
      destination_from,
      destination_to,
      rating,
      price,
      description,
      sub_expenses,
      images: cloudinaryImages,
    };

    const trip = await Trip.create(tripData);
    res.status(201).json({ message: "Created Trip", trip: trip });
  } catch (error) {
    next(error); // Use next() to pass the error to the error-handling middleware
  }
};

// Update trip
const updateTrip = async (req, res, next) => {
  const { id } = req.params;

  try {
    console.log("Received update request for trip:", id);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "ไม่พบข้อมูลทริป" });
    }

    const {
      name,
      duration_days,
      destination_from,
      destination_to,
      rating,
      price,
      description,
      sub_expenses,
    } = req.body;

    // Update fields if provided
    if (name) trip.name = name;
    if (duration_days) trip.duration_days = duration_days;
    if (destination_from) trip.destination_from = destination_from;
    if (destination_to) trip.destination_to = destination_to;
    if (rating) trip.rating = rating;
    if (price) trip.price = price;
    if (description) trip.description = description;
    if (sub_expenses) trip.sub_expenses = sub_expenses;

    // Handle new images
    if (req.files && req.files.length > 0) {
      // Delete existing images from Cloudinary
      for (let imageUrl of trip.images) {
        const publicId =
          TARGET_FOLDER + "/" + imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new images
      let newCloudinaryImages = [];

      for (let file of req.files) {
        try {
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: TARGET_FOLDER, resource_type: "auto" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(file.buffer);
          });
          newCloudinaryImages.push(result.secure_url);
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
        }
      }

      // Replace old images with new images
      trip.images = newCloudinaryImages;
    }

    await trip.save();

    res.json({ message: "Trip updated successfully", trip });
  } catch (error) {
    console.error("Error in updateTrip:", error);
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTrip = await Trip.findByIdAndDelete(id);

    if (!deletedTrip) {
      return res.status(404).json({ message: "ไม่พบข้อมูลทริป" });
    }

    // Delete images from Cloudinary
    for (let imageUrl of deletedTrip.images) {
      const publicId =
        TARGET_FOLDER + "/" + imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({ message: "ลบข้อมูลทริปเรียบร้อยแล้ว" });
  } catch (error) {
    next(error); // Use next() to pass the error to the error-handling middleware
  }
};

const getTripsByName = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res
        .status(400)
        .json({ message: "กรุณาระบุชื่อทริปที่ต้องการค้นหา" });
    }

    // ใช้ regular expression เพื่อค้นหาชื่อทริปที่มีคำที่ต้องการ (case-insensitive)
    const trips = await Trip.find({ name: { $regex: name, $options: "i" } });

    if (trips.length === 0) {
      return res.status(404).json({ message: "ไม่พบทริปที่ตรงกับคำค้นหา" });
    }

    res.status(200).json({ message: "ค้นหาทริปสำเร็จ", trips: trips });
  } catch (error) {
    next(error);
  }
};

export {
  getAllTrips,
  getTripById,
  getTripsByName,
  createTrip,
  updateTrip,
  deleteTrip,
  upload,
};
