import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import Title from "../Component/Title";
import { ShopContext } from "../Context/ShopContext";
import { format, formatDistanceToNow, parseISO } from "date-fns";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { BASE_URL } = useContext(UserContext);
  const { currency } = useContext(ShopContext);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const paginatedItems = order?.cartItems?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateOrder = async (id, updates) => {
    try {
      if (updates.shippingStatus) {
        switch (updates.shippingStatus) {
          case "Processing":
            updates.orderStatus = "Pending";
            break;
          case "Shipped":
            updates.orderStatus = "Packing";
            break;
          case "In_Transit":
            updates.orderStatus = "Shipped";
            break;
          case "Out_For_Delivery":
            updates.orderStatus = "Progress";
            break;
          case "Delivered":
            updates.orderStatus = "Delivered";
            break;
          case "Failed":
            updates.orderStatus = "Canceled";
            break;
          default:
            break;
        }
      }

      const response = await axios.patch(
        `${BASE_URL}/api/orders/${id}/status`,
        updates
      );

      const updatedOrder = response.data.order;
      setOrder(updatedOrder);
    } catch (err) {
      setError("Failed to update order. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="text-center text-white">Loading order details...</div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;

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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="pb-4 text-3xl flex justify-between items-center">
        <Title text1={"ORDER"} text2={"DETAILS"} />
        {/* Shipping Status Dropdown */}
        <div className="pb-4">
          <select
            className="bg-gray-700 text-white rounded-md p-2 text-xs sm:text-sm"
            value={order?.shippingStatus || ""}
            onChange={(e) =>
              updateOrder(order._id, {
                shippingStatus: e.target.value,
              })
            }
          >
            {order?.cancelOrder === "Canceled" ||
            order?.acceptedOrder === "Rejected" ? (
              <>
                <option value="">Shipping Status</option>
                <option value="Failed">Failed</option>
              </>
            ) : (
              <>
                <option value="" disabled>
                  Shipping Status
                </option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="In_Transit">In Transit</option>
                <option value="Out_For_Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Order Information */}
        <div className="flex flex-col gap-6 md:w-1/2">
          <table className="table-auto text-sm w-full">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="px-4 py-2 text-left">Field</th>
                <th className="px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 text-white">
              <tr>
                <td className="px-4 py-2 font-semibold">Order ID:</td>
                <td className="px-4 py-2">{order?.reference}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Customer Name:</td>
                <td className="px-4 py-2">{order?.shippingDetails?.name}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Customer Email:</td>
                <td className="px-4 py-2">{order?.shippingDetails?.email}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Customer Phone:</td>
                <td className="px-4 py-2">{order?.shippingDetails?.phone}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Shipping Address:</td>
                <td className="px-4 py-2">
                  {order?.shippingDetails?.address},{" "}
                  {order?.shippingDetails?.lga}, {order?.shippingDetails?.state}
                  , {order?.shippingDetails?.country}
                </td>
              </tr>
              {order?.transactionId && (
                <tr>
                  <td className="px-4 py-2 font-semibold">Transaction ID:</td>
                  <td className="px-4 py-2">{order.transactionId}</td>
                </tr>
              )}
              <tr>
                <td className="px-4 py-2 font-semibold">Payment Status:</td>
                <td className="px-4 py-2">{order?.paymentStatus}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Payment Method:</td>
                <td className="px-4 py-2">{order?.paymentMethod}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Order Status:</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-md font-semibold text-xs sm:text-sm ${getStatusClass(
                      order?.status
                    )}`}
                  >
                    {order?.status}
                  </span>
                </td>
              </tr>
              {order?.deliveryDate && (
                <tr>
                  <td className="px-4 py-2 font-semibold">Delivery Date:</td>
                  <td className="px-4 py-2">
                    {format(new Date(order.deliveryDate), "MMMM dd, yyyy")}
                    <br />
                    <span className="text-gray-500 text-sm">
                      {formatDistanceToNow(parseISO(order.deliveryDate), {
                        addSuffix: true,
                      })}
                    </span>
                  </td>
                </tr>
              )}

              <tr>
                <td className="px-4 py-2 font-semibold">Accepted Order:</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-md font-semibold text-xs sm:text-sm ${
                      order?.acceptedOrder === "Accepted"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                  >
                    {order?.acceptedOrder}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Cancelled Order:</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-md font-semibold text-xs sm:text-sm ${
                      order?.cancelOrder === "Canceled"
                        ? "bg-red-500"
                        : "bg-orange-500"
                    }`}
                  >
                    {order?.cancelOrder}
                  </span>
                </td>
              </tr>
              {order?.cancelOrder === "Canceled" && (
                <tr>
                  <td className="px-4 py-2 font-semibold">
                    Cancellation Reason:
                  </td>
                  <td className="px-4 py-2">{order?.cancellationReason}</td>
                </tr>
              )}
              {order?.acceptedOrder === "Rejected" && (
                <tr>
                  <td className="px-4 py-2 font-semibold">Rejection Reason:</td>
                  <td className="px-4 py-2">{order?.rejectionReason}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Order Products */}
        <div className="flex p-3 bg-gray-800 flex-col gap-3 md:w-1/2">
          <div className="font-semibold text-xl mb-2">Products:</div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedItems?.map((item, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-md hover:scale-105 transition-transform"
              >
                <img
                  src={item.selectedImage}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-md mb-4 mx-auto"
                />
                <div className="flex flex-col items-center">
                  <div className="text-xl font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-400">
                    Quantity: {item.quantity}
                  </div>
                  <div className="text-sm text-gray-400">
                    Size: {item.selectedSize}
                  </div>
                  <div className="text-sm text-gray-400">
                    Price: ${item.price}
                  </div>
                  <div className="text-sm text-gray-400">
                    Color: {item.selectedColor}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="font-semibold text-xl mb-2">Total Amount:</div>
          <div className="flex items-center justify-between gap-6">
            <div className="text-2xl font-bold text-green-400">
              {currency}
              {order?.totalAmount}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-gray-700 text-white"
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of{" "}
              {Math.ceil(order?.cartItems?.length / itemsPerPage)}
            </span>
            <button
              disabled={
                currentPage ===
                Math.ceil(order?.cartItems?.length / itemsPerPage)
              }
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage ===
                Math.ceil(order?.cartItems?.length / itemsPerPage)
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-gray-700 text-white"
              }`}
            >
              Next
            </button>
          </div>

          <div className="text-lg mt-4">
            <Link
              to="/orders"
              className="text-blue-500 hover:underline text-lg"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
