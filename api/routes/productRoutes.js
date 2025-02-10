import express from 'express';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/productController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { adminOnlyMiddleware } from '../middleware/adminOnlyMiddleware.js';

const router = express.Router();

// Route to create a product with image upload
router.post('/create', 
    adminMiddleware, 
    adminOnlyMiddleware,
    upload,
    createProduct
);

// Route to update a product with image upload
router.put('/update/:id', 
    adminMiddleware, 
    adminOnlyMiddleware, 
    upload,  
    updateProduct
);

// Route to delete a product by ID
router.delete('/delete/:id',  
    adminMiddleware,
    adminOnlyMiddleware, 
    deleteProduct
);

// Route to get all products
router.get('/', getProducts);

export default router;
