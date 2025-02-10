import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const { BASE_URL } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (err) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // API call for registration
      const response = await axios.post(
        `${BASE_URL}/api/adminAuth/register`,
        formData
      );
      console.log("Registration successful:", response.data);

      // Navigate to login page after successful registration
      navigate("/login");
    } catch (err) {
      console.error("Error during registration:", err);

      // Clear form fields and set error message
      setFormData({ name: "", email: "", password: "" });
      setError(
        err.response?.data?.message || "An error occurred during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-[#f7f7f8c0]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <div className="flex gap-2 items-center border border-gray-300 rounded-lg px-2">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your password"
                required
              />
              <div
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="cursor-pointer"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>
          <div
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="max-w-max flex items-center justify-end mt-2 cursor-pointer"
          >
            <span className="text-sm text-blue-600">
              {passwordVisible ? "Hide password" : "Show password"}
            </span>
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition duration-300`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
          {err && (
            <p className="mt-2 text-sm text-red-500 text-center">{err}</p>
          )}
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
