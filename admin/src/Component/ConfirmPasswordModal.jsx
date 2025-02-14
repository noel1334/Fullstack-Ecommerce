import React, { useState } from "react";
import Title from "../Component/Title";

const ConfirmPasswordModal = ({ isVisible, onClose, onConfirm }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = () => {
    setLoading(true);
    try {
      onConfirm(password);
      setPassword("");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-white">
          <Title text1={"CONFIRM"} text2={"ACTION PASSWORD"} />
        </h2>
        <input
          type="password"
          placeholder="Enter Action Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 bg-transparent border rounded-md w-full mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={!password}
            className={`px-4 py-2 rounded-md text-white ${
              password
                ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPasswordModal;
