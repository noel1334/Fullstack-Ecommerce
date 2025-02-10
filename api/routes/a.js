import express from "express";
import { adminMiddleware } from "../middleware/authMiddleware.js";
import { saveOrder,  verifyPaymentAndCreateOrder,  verifyPaymentAndUpdateOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/save", adminMiddleware, saveOrder );
router.post("/verifyPaymentAndUpdateOrder", adminMiddleware, verifyPaymentAndUpdateOrder);
router.post("/verifyPaymentAndCreateOrder", adminMiddleware, verifyPaymentAndCreateOrder);


export default router;
