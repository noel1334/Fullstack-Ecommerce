import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shippingDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    lga: { type: String, required: true },
  },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      selectedColor: String,
      selectedImage: String,
      selectedSize: String,
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["paypal", "stripe", "payStack", "master", "flutterwave", "monnify"], 
    required: true,
  },
  
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  shippingStatus: {
    type: String,
    enum: ["Processing", "Shipped", "In_Transit", "Out_For_Delivery", "Delivered", "Failed"],
    default: "Processing",
  },
  status: {
    type: String,
    enum: ["Pending", "Processed", "Packing", "Shipped", "Progress", "Delivered", "Canceled"],
    default: "Pending",
  },
  acceptedOrder: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  rejectionReason: {
    type: String,
    enum: [
      "Not what I Ordered",
      "Changed Mind",
      "Found Better Price",
      "Delayed Delivery",
      "Other",
    ],
    default: null,
  },
  paymentEmail: {
    type: String,
    required: function () {
      return this.acceptedOrder === "Rejected";
    },
  },
  rejectionPaymentMethod: {
    type: String,
    enum: ["Paystack", "PayPal", "flutterwave"],
    required: function () {
      return this.acceptedOrder === "Rejected";
    },
  },
  rejectionDetails: {
    type: String,
    required: function () {
      return this.acceptedOrder === "Rejected";
    },
  },
  cancelOrder: {
    type: String,
    enum: ["Pending", "Canceled"],
    default: "Pending",
  },
  cancellationReason: {
    type: String,
    enum: [
      "Changed Mind",
      "Found Better Price",
      "Delayed Delivery",
      "Other",
    ],
    default: null,
  },
  cancellationEmail: {
    type: String,
    required: function () {
      return this.cancelOrder === "Canceled";
    },
  },
  cancellationPaymentMethod: {
    type: String,
    enum: ["Paystack", "PayPal", "Flutterwave"],
    required: function () {
      return this.cancelOrder === "Canceled";
    },
  },
  cancellationDetails: {
    type: String,
    required: function () {
      return this.cancelOrder === "Canceled";
    },
  },
  deliveryDate: { type: Date },
  transactionId: { type: String },
  reference: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
;

const Order = mongoose.model("Order", orderSchema);
export default Order;
