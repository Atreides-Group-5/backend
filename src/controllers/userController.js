import User from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  // console.log("MY LOG:", req.body);
  const { firstname, lastname, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      isAdmin: false, // เพิ่ม isAdmin และตั้งค่าเริ่มต้นเป็น false
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
        phone: user.phone,
        profilePicture: user.profilePicture,
        gender: user.gender,
        isAdmin: user.isAdmin, // เพิ่ม isAdmin ใน token
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude the password field from the response for security
    const { password, ...userData } = user.toObject();

    // Send the user data
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
