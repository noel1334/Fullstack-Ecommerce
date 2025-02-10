import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js"; // Admin model
import User from "../models/User.js"; // User model

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.authToken;
  if (!token) {
    console.error("Token not found in cookies");
    return res.status(401).json({ message: "Authentication failed. Token not provided." });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 

    // Check if the user exists in the User model
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    next();
  } catch (err) {
    console.error("JWT verification error:", err.message); 
    return res.status(403).json({ message: "Token is invalid or expired." });
  }
};


const adminMiddleware = async (req, res, next) => {
  const token = req.cookies?.authToken;
  if (!token) {
    console.error("Token not found in cookies");
    return res.status(401).json({ message: "Authentication failed. Token not provided." });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if the user exists in the Admin model
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found." });
    }

    // Continue to next middleware or route handler
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message); 
    return res.status(403).json({ message: "Token is invalid or expired." });
  }
};


export { authMiddleware, adminMiddleware };
