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
import path from "path";

dotenv.config();

// Get the current directory name
const __dirname = new URL(".", import.meta.url).pathname;

// Frontend URLs
const frontendUrl = process.env.FRONTEND_URL;
const clientUrl = process.env.FRONTEND_URL2;

// Log frontend URLs
console.log("Frontend URLs allowed by CORS:", frontendUrl, clientUrl);

// Initialize app
const app = express();

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/uploads", express.static(path.resolve("./uploads")));

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
