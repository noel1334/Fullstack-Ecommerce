import express from 'express';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categoryController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js'; 
import { adminOnlyMiddleware } from '../middleware/adminOnlyMiddleware.js';

const router = express.Router();

// Route to create category (Admin only, protected by auth and admin middlewares)
router.post('/create', adminMiddleware, adminOnlyMiddleware, createCategory);
router.put('/update/:id', adminMiddleware, adminOnlyMiddleware, updateCategory);
router.delete('/delete/:id', adminMiddleware, adminOnlyMiddleware, deleteCategory);

// Route to get all categories
router.get('/', getCategories);

export default router;
