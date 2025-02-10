import React, { useContext } from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { UserContext } from "../Context/UserContext";

const Topbar = ({ toggleSidebar }) => {
  const { userData, logout } = useContext(UserContext);

  return (
    <div className="bg-gray-800 text-white p-4 px-4 flex items-center shadow-lg">
      {/* Hamburger Menu Icon */}
      <button className="text-xl lg:hidden" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className="flex-1 lg:hidden"></div>

      {/* Welcome, Admin and Logout Section */}
      <div className="flex items-center lg:ml-auto space-x-4">
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
