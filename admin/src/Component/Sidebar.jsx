import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCogs,
  FaRegChartBar,
  FaBox,
  FaTh,
  FaList,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { UserContext } from "../Context/UserContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useContext(UserContext);

  // Function to close the sidebar on small screens
  const closeSidebar = () => {
    if (window.innerWidth < 640) {
      setIsOpen(false); // Close the sidebar if the screen width is less than 640px
    }
  };

  // Navigation items for the sidebar
  const navItems = [
    { path: "/", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/orders", icon: <FaBox />, label: "Order" },
    { path: "/products", icon: <FaTh />, label: "Product" },
    { path: "/reports", icon: <FaRegChartBar />, label: "Reports" },
    { path: "/categories", icon: <FaList />, label: "Categories" },
    { path: "/users", icon: <FaUsers />, label: "Users" },
    { path: "/settings", icon: <FaCogs />, label: "Settings" },
  ];

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isOpen ? "w-44" : "w-14"
      } h-screen bg-gray-800 text-white flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className={`text-center mt-6 ${isOpen ? "block" : "hidden"}`}>
        <h2 className="text-2xl font-bold">Admin</h2>
      </div>

      {/* Sidebar Navigation Items */}
      <ul className="space-y-6 mt-2 overflow-y-auto flex-1 px-2">
        {navItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className="flex items-center hover:bg-gray-700 px-4 py-2 rounded"
              onClick={closeSidebar} // Close sidebar on small screens after click
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <span className={`ml-3 ${isOpen ? "block" : "hidden"}`}>
                {item.label}
              </span>
            </NavLink>
          </li>
        ))}

        {/* Logout Button */}
        <li onClick={logout}>
          <button
            className="flex items-center bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-full"
            onClick={closeSidebar} // Close sidebar on small screens after click
          >
            <FiLogOut className="text-xl flex-shrink-0" />
            <span className={`ml-3 ${isOpen ? "block" : "hidden"}`}>
              Logout
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
