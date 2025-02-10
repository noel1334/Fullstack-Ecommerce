import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CanceledOrder = ({ orderId, onClose, paymentEmail, paymentMethod }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const { BASE_URL } = useContext(UserContext);
  const [email, setEmail] = useState(paymentEmail || "");
  const [method, setMethod] = useState(paymentMethod || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCancelOrder = async () => {
    setError("");
    setLoading(true);

    const payload = {
      cancelOrder: "Canceled",
      cancellationReason: reason,
      cancellationDetails: details,
      cancellationEmail: email,
      cancellationPaymentMethod: method,
    };

    try {
      const response = await axios.patch(
        `${BASE_URL}/api/orders/${orderId}/cancel`,
        payload
      );

      toast.success("Order canceled successfully!", response.data);
      navigate(`/Canceled-order/${orderId}`);
      onClose();
    } catch (error) {
      console.error("Error canceling order:", error);
      setError(
        error.response?.data?.message || "An unexpected error occurred."
      );
      toast.error("Failed to cancel the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-lg font-bold mb-4">Cancel Order</h2>

        {/* Error Message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Reason for Cancellation */}
        <div className="mb-4">
          <label htmlFor="reason" className="block font-bold mb-1">
            Reason for Cancellation
          </label>
          <select
            id="reason"
            className="w-full p-2 border rounded"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Select a reason</option>
            <option value="Changed Mind">Changed Mind</option>
            <option value="Found Better Price">Found Better Price</option>
            <option value="Delayed Delivery">Delayed Delivery</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Additional Details for Other Reason */}
        {reason === "Other" && (
          <div className="mb-4">
            <label htmlFor="details" className="block font-bold mb-1">
              Additional Details
            </label>
            <textarea
              id="details"
              className="w-full p-2 border rounded"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        )}

        {/* Payment Email */}
        <div className="mb-4">
          <label htmlFor="paymentEmail" className="block font-bold mb-1">
            Payment Email Address
          </label>
          <input
            id="paymentEmail"
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter payment email address"
          />
        </div>

        {/* Payment Method Selection */}
        <div className="mb-4">
          <label htmlFor="paymentMethod" className="block font-bold mb-1">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            className="w-full p-2 border rounded"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="">Select a payment method</option>
            <option value="Paystack">Paystack</option>
            <option value="Monify">Monify</option>
            <option value="Flutterwave">Flutterwave</option>
            <option value="Stripe">Stripe</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
          <button
            className={`px-4 py-2 rounded text-white ${
              !reason || !email || !method
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={handleCancelOrder}
            disabled={!reason || !email || !method || loading}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanceledOrder;
