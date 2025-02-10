import axios from "axios";  // Use axios instead of http
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const FLW_BASE_URL = "https://api.flutterwave.com/v3";  // Ensure this is the correct URL

export const initializePayment = async (req, res) => {
  try {
    const { amount, currency, email, phoneNumber } = req.body;

    const paymentData = {
      tx_ref: `tx-${Date.now()}`,
      amount,
      currency,
      redirect_url: "http://localhost:3001/payment-success",
      customer: {
        email,
        phonenumber: phoneNumber,
      },
      payment_options: "card",
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FLW_SECRET_KEY}`,
    };

    const response = await axios.post(`${FLW_BASE_URL}/payments`, paymentData, { headers });

    if (response.data.status === "success") {
      res.status(200).json({ link: response.data.data.link });
    } else {
      console.error("Flutterwave error:", response.data);
      res.status(400).json({ error: "Payment initialization failed", details: response.data });
    }
  } catch (error) {
    console.error("Error initializing payment:", error);
    res.status(500).json({ error: "Payment server error" });
  }
};

export const handleWebhook = (req, res) => {
  const secretHash = process.env.FLW_SECRET_HASH; // Get the secret hash from .env
  const signature = req.headers["verif-hash"]; // Signature sent by Flutterwave

  if (!signature) {
    return res.status(403).json({ error: "No signature header present" });
  }

  // Compare the hash of the request body with the signature
  const hash = crypto
    .createHmac("sha256", secretHash)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== signature) {
    return res.status(403).json({ error: "Invalid signature" });
  }

  // Process the webhook payload
  const event = req.body;
  console.log("Webhook event received:", event);

  res.status(200).json({ message: "Webhook processed successfully" });
};
