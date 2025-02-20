import Product from '../models/Product.js';
import mongoose from 'mongoose';
import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';
import path from 'path'; // Import the 'path' module

const imgbbApiKey = process.env.IMGBB_API_KEY;

// Multer configuration that uses memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Utility function to upload an image to ImgBB from a buffer
const uploadImageToImgBBFromBuffer = async (fileBuffer, originalFilename) => {
    try {
        // Extract the file extension from the original filename
        const fileExtension = path.extname(originalFilename);
        const filenameForUpload = `image${fileExtension}`;

        const formData = new FormData();
        formData.append('image', fileBuffer, { filename: filenameForUpload }); 

        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
            }
        );

        if (response.data && response.data.success) {
            return response.data.data.url;
        } else {
            console.error('ImgBB upload failed:', response.data);
            throw new Error('ImgBB upload failed');
        }
    } catch (error) {
        console.error('Error uploading to ImgBB:', error);
        throw error;
    }
};

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory, size, color, bestSeller } = req.body;

        const parsedSize = Array.isArray(size) ? size : size?.split(',').map(s => s.trim());
        const parsedColor = Array.isArray(color) ? color : color?.split(',').map(c => c.trim());

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        if (subcategory && !mongoose.Types.ObjectId.isValid(subcategory)) {
            return res.status(400).json({ message: 'Invalid subcategory ID' });
        }

        const imageFiles = req.files?.image || [];
        const imageUrls = [];

        // Process all uploaded images
        for (const imageFile of imageFiles) {
            try {
                // Upload from buffer - Pass original filename
                const imageUrl = await uploadImageToImgBBFromBuffer(imageFile.buffer, imageFile.originalname);
                imageUrls.push(imageUrl);

            } catch (uploadError) {
                console.error('Failed to upload one of the images:', uploadError);
                return res.status(500).json({ message: 'Failed to upload one or more images' });
            }
        }

        const product = new Product({
            name,
            description,
            price,
            image: imageUrls,
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
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('category', 'name')
            .populate('subcategory', 'name');

        res.json(products);
    } catch (error) {
        console.error(`Error fetching products: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

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
            updates.size = Array.isArray(updates.size) ? updates.size : updates.size?.split(',').map(s => s.trim());
        }
        if (updates.color) {
            updates.color = Array.isArray(updates.color) ? updates.color : updates.color?.split(',').map(c => c.trim());
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const existingProduct = await Product.findById(id);
        if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

        const imageFiles = req.files?.image || [];
        const imageUrls = [];

        // Process all uploaded images
        for (const imageFile of imageFiles) {
            try {
                const imageUrl = await uploadImageToImgBBFromBuffer(imageFile.buffer, imageFile.originalname);
                imageUrls.push(imageUrl);

            } catch (uploadError) {
                console.error('Failed to upload one of the images:', uploadError);
                return res.status(500).json({ message: 'Failed to upload one or more images' });
            }
        }

        if (imageUrls.length > 0) {
            updates.image = imageUrls;
        }

        const parsedSize = Array.isArray(updates.size) ? updates.size : updates.size?.split(',').map(s => s.trim());
        const parsedColor = Array.isArray(updates.color) ? updates.color : updates.color?.split(',').map(c => c.trim());

        updates.size = parsedSize
        updates.color = parsedColor

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error(`Error updating product: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(`Error deleting product: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};