import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../Context/UserContext";
import Title from "../Component/Title";

const AddUser = ({ onClose, refreshUsers, userToEdit }) => {
  const { BASE_URL } = useContext(UserContext);
  const [name, setName] = useState(userToEdit?.name || "");
  const [email, setEmail] = useState(userToEdit?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(userToEdit?.role || "");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!name || !email || (userToEdit ? false : !password) || !role) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = userToEdit
        ? role === "Admin"
          ? `/api/auth/updateAdmin/${userToEdit._id}`
          : `/api/auth/update/${userToEdit._id}`
        : role === "Admin"
        ? "/api/auth/registerAdmin"
        : "/api/auth/register";

      const method = userToEdit ? "put" : "post";

      const response = await axios[method](`${BASE_URL}${endpoint}`, {
        name,
        email,
        ...(password ? { password } : {}),
        role,
      });

      setSuccess(response.data.message || "Operation successful");
      toast.success(response.data.message || "Operation successful");
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      if (method === "put") {
        onClose();
      }
      if (refreshUsers) refreshUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request");
      toast.error(err.response?.data?.message || "Failed to process request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-2">
        <div className="text-center mb-1 text-2xl">
          <Title text1={"ADD"} text2={"USER"} />
        </div>

        {isLoading && <p className="text-blue-500 mb-4">Loading...</p>}
        {/* Loading state */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border rounded-md w-full dark:bg-gray-700 dark:text-gray-300"
                placeholder="Enter name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 border rounded-md w-full dark:bg-gray-700 dark:text-gray-300"
                placeholder="Enter email"
              />
            </div>
          </div>
          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (leave empty if unchanged)"
                className="p-3 border rounded-md w-full dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="p-3 border rounded-md w-full dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-md text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading
                ? "Processing..."
                : userToEdit
                ? "Update User"
                : "Register User"}
            </button>
          </div>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {success && (
            <p className="text-green-500 mb-4  text-center">{success}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddUser;
