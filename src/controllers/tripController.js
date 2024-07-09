import Trip from "../models/tripModel.js";
import { cloudinary } from "../config/cloudinaryConfig.js";
import multer from "multer";

const TARGET_FOLDER = "voyage/trips";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get all trips
const getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find();
    res.status(200).json({ message: "Get All Trips", trips: trips });
  } catch (error) {
    next(error); // Use next() to pass the error to the error-handling middleware
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
          const result = await cloudinary.uploader.upload(file.path, {
            folder: TARGET_FOLDER,
            resource_type: "auto",
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
      let newCloudinaryImages = [];

      for (let file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: TARGET_FOLDER,
            resource_type: "auto",
          });
          newCloudinaryImages.push(result.secure_url);
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
        }
      }

      // Combine existing images with new images
      trip.images = [...trip.images, ...newCloudinaryImages];
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

export { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip, upload };
