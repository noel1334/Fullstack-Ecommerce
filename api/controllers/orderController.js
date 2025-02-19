// orderController.js
import axios from "axios";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Stripe from "stripe";
import { sendNotification } from "./notificationService.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const generateReference = () => {
    const now = new Date();
    return `MY-STORE-${now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
};

export const createStripeSession = async (req, res) => {
    try {
        const { amount, email, name, orderDetails } = req.body;

        if (!amount || !email || !name || !orderDetails) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        if (amount < 375) {
            return res.status(400).json({
                message: "Amount must be at least 375 NGN to meet Stripe's minimum.",
            });
        }

        const orderReference = generateReference();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "ngn",
                        product_data: { name: "Order Payment" },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            customer_email: email,
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel?reference=${orderReference}`,
            metadata: {
                orderReference,
            },
        });

        const tempOrder = new Order({
            reference: orderReference,
            userId: orderDetails.userId,
            cartItems: orderDetails.cartItems,
            shippingDetails: orderDetails.shippingDetails,
            totalAmount: amount,
            paymentMethod: "stripe",
            paymentStatus: "pending",
            transactionId: session.id,
        });

        await tempOrder.save();

        return res.status(201).json({ sessionId: session.id });
    } catch (error) {
        console.error("Error creating Stripe session:", error.message || error);
        return res.status(500).json({
            message: "An error occurred while creating the payment session.",
            error: error.message || error,
        });
    }
};

export const completeOrder = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            console.error("Session ID is missing.");
            return res.status(400).json({ message: "Session ID is required." });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            console.error("Stripe session not found.");
            return res.status(404).json({ message: "Stripe session not found." });
        }

        if (session.payment_status !== "paid") {
            const orderReference = session.metadata.orderReference;

            console.error("Payment not completed. Order reference:", orderReference);
            return res.status(400).json({
                message: "Payment not completed.",
                order: { reference: orderReference },
            });
        }

        const orderReference = session.metadata.orderReference;
        const transactionId = session.payment_intent;

        const tempOrder = await Order.findOne({ reference: orderReference });

        if (!tempOrder) {
            console.error("Order not found in database.");
            return res.status(404).json({ message: "Order not found." });
        }

        tempOrder.paymentStatus = "success";
        tempOrder.transactionId = transactionId;

        try {
            await tempOrder.save();
            console.log("Order updated successfully:", tempOrder);

            // Send Notification for Stripe Orders
            sendNotification({
                type: "new_order",
                message: `New Stripe order received! Order ID: ${tempOrder._id}`,
                orderId: tempOrder._id.toString(), // Ensure it's a string
            });

            return res.status(200).json({
                message: "Order completed successfully.",
                order: tempOrder,
            });
        } catch (saveError) {
            console.error("Error saving order:", saveError.message || saveError);

            try {
                await Order.deleteOne({ reference: orderReference });
                console.log("Order deleted successfully after save failure.");
                return res.status(500).json({
                    message: "Order validation failed. Order has been deleted.",
                    error: saveError.message || saveError,
                });
            } catch (deleteError) {
                console.error("Error deleting order:", deleteError.message || deleteError);
                return res.status(500).json({
                    message: "Order validation failed, and deletion failed.",
                    error: deleteError.message || deleteError,
                });
            }
        }
    } catch (error) {
        console.error("Error completing order:", error.message || error);
        return res.status(500).json({
            message: "An error occurred while completing the order.",
            error: error.message || error,
        });
    }
};

export const deleteUnCompleteTransaction = async (req, res) => {
    const { reference } = req.params;

    try {
        const deletedOrder = await Order.deleteOne({ reference });
        if (deletedOrder.deletedCount === 0) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json({ message: "Order deleted." });
    } catch (error) {
        console.error("Error deleting order:", error.message || error);
        res.status(500).json({ message: "Error deleting order.", error: error.message });
    }
};

