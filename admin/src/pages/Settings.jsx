import React, { useState } from "react";
import { AiOutlineBell, AiOutlineSave } from "react-icons/ai";
import Title from "../Component/Title";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");

  const handleSave = () => {
    alert("Settings saved!");
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <div className="text-3xl mb-3">
        <Title text1="USER" text2="SETTINGS" />
      </div>

      {/* User Details Section */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          User Information
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="w-full sm:w-1/2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Change Password
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="w-full sm:w-1/2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Notifications
        </h2>
        <div className="flex items-center">
          <AiOutlineBell className="text-gray-600 dark:text-gray-300 mr-4" />
          <label className="text-gray-700 dark:text-gray-300">
            Enable Notifications
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="ml-2"
            />
          </label>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Theme
        </h2>
        <div className="flex items-center">
          <div className="mr-4">
            <label className="text-gray-700 dark:text-gray-300">Light</label>
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
              className="ml-2"
            />
          </div>
          <div className="mr-4">
            <label className="text-gray-700 dark:text-gray-300">Dark</label>
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
              className="ml-2"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-md shadow-lg hover:bg-blue-600"
        >
          <AiOutlineSave />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
