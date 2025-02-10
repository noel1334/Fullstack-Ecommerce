import React, { useState, useEffect, useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ScrollToTopButton from "./ScrollToTopButton";
import { UserContext } from "../Context/UserContext";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsSmallScreen(true);
        setSidebarOpen(false);
      } else {
        setIsSmallScreen(false);
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!userData) {
    return <Navigate to="admin/login" />;
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      <div className="fixed top-0 left-0 right-0 z-10">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div className="flex flex-1 pt-16">
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } bg-gray-800 text-white w-64 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-20 ${
            isSmallScreen ? "absolute" : ""
          }`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            isSmallScreen={isSmallScreen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen && !isSmallScreen ? "ml-64" : ""
          }`}
        >
          <div className="p-4">
            <Outlet />
            <ScrollToTopButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
