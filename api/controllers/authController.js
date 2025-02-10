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

// Validate token (returns decoded info if valid)
export const validateToken = (req, res) => {
  res.status(200).json({
    message: "Token is valid.",
    user: req.user,  // The user information added by the middleware
  });
};



export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters, include an uppercase letter, and a number.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateToken({ id: user._id, isAdmin: false }, process.env.JWT_SECRET, "2h");
    const refreshToken = generateToken({ id: user._id }, process.env.JWT_REFRESH_SECRET, "7d");

    // Set cookies
    res.cookie("authToken", accessToken, { ...cookieOptions, maxAge: 2 * 60 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    // Include the authToken in the response body
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      address: user.addresses,
      authToken: accessToken, 
    });
  } catch (error) {
    console.error(`Error logging in: ${error.message}`);
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

// Logout User
export const logout = (req, res) => {
  res.clearCookie("authToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
};
// update  user
export const updateUser = async (req, res) => {
  const { userId } = req.params; 
  const { name, email, password, role } = req.body;  

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if the new email already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
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
      user.password = hashedPassword;
    }

    // Update other fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    // Save updated user
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const saveAddress = async (req, res) => {
  const { userId, address } = req.body; 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Set the new address to the user (overwriting any existing address)
    user.addresses = address; // Save the single address

    await user.save();
    res.status(200).json({ message: "Address saved successfully.", address: user.addresses });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Error saving address.", error });
  }
};

export  const getUserAddress = async (req, res) => {
  try {
    const { userId } = req.params; 

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send the address in the response
    return res.status(200).json({ address: user });
  } catch (error) {
    console.error("Error fetching user address:", error);
    return res.status(500).json({ message: 'Error fetching user address', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email." });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;

    // Save token and expiry (validateModifiedOnly skips validation for unmodified fields)
    await user.save({ validateModifiedOnly: true });

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

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

export const getResetPassword = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    res.status(200).json({ message: "Valid reset token." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const createResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Validate password
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters, include an uppercase letter, and a number.',
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }, // Ensure the token is still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