export const verifyMonnifyPaymentAndCreateOrder = async (req, res) => {
    const { reference, orderDetails } = req.body;

    if (!reference || !orderDetails) {
        return res.status(400).json({
            message: "Transaction reference and order details are required.",
        });
    }

    try {
        console.log("Verification Start:", { reference, orderDetails });

        const authHeader = `Basic ${Buffer.from(
            `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`
        ).toString("base64")}`;
        const url = `https://sandbox.monnify.com/api/v1/merchant/transactions/query?transactionReference=${encodeURIComponent(reference)}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: authHeader,
            },
        });

        const { data } = response;

        if (
            (data.responseCode === "00" || data.responseCode === "0") &&
            data.responseBody.paymentStatus === "PAID" &&
            parseFloat(data.responseBody.amountPaid) === parseFloat(orderDetails.totalAmount)
        ) {
            try {
                const newOrder = new Order({
                    ...orderDetails,
                    paymentStatus: "success",
                    transactionId: reference,
                    reference: generateReference(),
                });

                const savedOrder = await newOrder.save();
                // Send Notification for Monnify Orders
                sendNotification({
                    type: "new_order",
                    message: `New Monnify order received! Order ID: ${savedOrder._id}`,
                    orderId: savedOrder._id.toString(), // Ensure it's a string
                });
                return res.status(201).json({
                    message: "Order created successfully.",
                    order: savedOrder,
                });
            } catch (dbError) {
                console.error("Error saving order:", dbError);
                return res.status(500).json({ message: "Database error.", error: dbError });
            }
        } else {
            return res.status(400).json({
                message: "Payment verification failed.",
                details: data.responseBody,
            });
        }
    } catch (error) {
        console.error("Error during payment verification:", error.response?.data || error.message);
        return res.status(500).json({
            message: "An error occurred during payment verification.",
            error: error.message || error,
        });
    }
};

export const verifyFlutterwavePaymentAndCreateOrder = async (req, res) => {
    const { transactionId, tx_ref, orderDetails } = req.body;

    if (!transactionId || !tx_ref || !orderDetails) {
        console.error("Missing required fields:", { transactionId, tx_ref, orderDetails });
        return res.status(400).json({ message: "Transaction ID, tx_ref, and order details are required." });
    }

    try {
        const response = await axios.get(
            `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
            {
                headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
            }
        );

        const { data } = response;

        if (
            data.status === "success" &&
            data.data.tx_ref === tx_ref &&
            data.data.amount === orderDetails.totalAmount &&
            data.data.currency === "NGN"
        ) {
            const newOrder = new Order({
                ...orderDetails,
                paymentStatus: "success",
                transactionId: data.data.id,
                reference: generateReference(),
            });

            const savedOrder = await newOrder.save();
            // Send Notification for Flutterwave Orders
            sendNotification({
                type: "new_order",
                message: `New Flutterwave order received! Order ID: ${savedOrder._id}`,
                orderId: savedOrder._id.toString(), // Ensure it's a string
            });

            return res.status(201).json({
                message: "Order created successfully.",
                order: savedOrder,
            });
        } else {
            console.error("Payment verification failed. Mismatched details:", {
                expected: { tx_ref, amount: orderDetails.totalAmount, currency: "NGN" },
                received: { tx_ref: data.data.tx_ref, amount: data.data.amount, currency: data.data.currency },
            });

            return res.status(400).json({
                message: "Payment verification failed. Mismatched details.",
                data,
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error.response?.data || error.message);
        return res.status(500).json({
            message: "An error occurred during payment verification.",
            error: error.message || error,
        });
    }
};

export const verifyPaymentAndCreateOrder = async (req, res) => {
    const { reference, orderDetails } = req.body;

    if (!reference || !orderDetails) {
        return res
            .status(400)
            .json({ message: "Payment reference and order details are required." });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
        return res.status(500).json({ message: "Paystack API key is missing." });
    }

    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const { status, data } = response;

        if (status === 200 && data.data.status === "success") {
            const newOrder = new Order({
                ...orderDetails,
                paymentStatus: "success",
                transactionId: data.data.reference,
                reference: generateReference(),
            });

            const savedOrder = await newOrder.save();
            // Send Notification for Paystack Orders
            sendNotification({
                type: "new_order",
                message: `New Paystack order received! Order ID: ${savedOrder._id}`,
                orderId: savedOrder._id.toString(), // Ensure it's a string
            });

            return res.status(201).json({
                message: "Order created successfully after payment verification.",
                order: savedOrder,
            });
        } else {
            console.error("Payment verification failed:", data);
            return res.status(400).json({ message: "Payment verification failed.", data });
        }
    } catch (error) {
        console.error("Error verifying payment and creating order:", error.message);
        return res.status(500).json({
            message: "An error occurred during payment verification and order creation.",
            error: error.response?.data || error.message,
        });
    }
};

