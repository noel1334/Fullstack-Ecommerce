import React, { useContext, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import Title from "../Component/Title";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { BASE_URL } = useContext(UserContext);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { currency } = useContext(ShopContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [requestFilter, setRequestFilter] = useState("All");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");

  // Set itemsPerPage to 4 for testing purposes
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/orders`);
        setOrders(response.data.orders);
        setError(null);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [BASE_URL]);

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
            updates.deliveryDate = new Date(); // Set delivery date on the client-side as well (optional)
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
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === id ? updatedOrder : order))
      );
    } catch (err) {
      setError("Failed to update order. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredOrders =
    orders
      ?.filter((order) => {
        const customerName = order.shippingDetails?.name?.toLowerCase() || "";
        const shippingEmail = order.shippingDetails?.email?.toLowerCase() || "";

        // Match search term against customer name or email
        const matchesSearch =
          customerName.includes(searchTerm.toLowerCase()) ||
          shippingEmail.includes(searchTerm.toLowerCase());

        // Check against requestFilter
        const matchesRequestFilter =
          requestFilter === "All" ||
          order.acceptedOrder?.toLowerCase() === requestFilter.toLowerCase() ||
          order.cancelOrder?.toLowerCase() === requestFilter.toLowerCase();

        // Check against statusFilter
        const matchesStatusFilter =
          statusFilter === "All" ||
          order.status?.toLowerCase() === statusFilter.toLowerCase();

        // Check against paymentMethodFilter
        const matchesPaymentMethodFilter =
          !paymentMethodFilter ||
          order.paymentMethod?.toLowerCase() ===
            paymentMethodFilter.toLowerCase();

        const orderDate = new Date(order.createdAt);
        const matchesDateRange =
          (!startDate || orderDate >= new Date(startDate)) &&
          (!endDate || orderDate <= new Date(endDate));

        return (
          matchesSearch &&
          matchesRequestFilter &&
          matchesStatusFilter &&
          matchesPaymentMethodFilter &&
          matchesDateRange
        );
      })
      ?.sort((a, b) => {
        // Custom sorting logic to order by most recent date first (descending)
        return new Date(b.createdAt) - new Date(a.createdAt);
      }) || [];

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6">
      <div className="text-xl sm:text-2xl mb-4">
        <Title text1={"CUSTOMER"} text2={"ORDERS"} />
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 lg:gap-6 mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by customer name..."
          className="bg-gray-800 text-white px-3 py-2 rounded-md w-full sm:w-1/2 lg:w-1/3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Date Range Inputs */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto lg:w-1/3">
          <input
            type="date"
            className="p-2 border rounded-md bg-gray-700 text-gray-300 w-full sm:w-auto"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-gray-600 text-xs sm:text-sm">to</span>
          <input
            type="date"
            className="p-2 border rounded-md bg-gray-700 text-gray-300 w-full sm:w-auto"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Request Filter */}
        <select
          className="bg-gray-800 text-white px-3 py-2 rounded-md w-full sm:w-1/3 lg:w-1/4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={requestFilter}
          onChange={(e) => setRequestFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Accepted">Accepted</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Canceled">Canceled</option>
        </select>
        <select
          className="bg-gray-800 text-white px-3 py-2 rounded-md w-full sm:w-1/3 lg:w-1/4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={paymentMethodFilter}
          onChange={(e) => setPaymentMethodFilter(e.target.value)}
        >
          <option value="">Payment Method</option>
          <option value="paystack">Paystack</option>
          <option value="monnify">Monnify</option>
          <option value="flutterwave">Flutterwave</option>
        </select>

        {/* Status Filter */}
        <select
          className="bg-gray-800 text-white px-3 py-2 rounded-md w-full sm:w-1/3 lg:w-1/4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Processed">Processing</option>
          <option value="Packing">Packing</option>
          <option value="Shipped">Shipped</option>
          <option value="Progress">Progress</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-sm">Loading orders...</div>
      ) : error ? (
        <div className="text-center text-sm text-red-500">{error}</div>
      ) : (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full text-left table-auto text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-700 text-gray-300 uppercase text-xs sm:text-sm">
                <th className="py-2 px-3">Order ID</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Products</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Shipping Status</th>
                <th className="py-2 px-3">Payment/Amount</th>
                <th className="py-2 px-3">Date/Time</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => {
                  // Determine the background color for the row
                  const rowBgClass =
                    order.acceptedOrder === "Rejected" ||
                    order.cancelOrder === "Canceled"
                      ? "bg-red-500"
                      : order.acceptedOrder === "Accepted"
                      ? "bg-green-500"
                      : "";

                  return (
                    <tr
                      key={order._id}
                      className={`border-b border-gray-700 hover:bg-gray-600 transition ${rowBgClass}`}
                    >
                      <td className="py-2 px-3">{order.reference}</td>
                      <td className="py-2 px-3">
                        {order.shippingDetails?.name || "Unknown Customer"}
                      </td>
                      <td className="py-2 px-3">
                        {order.cartItems?.map((product, index) => (
                          <div key={index} className="text-xs">
                            {product.name} (x{product.quantity}) -{" "}
                            {currency + " "}
                            {product.price.toFixed(2)}
                          </div>
                        ))}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-1 rounded-md font-semibold ${
                            order.status === "Pending"
                              ? "bg-orange-500 text-gray-900"
                              : order.status === "Processed"
                              ? "bg-yellow-500 text-white"
                              : order.status === "Packing"
                              ? "bg-lime-300 text-white"
                              : order.status === "Shipped"
                              ? "bg-lime-500 text-white"
                              : order.status === "Progress"
                              ? "bg-green-500 text-white"
                              : order.status === "Delivered"
                              ? "bg-green-800 text-white"
                              : order.status === "Canceled"
                              ? "bg-red-500 text-white"
                              : ""
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {order.shippingStatus || "N/A"}
                      </td>
                      <td className="py-2 px-3">
                        <div>{order.paymentStatus}</div>
                        <div className="font-bold">
                          {currency + " "}
                          {order.totalAmount.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        {new Date(order.createdAt).toLocaleString() || "N/A"}
                      </td>
                      <td className="py-2 px-3 flex flex-col sm:flex-row gap-2">
                        <select
                          className="bg-gray-700 text-white rounded-md p-2"
                          defaultValue=""
                          onChange={(e) =>
                            updateOrder(order._id, {
                              shippingStatus: e.target.value,
                            })
                          }
                        >
                          {order?.cancelOrder === "Canceled" ||
                          order?.acceptedOrder === "Rejected" ? (
                            <>
                              <option value="" disabled>
                                Shipping Status
                              </option>
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
                              <option value="Out_For_Delivery">
                                Out For Delivery
                              </option>
                              <option value="Delivered">Delivered</option>
                            </>
                          )}
                        </select>
                        <Link
                          to={`/orders/${order._id}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md shadow text-xs sm:text-sm"
                        >
                          <FaEye />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`mx-1 px-3 py-1 text-sm rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
