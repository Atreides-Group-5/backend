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
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "ไม่พบข้อมูลทริป" });
    }

    // Update fields
    trip.name = req.body.name || trip.name;
    trip.duration_days = req.body.duration_days || trip.duration_days;
    trip.destination_from = req.body.destination_from || trip.destination_from;
    trip.destination_to = req.body.destination_to || trip.destination_to;
    trip.rating = req.body.rating || trip.rating;
    trip.price = req.body.price || trip.price;
    trip.description = req.body.description || trip.description;
    trip.sub_expenses = req.body.sub_expenses || trip.sub_expenses;

    // Handle image updates
    if (req.body.images && req.body.images.length > 0) {
      // Delete existing images from Cloudinary
      for (let imageUrl of trip.images) {
        const publicId =
          TARGET_FOLDER + "/" + imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new images
      let cloudinaryImages = [];
      for (let image of req.body.images) {
        try {
          const result = await cloudinary.uploader.upload(image, {
            folder: TARGET_FOLDER,
            resource_type: "auto",
          });
          cloudinaryImages.push(result.secure_url);
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
        }
      }
      trip.images = cloudinaryImages;
    }

    await trip.save();

    res.json({ message: "Trip updated successfully", trip });
  } catch (error) {
    next(error); // Use next() to pass the error to the error-handling middleware
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
