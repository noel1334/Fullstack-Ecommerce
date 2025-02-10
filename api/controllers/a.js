import axios from "axios";
import dotenv from "dotenv";
import Order from "../models/Order.js";
dotenv.config();


export const saveOrder = async (req, res) => {
  try {
    const { userId, shippingDetails, cartItems, totalAmount, paymentMethod } = req.body;

    // Generate the unique reference
    const now = new Date();
    const reference = `MY-STORE-${now
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14)}`; 

    const newOrder = new Order({
      userId,
      shippingDetails,
      cartItems,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      reference, 
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order saved successfully", order: savedOrder });
  } catch (error) {
    console.error("Error saving order:", error.message);
    res.status(500).json({ message: "Failed to save order", error: error.message });
  }
};

export const verifyPaymentAndUpdateOrder = async (req, res) => {
    const { reference, orderId } = req.body;
  
    if (!reference || !orderId) {
      return res.status(400).json({ message: "Reference and Order ID are required." });
    }
  
    try {
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      });
  
      const { status, data } = response;
  
      if (status === 200 && data.data.status === "success") {
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            paymentStatus: "success",
            transactionId: data.data.reference,
          },
          { new: true }
        );
  
        if (!updatedOrder) {
          return res.status(404).json({ message: "Order not found." });
        }
  
        return res.status(200).json({
          message: "Payment verified and order updated successfully.",
          order: updatedOrder,
        });
      } else {
        console.error("Payment verification failed:", data);
        return res.status(400).json({ message: "Payment verification failed.", data });
      }
    } catch (error) {
      console.error("Error verifying payment:", error.message);
      return res.status(500).json({
        message: "An error occurred during payment verification.",
        error: error.response?.data || error.message,
      });
    }
  };