import express from "express";
import { adminMiddleware } from "../middleware/authMiddleware.js";
import { getOrdersByUser, getAllOrders, verifyPaymentAndCreateOrder, getOrderById, updateOrderStatusAndShippingStatus, updateAcceptedOrder, updateRejectedOrder, updateCancelOrder, verifyFlutterwavePaymentAndCreateOrder, verifyMonnifyPaymentAndCreateOrder, createStripeSession, completeOrder, deleteUnCompleteTransaction } from "../controllers/orderController.js";
import { adminOnlyMiddleware } from "../middleware/adminOnlyMiddleware.js";

const router = express.Router();
router.post("/verifyPaymentAndCreateOrder", adminMiddleware, verifyPaymentAndCreateOrder);
router.get("", adminMiddleware, adminOnlyMiddleware, getAllOrders);
router.get("/:orderId", adminMiddleware, getOrderById);
router.patch("/:orderId/status", adminMiddleware, adminOnlyMiddleware, updateOrderStatusAndShippingStatus);
router.get("/user/:userId", adminMiddleware, getOrdersByUser);
router.patch("/:id/accept", adminMiddleware, updateAcceptedOrder);
router.patch("/:id/reject", adminMiddleware, updateRejectedOrder);
router.patch("/:id/cancel", adminMiddleware, updateCancelOrder);
router.post("/verifyFlutterwavePaymentAndCreateOrder", adminMiddleware, verifyFlutterwavePaymentAndCreateOrder);
router.post("/verifyMonnifyPaymentAndCreateOrder", adminMiddleware, verifyMonnifyPaymentAndCreateOrder);
router.post("/createStripeSession", adminMiddleware, createStripeSession);
router.post("/completeOrder", adminMiddleware, completeOrder);
router.delete("/delete/:reference", deleteUnCompleteTransaction);


export default router;
