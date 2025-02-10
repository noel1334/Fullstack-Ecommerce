import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js"; // Admin model
import User from "../models/User.js"; // User model

dotenv.config();

const adminMiddleware = async (req, res, next) => {
  const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication failed. Token not provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.user.isAdmin) {
      const admin = await Admin.findById(req.user.id);
      if (!admin) {
        return res.status(404).json({ message: "Admin user not found." });
      }
    } else {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
    }

    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is invalid or expired." });
  }
};


export { adminMiddleware };
