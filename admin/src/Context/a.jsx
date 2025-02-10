import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);

  // Setup Axios interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          const currentPath = window.location.pathname;
          if (currentPath !== "/login") {
            console.error("Session expired. Redirecting to login...");
            setCurrentUser(null); // Clear current user
            window.location.href = "/login"; // Redirect to login page
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const fetchAuthenticatedUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch authenticated user:",
        error.response?.data?.message || error.message
      );
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser); // Store the currentUser data in userData state
    } else {
      setUserData([]); // Reset userData when currentUser is null
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  const login = async (formData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      setCurrentUser(response.data);
      await fetchAuthenticatedUser();
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setCurrentUser(null);
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      window.location.href = "/login"; // Redirect to login
    }
  };

  return (
    <UserContext.Provider
      value={{ currentUser, userData, login, logout, loading }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
