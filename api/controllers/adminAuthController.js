import User from "../models/User.js";
import Admin from "../models/Admin.js";  
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict", 
};

// Helper function to generate JWT tokens
const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Register User
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await Admin.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters, include an uppercase letter, and a number.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
// Refresh Token
export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    const newAccessToken = generateToken({ id: user.id }, process.env.JWT_SECRET, "1h");

    res.cookie("authToken", newAccessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ message: "Access token refreshed" });
  });
};
// Login Admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateToken({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET, "2h");
    const refreshToken = generateToken({ id: admin._id }, process.env.JWT_REFRESH_SECRET, "7d");

    // Set cookies
    res.cookie("authToken", accessToken, { ...cookieOptions, maxAge: 2 * 60 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    // Include the authToken in the response body
    res.status(200).json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      authToken: accessToken, // Include the token here
    });
  } catch (error) {
    console.error(`Error logging in admin: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all Users and Admins
export const fetchAllUsersAndAdmins = async (req, res) => {
  try {
    // Fetch users and admins from the database
    const users = await User.find().select("-password"); 
    const admins = await Admin.find().select("-password"); 

    // Combine and send the response
    res.status(200).json({
      message: "Fetched all users and admins successfully.",
      users,
      admins,
    });
  } catch (error) {
    console.error(`Error fetching users and admins: ${error.message}`);
    res.status(500).json({ message: "Server error. Unable to fetch data." });
  }
};

export const updateAdmin = async (req, res) => {
  const { adminId } = req.params; 
  const { name, email, password } = req.body;  

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if email is being changed and if the new email already exists
    if (email && email !== admin.email) {
      const emailExists = await Admin.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // If password is provided, validate and hash it
    if (password) {
      if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters, include an uppercase letter, and a number.',
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    // Update other fields
    if (name) admin.name = name;
    if (email) admin.email = email;

    // Save updated admin
    await admin.save();

    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error(`Error updating admin: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
// delete users
export const deleteUser = async (req, res) => {
  const { userId } = req.params; // Get user ID from params

  try {
    const user = await User.findByIdAndDelete(userId); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// delete admin

export const deleteAdmin = async (req, res) => {
  const { adminId } = req.params; 

  try {
    const admin = await Admin.findByIdAndDelete(adminId); 
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(`Error deleting admin: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const actionPassword =  async (req, res) => {
  const { adminId, actionPassword } = req.body;
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found." });

    if (admin.action_password === actionPassword) {
      return res.status(200).json({ message: "Password verified." });
    } else {
      return res.status(403).json({ message: "Incorrect action password." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

export const adminForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "User not found with this email." });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpiry = resetTokenExpiry;

    // Save token and expiry (validateModifiedOnly skips validation for unmodified fields)
    await admin.save({ validateModifiedOnly: true });

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL2}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"My_store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Try again later." });
  }
};

export const adminGetResetPassword = async (req, res) => {
  const { token } = req.params;

  try {
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }, 
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    res.status(200).json({ message: "Valid reset token." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const AdminCreateResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Validate password
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters, include an uppercase letter, and a number.',
    });
  }

  try {
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update user password and clear token fields
    admin.password = hashedPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpiry = undefined;

    await admin.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

