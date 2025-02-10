import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Component/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../Context/UserContext";
import { format, formatDistanceToNow, parseISO } from "date-fns";

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const { currentUser, handleLinkClick, BASE_URL } = useContext(UserContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      toast.error("Please login to view your orders.");
      navigate("/login");
      return;
    }

    // Fetch orders for the logged-in user
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/orders/user/${currentUser.id}`
        );
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
        // toast.error("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">You have no orders yet.</p>
      </div>
    );
  }
  // Determine background color for the order status
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-orange-500 text-gray-900";
      case "Processed":
        return "bg-yellow-500 text-white";
      case "Packing":
        return "bg-lime-300 text-white";
      case "Shipped":
        return "bg-lime-500 text-white";
      case "Progress":
        return "bg-green-500 text-white";
      case "Delivered":
        return "bg-green-800 text-white";
      case "Canceled":
        return "bg-red-500 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {/* Display the list of orders */}
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white shadow-lg rounded-lg overflow-hidden mb-6"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                {order?.deliveryDate && (
                  <h3 className=" py-2 font-semibold">
                    Delivery Date:{" "}
                    <span className="text-gray-600">
                      {format(new Date(order.deliveryDate), "MMMM dd, yyyy")}
                      <br />
                      <span className="text-gray-500 text-sm">
                        {formatDistanceToNow(parseISO(order.deliveryDate), {
                          addSuffix: true,
                        })}
                      </span>
                    </span>
                  </h3>
                )}
                <h3 className="text-lg font-medium">
                  Order Reference: {order.reference}
                </h3>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  {order.paymentStatus === "success"
                    ? "Payment Successful"
                    : "Payment Pending"}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {format(new Date(order.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    order.paymentStatus === "success"
                      ? "bg-green-200 text-green-600"
                      : "bg-yellow-200 text-yellow-600"
                  }`}
                >
                  {order.paymentStatus === "success" ? "Completed" : "Pending"}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">
                Total Amount: {currency}
                {order.totalAmount}
              </p>
              <p>Order Status</p>
            </div>
            {/* Display the cart items */}
            {order.cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-1 py-4 border-t border-gray-200"
              >
                <img
                  src={item.selectedImage}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg mr-6"
                />
                <div className="flex-grow">
                  <p className="text-base font-medium">{item.name}</p>
                  <div className="text-sm text-gray-600">
                    <p>
                      {currency}
                      {item.price} x {item.quantity}
                    </p>
                    <p>Size: {item.selectedSize}</p>
                    {/* Dynamically change background color based on the item color */}
                    <p
                      className="p-2 text-xs text-gray-300 font-bold rounded border border-gray-300"
                      style={{
                        backgroundColor: item.selectedColor,
                        maxWidth: "max-content",
                      }}
                    >
                      {item.selectedColor}
                    </p>
                  </div>
                </div>
                {/* Ready to Ship Status and Track Order Button */}
                <div className="flex flex-col sm:flex-row items-center justify-center sm:items-start sm:gap-4 gap-2">
                  <div className="flex items-center gap-6 sm:ml-4">
                    <p
                      className={`min-w-2 h-2 rounded-full ${getStatusClass(
                        order?.status
                      )}S`}
                    ></p>
                    <div className="flex flex-col items-center justify-center">
                      <span
                        className={`px-3 py-1 rounded-md font-semibold text-xs sm:text-sm ${getStatusClass(
                          order?.status
                        )}`}
                      >
                        {order?.status}
                      </span>
                      <span> {order.shippingStatus || "N/A"}</span>
                    </div>
                  </div>
                  {/* Track Order Button */}
                  <button
                    onClick={() => {
                      navigate(`/order-tracking/${order._id}`);
                      handleLinkClick();
                    }}
                    className="mt-2 sm:mt-0 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
