import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subcategoryRoutes from "./routes/subCategoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/flutterwave.js";
import errorHandler from "./middleware/errorHandler.js";
import { initializeSocket } from "./controllers/notificationService.js"; 

dotenv.config();

// Frontend URLs
const frontendUrl = process.env.FRONTEND_URL;
const clientUrl = process.env.FRONTEND_URL2;

// Log frontend URLs
console.log("Frontend URLs allowed by CORS:", frontendUrl, clientUrl);

// Initialize app
const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [frontendUrl, clientUrl],
    credentials: true,
    methods: "GET, POST, PUT, DELETE, PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/api", (req, res) => {
    res.send("api work");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      // Store the server instance
      console.log(`Server running on port ${PORT}`);
    });

    initializeSocket(server); 
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

startServer();