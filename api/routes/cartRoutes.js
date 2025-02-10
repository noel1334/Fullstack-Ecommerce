import express from "express";


import { addCart, getCart, removeCartItem, updateCartQuantity } from "../controllers/cartController.js";
import { adminMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post('/add', adminMiddleware, addCart);
router.get('', adminMiddleware, getCart);
router.put("/update-quantity", adminMiddleware, updateCartQuantity)

export default router;
