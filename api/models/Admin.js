import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "Admin" },
    password: { type: String, required: true },
    action_password: { type: String, required: true, default: "defaultPassword123" }, 
    resetPasswordToken: { type: String, default: null }, 
    resetPasswordExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
