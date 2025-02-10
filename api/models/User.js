import mongoose from "mongoose";
import cartItemSchema from "./CartItem.js";

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    lga: { type: String, required: true },
  },
  { _id: false } // Prevents MongoDB from automatically creating an _id field for subdocuments
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "User" },
    cart: { type: [cartItemSchema], default: [] },
    addresses: { type: addressSchema, default: null },
    resetPasswordToken: { type: String, default: null }, // Token for password reset
    resetPasswordExpiry: { type: Date, default: null },  // Token expiry time
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
