import Recommended from "../models/recommendedModel.js";
import { cloudinary } from "../config/cloudinaryConfig.js";

const TARGET_FOLDER = "voyage/recommended";
export const getRecommended = async (req, res) => {
  try {
    const recommended = await Recommended.find();
    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRecommended = async (req, res) => {
  const { imageSrc, altText, title } = req.body;

  const newRecommended = new Recommended({
    imageSrc,
    altText,
    title,
  });

  try {
    const savedRecommended = await newRecommended.save();
    res.status(201).json(savedRecommended);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRecommended = async (req, res, next) => {
  const { id } = req.params;
  const { title, altText } = req.body;

  try {
    console.log("Received update request for recommended:", id);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const recommended = await Recommended.findById(id);

    if (!recommended) {
      return res.status(404).json({ message: "ไม่พบข้อมูลที่แนะนำ" });
    }

    // Update fields if provided
    if (title) recommended.title = title;
    if (altText) recommended.altText = altText;

    // Handle new image
    if (req.files && req.files.length > 0) {
      // Delete existing image from Cloudinary if it exists
      if (recommended.imageSrc) {
        const publicId =
          TARGET_FOLDER +
          "/" +
          recommended.imageSrc.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: TARGET_FOLDER, resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.files[0].buffer);
        });
        recommended.imageSrc = result.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    await recommended.save();

    res.json({ message: "Recommended updated successfully", recommended });
  } catch (error) {
    console.error("Error in updateRecommended:", error);
    next(error);
  }
};

export const deleteRecommended = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecommended = await Recommended.findByIdAndDelete(id);
    if (!deletedRecommended) {
      return res.status(404).json({ message: "Recommended not found" });
    }
    res.json({ message: "Recommended deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
