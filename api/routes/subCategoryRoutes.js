import express from 'express';

import { adminMiddleware } from '../middleware/authMiddleware.js'; 
import { createSubcategory, deleteSubcategory, getSubcategories, getSubcategoriesByCategoryId, updateSubcategory } from '../controllers/SubcategoryController.js';
import { adminOnlyMiddleware } from '../middleware/adminOnlyMiddleware.js';

const router = express.Router();

// Route to create category (Admin only, protected by auth and admin middlewares)
router.post('/create', adminMiddleware, adminOnlyMiddleware,createSubcategory);
router.put('/:id', adminMiddleware, adminOnlyMiddleware, updateSubcategory)
router.delete('/delete/:id', adminMiddleware, adminOnlyMiddleware, deleteSubcategory);

// Route to get all categories
router.get('/', getSubcategories, );
router.get("/:categoryId", getSubcategoriesByCategoryId);

export default router;
