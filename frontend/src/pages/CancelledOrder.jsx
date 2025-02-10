import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Component/Title";
import { format } from "date-fns";

const CancelledOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser, BASE_URL } = useContext(UserContext);
  const { currency } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (err) {
        setError("Failed to fetch order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading Rejected Orders information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Order not found.</p>
      </div>
    );
  }

  const formattedDate = order.createdAt
    ? format(new Date(order.createdAt), "MMMM dd, yyyy 'at' HH:mm")
    : "N/A";

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center text-2xl mb-3">
          <Title text1={"CANCELLED"} text2={"ORDER"} />
          <div className="text-lg mt-4">
            <Link
              to="/orders"
              className="text-blue-500 hover:underline text-lg"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
        {/* Thank You Message */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-600">Thank You!</h1>
          <p className="text-lg mt-2 text-red-600">
            We truly appreciate your business and look forward to serving you
            again! <br />{" "}
            <strong>
              Your order has been Cancelled by you. We would look forward ro
              Refund your money. please it takes i few days.
            </strong>
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-6">
          <p className="mb-2 text-green-400">
            <strong className="text-black">Cancelled Order: </strong>
            {order.cancelOrder} By You! {currentUser.name}
          </p>
          <p className="mb-2">
            <strong>Order Reference:</strong> {order.reference}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {order.status}
          </p>
          {order.shippingStatus === "Failed" && (
            <>
              <strong>Shipping Status: </strong>
              {" Refunding"}
            </>
          )}
          <p>
            <strong>Order Date:</strong> {formattedDate}
          </p>
        </div>

        <div>
          <Title text1={"ACCEPTED ORDER"} text2={"DETAILS"} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {order.cartItems.map((item, index) => (
            <div className="bg-white shadow-lg rounded-lg p-4" key={index}>
              <div
                className="p-4 rounded-lg shadow-lg flex justify-start mb-2 gap-4"
                style={{ backgroundColor: item.selectedColor }}
              >
                <img
                  className="h-32 w-32 rounded object-cover"
                  src={item.selectedImage}
                  alt={item.name}
                />
                <div className="flex flex-col justify-between">
                  <p className="font-bold text-lg">{item.name}</p>
                  <p>Size: {item.selectedSize}</p>
                  <div className="flex gap-2">
                    <span className="bg-gray-800 text-white py-1 px-3 rounded">
                      Qty: {item.quantity}
                    </span>
                    <span className="bg-gray-800 text-white py-1 px-3 rounded">
                      {currency}
                      {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Total */}
        <div className="mt-6 text-right">
          <p className="text-xl font-bold">
            Total: {currency}
            {order.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancelledOrder;