export const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        if (!orders) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error("Error fetching order:", error.message);
        res.status(500).json({ message: "Failed to fetch order details", error: error.message });
    }
};

export const updateOrderStatusAndShippingStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, shippingStatus } = req.body;

        if (!orderStatus && !shippingStatus) {
            return res.status(400).json({ message: "Order or shipping status is required." });
        }

        const validOrderStatuses = [
            "Pending",
            "Processed",
            "Packing",
            "Shipped",
            "Progress",
            "Delivered",
            "Canceled",
        ];
        if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status provided." });
        }

        const validShippingStatuses = [
            "Processing",
            "Shipped",
            "In_Transit",
            "Out_For_Delivery",
            "Delivered",
            "Failed",
        ];
        if (shippingStatus && !validShippingStatuses.includes(shippingStatus)) {
            return res.status(400).json({ message: "Invalid shipping status provided." });
        }

        let updatedOrderStatus = orderStatus;
        const updates = {};
        const currentDate = new Date();

        if (shippingStatus) {
            switch (shippingStatus) {
                case "Processing":
                    updatedOrderStatus = "Processed";
                    updates.deliveryDate = new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000);
                    break;
                case "Shipped":
                    updatedOrderStatus = "Packing";
                    updates.deliveryDate = new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000);
                    break;
                case "In_Transit":
                    updatedOrderStatus = "Shipped";
                    updates.deliveryDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);
                    break;
                case "Out_For_Delivery":
                    updatedOrderStatus = "Progress";
                    updates.deliveryDate = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
                    break;
                case "Delivered":
                    updatedOrderStatus = "Delivered";
                    updates.deliveryDate = currentDate;
                    break;
                case "Failed":
                    updatedOrderStatus = "Canceled";
                    updates.deliveryDate = null;
                    break;
            }
        }

        if (shippingStatus) updates.shippingStatus = shippingStatus;
        if (updatedOrderStatus) updates.status = updatedOrderStatus;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.status(200).json({
            success: true,
            message: "Order and shipping status updated successfully.",
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Error updating order and shipping status:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update order and shipping status.",
            error: error.message,
        });
    }
};

export const updateAcceptedOrder = async (req, res) => {
    const { id } = req.params;
    const { acceptedOrder } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { acceptedOrder },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Send Notification for accept Orders
        sendNotification({
            type: "accept_order",
            message: ` Order Accepted! Order ID: ${order._id}`,
            orderId: order._id.toString(), 
        });

        res.status(200).json({ message: "Order accepted successfully.", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update order.", error });
    }
};

export const updateRejectedOrder = async (req, res) => {
    const { id } = req.params;
    const { rejectionReason, acceptedOrder, paymentEmail, rejectionPaymentMethod, rejectionDetails } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            {
                acceptedOrder,
                rejectionReason,
                paymentEmail,
                rejectionPaymentMethod,
                rejectionDetails: rejectionDetails || null,
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        // Send Notification for reject Orders
        sendNotification({
            type: "reject_order",
            message: ` Order Rejected! Order ID: ${order._id}`,
            orderId: order._id.toString(), // Ensure it's a string
        });

        res.status(200).json({ message: "Order rejected successfully.", order });
    } catch (error) {
        console.error("Error rejecting order:", error);
        res.status(500).json({ message: "Failed to reject order.", error });
    }
};

export const updateCancelOrder = async (req, res) => {
    const { id } = req.params;
    const { cancelOrder, cancellationReason, cancellationEmail, cancellationPaymentMethod, cancellationDetails } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            {
                cancelOrder,
                cancellationReason,
                cancellationEmail,
                cancellationPaymentMethod,
                cancellationDetails: cancellationDetails || null,
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        // Send Notification for cancel Orders
        sendNotification({
            type: "cancel_order",
            message: ` Order Canceled! Order ID: ${order._id}`,
            orderId: order._id.toString(), // Ensure it's a string
        });

        res.status(200).json({ message: "Order canceled successfully.", order });
    } catch (error) {
        console.error("Error canceling order:", error);
        res.status(500).json({ message: "Failed to cancel order.", error });
    }
};