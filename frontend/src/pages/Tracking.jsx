import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Component/Title";
import CanceledOrder from "../Component/CanceledOrder";
import RejectOrderComponent from "../Component/RejectOrderComponent";
import { toast } from "react-toastify";
import { format, formatDistanceToNow, parseISO } from "date-fns";

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
      return "bg-gray-300 text-gray-800";
  }
};

const Tracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelOrder, setShowCancelOrder] = useState(false);
  const [showRejectOrder, setShowRejectOrder] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { currentUser, handleLinkClick, BASE_URL } = useContext(UserContext);
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
        const fetchedOrder = response.data.order;

        if (fetchedOrder.acceptedOrder === "Accepted") {
          navigate(`/accepted-order/${orderId}`);
          return;
        }
        if (fetchedOrder.acceptedOrder === "Rejected") {
          navigate(`/rejected-order/${orderId}`);
          return;
        }
        if (fetchedOrder.cancelOrder === "Canceled") {
          navigate(`/Canceled-order/${orderId}`);
          return;
        }

        if (currentUser.id !== fetchedOrder.userId) {
          toast.error("You are not authorized to view this order.");
          navigate("/");
          return;
        }

        setOrder(fetchedOrder);
      } catch (err) {
        setError("Failed to fetch order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, currentUser, BASE_URL, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading tracking information...</p>
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

  const progressStages = [
    "Pending",
    "Processed",
    "Packing",
    "Shipped",
    "Progress",
    "Delivered",
  ];

  const showCancelButton = progressStages.indexOf(order.status) <= 2;
  const showAcceptRejectButtons = order.status === "Delivered";
  const formattedDate = order.createdAt
    ? format(new Date(order.createdAt), "MMMM dd, yyyy 'at' HH:mm")
    : "N/A";

  const handleAcceptOrder = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmAccept = async () => {
    try {
      // Send PATCH request to update acceptedOrder field
      await axios.patch(`${BASE_URL}/api/orders/${orderId}/accept`, {
        acceptedOrder: "Accepted",
      });
      toast.success(
        "You Successfully accepted order Thank you for Shopping with Us.  "
      );
      navigate(`/accepted-order/${orderId}`);
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error("Failed to accept the order. Please try again.");
    }
  };

  const handleCancelAccept = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center text-2xl mb-3">
          <Title text1={"ORDER"} text2={"TRACKING"} />
          <div className="text-lg mt-4">
            <Link
              to="/orders"
              className="text-blue-500 hover:underline text-lg"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-8 relative">
          {progressStages.map((stage, index) => {
            const isActive = progressStages.indexOf(order.status) >= index;
            const isCurrent = progressStages.indexOf(order.status) === index;

            return (
              <div
                key={index}
                className={`flex-1 flex flex-col items-center ${
                  isActive ? "text-green-500" : "text-gray-400"
                }`}
              >
                {/* Connecting Line */}
                {index !== 0 && (
                  <div
                    className={`absolute top-1/2 left-0 w-full h-1 ${
                      isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                    style={{
                      transform: "translateY(-50%)",
                      zIndex: -1,
                      width: "calc(100% - 2rem)",
                    }}
                  />
                )}

                <div
                  className={`w-8 h-8 rounded-full border-4 ${
                    isActive ? getStatusClass(stage) : "bg-gray-300"
                  } ${
                    isCurrent ? "border-blue-500" : "border-transparent"
                  } flex justify-center items-center`}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-sm">{stage}</span>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-6">
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
          <p className="mb-2">
            <strong>Order Reference:</strong> {order.reference}
          </p>
          <p className="mb-2">
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded ${getStatusClass(order.status)}`}
            >
              {order.status}
            </span>
          </p>
          <p>
            <strong>Shipping Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded ${getStatusClass(
                order.shippingStatus || "N/A"
              )}`}
            >
              {order.shippingStatus || "N/A"}
            </span>
          </p>
          <p>
            <strong>Order Date:</strong> {formattedDate}
          </p>
        </div>

        <div>
          <Title text1={"ORDER"} text2={"DETAILS"} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {order.cartItems.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg shadow-lg flex justify-start gap-4"
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
          ))}
        </div>

        {/* Order Total */}
        <div className="mt-6 text-right">
          <p className="text-xl font-bold">
            Total: {currency}
            {order.totalAmount.toFixed(2)}
          </p>

          {/* Show buttons based on order status */}
          <div className="mt-4">
            {showAcceptRejectButtons && (
              <div>
                <p className="mb-2">
                  <strong>
                    Note: Do not Accept Or Reject the order if the Product did
                    not reach your hand.
                  </strong>
                  <br />
                  Kindly Accept if the order reached you: you can also Reject if
                  you don't like the ORDER
                </p>
                <button
                  onClick={() => {
                    handleAcceptOrder();
                    handleLinkClick();
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 mr-4"
                >
                  Accept Order
                </button>
                <button
                  onClick={() => setShowRejectOrder(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                >
                  Reject Order
                </button>
              </div>
            )}
            {showCancelButton && (
              <div>
                <p className="mb-2">
                  Do you want to cancel your order? Please note that refunds may
                  take up to 7-10 business days to process.
                </p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                  onClick={() => setShowCancelOrder(true)}
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Show Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-xl mb-4">Did you receive the product?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleConfirmAccept}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={handleCancelAccept}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show CanceledOrder Component */}
      {showCancelOrder && (
        <CanceledOrder
          orderId={orderId}
          onClose={() => setShowCancelOrder(false)}
          paymentEmail={order.shippingDetails.email}
          paymentMethod={order.paymentMethod}
        />
      )}

      {/* Show Reject Order Component */}
      {showRejectOrder && (
        <RejectOrderComponent
          orderId={orderId}
          onClose={() => setShowRejectOrder(false)}
          paymentEmail={order.shippingDetails.email}
          paymentMethod={order.paymentMethod}
        />
      )}
    </div>
  );
};

export default Tracking;
