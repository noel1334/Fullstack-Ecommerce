import Product from '../models/Product.js';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Utility function to delete images from the uploads folder
const deleteImages = (imagePaths) => {
  imagePaths.forEach((imagePath) => {
    const fullPath = join(__dirname, '..', imagePath);
    // console.log(`Attempting to delete image at: ${fullPath}`);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Failed to delete image at ${fullPath}:`, err);
      } else {
        console.log(`Image deleted successfully: ${fullPath}`);
      }
    });
  });
};


// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subcategory, size, color, bestSeller } = req.body;

    // Parse size and color into arrays if they are strings
    const parsedSize = Array.isArray(size) ? size : size?.split(',').map(s => s.trim());
    const parsedColor = Array.isArray(color) ? color : color?.split(',').map(c => c.trim());

    // Ensure correct path format for images by replacing backslashes with forward slashes
    const images = req.files?.image 
      ? req.files.image.map(file => path.join('uploads', file.filename).replace(/\\/g, '/')) 
      : [];
    // console.log('Uploaded Images:', images);

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    if (subcategory && !mongoose.Types.ObjectId.isValid(subcategory)) {
      return res.status(400).json({ message: 'Invalid subcategory ID' });
    }

    const product = new Product({
      name,
      description,
      price,
      image: images,
      category,
      subcategory,
      size: parsedSize,
      color: parsedColor,
      bestSeller,
    });

    const savedProduct = await product.save();
    res.status(201).json({ message: 'Product created successfully', product: savedProduct });

  } catch (error) {
    console.error(`Error creating product: ${error.message}`);

    // Delete the uploaded images if product creation fails
    if (req.files?.image) {
      deleteImages(req.files.image.map(file => file.path.replace(/\\/g, '/')));
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category', 'name')
      .populate('subcategory', 'name');

    // Prepend server base URL to image paths
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const updatedProducts = products.map(product => ({
      ...product.toObject(),
      image: product.image.map(imgPath => `${baseUrl}/${imgPath}`)
    }));

    res.json(updatedProducts);
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(id)
      .populate('category', 'name')
      .populate('subcategory', 'name');

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (error) {
    console.error(`Error fetching product: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Parse size and color into arrays if they are strings
    if (updates.size) {
      updates.size = Array.isArray(updates.size) ? updates.size : updates.size.split(',').map(s => s.trim());
    }
    if (updates.color) {
      updates.color = Array.isArray(updates.color) ? updates.color : updates.color.split(',').map(c => c.trim());
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Fetch the existing product to compare images
    const existingProduct = await Product.findById(id);
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    // If new images are uploaded
    if (req.files?.image && req.files.image.length > 0) {
      // Get the list of newly uploaded images
      const newImages = req.files.image.map(file => path.join('uploads', file.filename).replace(/\\/g, '/'));

      // Check if new images are different from the existing images
      const imagesToDelete = existingProduct.image.filter(image => !newImages.includes(image));

      // If the images are different, delete the old ones
      if (imagesToDelete.length > 0) {
        deleteImages(imagesToDelete);
      }

      // Update the product's image field with the new images
      updates.image = newImages;
    }

    // Perform the product update
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error(`Error updating product: ${error.message}`);

    // If product update fails, delete the newly uploaded images (if any)
    if (req.files?.image) {
      deleteImages(req.files.image.map(file => file.path.replace(/\\/g, '/')));
    }

    res.status(500).json({ message: 'Server error' });
  }
};



// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    // Delete the images associated with the deleted product
    if (deletedProduct.image && Array.isArray(deletedProduct.image)) {
      deleteImages(deletedProduct.image);
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(`Error deleting product: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};