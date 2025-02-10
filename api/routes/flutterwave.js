import express from "express";
import { handleWebhook, initializePayment } from "../controllers/flutterwaveController.js";

const router = express.Router();

// Payment initialization route
router.post("/initialize", initializePayment);
router.post("/webhook", handleWebhook);

export default router;
