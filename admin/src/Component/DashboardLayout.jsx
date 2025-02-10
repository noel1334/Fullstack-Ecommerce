import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Navigate, Outlet } from "react-router-dom";
import ScrollToTopButton from "../pages/ScrollToTopButton";
import { UserContext } from "../Context/UserContext";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!userData) {
    return <Navigate to="/login" />; // Redirect to login if no user data
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />{" "}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="flex-1 px-2 sm:px-4 lg:px-6 p-4 overflow-auto text-white">
          <Outlet />
          <ScrollToTopButton />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
