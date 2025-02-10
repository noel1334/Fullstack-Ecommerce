import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { toast } from "react-toastify";

const RejectOrderComponent = ({
  orderId,
  onClose,
  paymentEmail,
  paymentMethod,
}) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState(paymentEmail || "");
  const [method, setMethod] = useState(paymentMethod || "");
  const { BASE_URL } = useContext(UserContext);
  const navigate = useNavigate();

  const handleRejectOrder = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/orders/${orderId}/reject`,
        {
          acceptedOrder: "Rejected",
          rejectionReason: reason,
          paymentEmail: email,
          rejectionPaymentMethod: method,
          rejectionDetails: details,
        }
      );

      console.log("Order rejection updated successfully:", response.data);
      toast.success("Order rejection updated successfully");
      navigate(`/rejected-order/${orderId}`);
    } catch (error) {
      console.error("Error rejecting order:", error);
      alert("Failed to reject the order. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Reject Order</h2>

        {/* Reason for Rejection */}
        <div className="mb-4">
          <label htmlFor="reason" className="block font-bold mb-1">
            Reason for Rejection
          </label>
          <select
            id="reason"
            className="w-full p-2 border rounded"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Select a reason</option>
            <option value="Not I Order">Not what I Order</option>
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
          >
            Close
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleRejectOrder}
            disabled={!reason || !email || !method}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectOrderComponent;
