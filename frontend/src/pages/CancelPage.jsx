import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Context/UserContext";

const CancelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { BASE_URL } = useContext(UserContext);
  const params = new URLSearchParams(location.search);
  const orderReference = params.get("reference");

  useEffect(() => {
    const deleteOrder = async () => {
      if (orderReference) {
        try {
          console.log("Deleting order with reference:", orderReference);
          const response = await axios.delete(
            `${BASE_URL}/api/orders/delete/${orderReference}`
          );
          console.log("Delete response:", response.data);
        } catch (error) {
          console.error(
            "Error deleting order:",
            error.response?.data?.message || error.message
          );
        }
      }
    };

    deleteOrder();
  }, [orderReference]);

  const handleRetry = () => {
    navigate("/place-order");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Payment Canceled</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your payment was not completed. You can retry the payment by going back
        to the checkout page.
      </p>
      <button
        onClick={handleRetry}
        className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded hover:bg-blue-600 transition-all"
      >
        Retry Payment
      </button>
    </div>
  );
};

export default CancelPage;
