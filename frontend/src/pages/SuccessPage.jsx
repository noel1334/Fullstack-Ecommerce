import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import { toast } from "react-toastify";
import { CartContext } from "../Context/CartContext";

const SuccessPage = () => {
  const navigate = useNavigate();
  const { BASE_URL } = useContext(UserContext);
  const { setCart } = useContext(CartContext);

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    const completeOrder = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        console.error("Session ID not found in URL.");
        navigate("/place-order");
        return;
      }

      try {
        const { data } = await axios.post(
          `${BASE_URL}/api/orders/completeOrder`,
          { sessionId }
        );

        if (data.message === "Payment not completed.") {
          // Explicitly delete the order if payment failed
          await axios.delete(`${BASE_URL}/api/orders/${data.order.reference}`);
          toast.error("Payment failed! Your order has been canceled.", {
            position: "top-center",
            autoClose: 5000,
          });
          navigate("/place-order");
        } else {
          // Successful payment
          toast.success("Order placed successfully!", {
            position: "top-center",
            autoClose: 5000,
          });
          navigate("/orders", { state: { order: data.order } });
          clearCart();
        }
      } catch (error) {
        console.error("Error in completeOrder:", error.response || error);

        const orderReference = error.response?.data?.order?.reference || null;

        if (orderReference) {
          try {
            await axios.delete(`${BASE_URL}/api/orders/${orderReference}`);
          } catch (deleteError) {
            console.error(
              "Error deleting order:",
              deleteError.response?.data || deleteError.message
            );
          }
        }

        toast.error(
          "An error occurred while processing your order. Please try again.",
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
        navigate("/place-order");
      }
    };

    completeOrder();
  }, [navigate, BASE_URL]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg font-medium">Processing your order...</p>
    </div>
  );
};

export default SuccessPage;
