import User from "../models/userModel.js";
import { cloudinary } from "../config/cloudinaryConfig.js";

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, gender, dateOfBirth, country, phone } =
    req.body;

  let profilePictureUrl = null;

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
      });
      profilePictureUrl = result.secure_url;
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error uploading to Cloudinary", error });
    }
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    user.country = country || user.country;
    user.phone = phone || user.phone;

    // อัพเดท dateOfBirth โดยตรง (yyyy-mm-dd)
    if (dateOfBirth) {
      user.dateOfBirth = new Date(dateOfBirth);
    }

    if (profilePictureUrl) {
      // ลบรูปโปรไฟล์เก่าออกจาก Cloudinary (ถ้ามี)
      if (user.profilePicture) {
        const publicId = user.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      user.profilePicture = profilePictureUrl;
    }

    await user.save();

    // แปลง dateOfBirth เป็น string ในรูปแบบ yyyy-mm-dd
    const formattedDateOfBirth = user.dateOfBirth
      ? user.dateOfBirth.toISOString().slice(0, 10)
      : null;

    res.json({
      message: "User profile updated successfully",
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        gender: user.gender,
        dateOfBirth: formattedDateOfBirth, // ส่งกลับเฉพาะส่วนวันที่
        country: user.country,
        phone: user.phone,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
