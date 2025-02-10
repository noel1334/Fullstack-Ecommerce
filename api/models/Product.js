
import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: [{ type: String }], // Array of image URLs
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: false },
  size: [{ type: String }], // Array of sizes, e.g., ["S", "M", "L"]
  color: [{ type: String }], // Array of colors, e.g., ["Red", "Blue"]
  bestSeller: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
