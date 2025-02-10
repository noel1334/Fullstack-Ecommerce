import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Product ID
    selectedColor: { type: String, required: true },
    selectedSize: { type: String, required: true },
    selectedImage: { type: String, required: true },
    price: {type: Number, required: true}, 
    quantity: { type: Number, required: true },
  },
  { _id: false } // Prevent auto-generating `_id` for each cart item
);

export default cartItemSchema;
