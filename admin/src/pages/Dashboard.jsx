import React from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaShoppingCart,
  FaBoxOpen,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";
import Title from "../Component/Title";

const Dashboard = () => {
  const salesData = [
    { name: "Jan", sales: 400 },
    { name: "Feb", sales: 600 },
    { name: "Mar", sales: 800 },
    { name: "Apr", sales: 700 },
    { name: "May", sales: 900 },
  ];

  const productData = [
    { name: "Electronics", value: 400 },
    { name: "Fashion", value: 300 },
    { name: "Home Appliances", value: 300 },
    { name: "Books", value: 200 },
  ];

  const orderData = [
    { month: "Jan", orders: 300 },
    { month: "Feb", orders: 400 },
    { month: "Mar", orders: 500 },
    { month: "Apr", orders: 450 },
    { month: "May", orders: 600 },
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <div className="text-3xl text-gray-300">
        <Title text1={"DASHBOARD"} text2={"OVERVIEW"} />
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded shadow-lg flex items-center hover:scale-105 transition transform">
          <FaShoppingCart className="text-4xl text-white" />
          <div className="ml-4">
            <p className="text-sm">Total Orders</p>
            <h2 className="text-xl font-bold">1,245</h2>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded shadow-lg flex items-center hover:scale-105 transition transform">
          <FaDollarSign className="text-4xl text-white" />
          <div className="ml-4">
            <p className="text-sm">Revenue</p>
            <h2 className="text-xl font-bold">$56,780</h2>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded shadow-lg flex items-center hover:scale-105 transition transform">
          <FaBoxOpen className="text-4xl text-white" />
          <div className="ml-4">
            <p className="text-sm">Total Products</p>
            <h2 className="text-xl font-bold">3,457</h2>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded shadow-lg flex items-center hover:scale-105 transition transform">
          <FaUsers className="text-4xl text-white" />
          <div className="ml-4">
            <p className="text-sm">Total Users</p>
            <h2 className="text-xl font-bold">15,234</h2>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded shadow-lg">
          <h3 className="text-lg font-bold mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <Line type="monotone" dataKey="sales" stroke="#00C49F" />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-6 rounded shadow-lg">
          <h3 className="text-lg font-bold mb-4">Product Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {productData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Orders Overview - Pie Chart */}
      <div className="bg-gray-800 p-6 rounded shadow-lg">
        <h3 className="text-lg font-bold mb-4">Order Statistics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={orderData}
              dataKey="orders"
              nameKey="month"
              outerRadius={100}
              fill="#00C49F"
              label
            >
              {orderData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mt-8">
        <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
        <div className="overflow-auto max-h-60">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-700 hover:bg-gray-600">
                <td className="py-2 px-4">#1001</td>
                <td className="py-2 px-4">Smartphone</td>
                <td className="py-2 px-4">Delivered</td>
                <td className="py-2 px-4">2024-12-20</td>
              </tr>
              <tr className="bg-gray-700 hover:bg-gray-600">
                <td className="py-2 px-4">#1002</td>
                <td className="py-2 px-4">Laptop</td>
                <td className="py-2 px-4">Pending</td>
                <td className="py-2 px-4">2024-12-19</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
      {/* Report Section */}
      <div className="bg-gray-800 p-6 rounded shadow-lg">
        <h3 className="text-lg font-bold mb-4">Reports</h3>
        <p className="mb-4">
          The monthly reports provide a breakdown of key metrics, including
          total orders, sales performance, and user engagement. Here are some
          key insights:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Highest sales recorded in May with $900 in revenue.</li>
          <li>Electronics contributed the most to product sales at 40%.</li>
          <li>Monthly orders have shown consistent growth since January.</li>
        </ul>
        <p>
          Download the detailed report for a full analysis of the e-commerce
          performance for this quarter.
        </p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Download Report
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
