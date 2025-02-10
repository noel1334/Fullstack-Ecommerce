import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Context/UserContext";

const ResetPassword = () => {
  const { token } = useParams();
  const { BASE_URL } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  // Verify token on component load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/auth/adminReset-password/${token}`
        );
        if (response.status === 200) {
          setIsTokenValid(true);
        }
      } catch (error) {
        setError("Invalid or expired reset token. Please request a new one.");
        setIsTokenValid(false);
      }
    };

    verifyToken();
  }, [token, BASE_URL]);

  const handleResendLink = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsResending(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/adminForgot-password`,
        {
          email,
        }
      );
      setSuccess(response.data.message || "Reset link sent successfully.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend reset link.");
      setSuccess("");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/AdminReset-password/${token}`,
        { password },
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess(response.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 shadow rounded">
          <h2 className="text-2xl font-bold text-center mb-6">
            Reset Password
          </h2>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <p>
            If your token is expired or invalid, please request a new password
            reset by entering your email address below.
          </p>
          <div className="mt-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
            />
          </div>
          <button
            onClick={handleResendLink}
            className={`w-full mt-4 py-2 px-4 rounded ${
              isResending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={isResending}
          >
            {isResending ? "Resending..." : "Resend Reset Link"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 shadow rounded">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
