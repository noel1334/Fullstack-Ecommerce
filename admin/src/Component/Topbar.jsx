import React, { useContext, useState, useEffect, useRef } from "react";
import { FaBars, FaSignOutAlt, FaBell } from "react-icons/fa";
import { UserContext } from "../Context/UserContext";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

const Topbar = ({ toggleSidebar }) => {
  const { userData, logout, BASE_URL } = useContext(UserContext);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const socket = io(BASE_URL);

    socket.on("connect", () => {
      console.log("Connected to WebSocket server in Topbar");
    });
    console.log(notifications);
    socket.on("new_notification", (notification) => {
      console.log("Received notification:", notification);
      setNotificationCount((prevCount) => prevCount + 1);
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });
    socket.on("accept_order", (notification) => {
      console.log("Received notification:", notification);
      setNotificationCount((prevCount) => prevCount + 1);
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]); // Add new notification to the list
    });
    socket.on("cancel_order", (notification) => {
      console.log("Received notification:", notification);
      setNotificationCount((prevCount) => prevCount + 1); // Increment the count
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]); // Add new notification to the list
    });
    socket.on("reject_order", (notification) => {
      console.log("Received notification:", notification);
      setNotificationCount((prevCount) => prevCount + 1);
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]); // Add new notification to the list
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server in Topbar");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="bg-gray-800 text-white p-4 px-4 flex items-center shadow-lg">
      {/* Hamburger Menu Icon */}
      <button className="text-xl lg:hidden" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className="flex-1 lg:hidden"></div>

      {/* Welcome, Admin and Logout Section */}
      <div className="flex items-center lg:ml-auto space-x-4">
        {/* Notification Icon with Counter */}
        <div className="relative" ref={dropdownRef}>
          <FaBell className="text-xl cursor-pointer" onClick={toggleDropdown} />
          {notificationCount > 0 && (
            <span className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full px-2 text-xs font-semibold">
              {notificationCount}
            </span>
          )}

          {/* Notification Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg overflow-hidden z-10 bg-gray-800">
              {notifications.length === 0 ? (
                <div className="px-4 py-2  bg-gray-800 text-white">
                  No new notifications
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div key={index} className="block">
                    <Link
                      to={`/orders/${notification.orderId}`}
                      className="px-4 py-2 text-white  bg-gray-800 hover:bg-gray-700 cursor-pointer"
                    >
                      {notification.message}
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <span className="hidden sm:block capitalize">
          Welcome, {userData.name}
        </span>
        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded text-white flex items-center space-x-2"
        >
          <FaSignOutAlt />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Topbar;
