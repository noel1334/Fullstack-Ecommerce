import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  // const BASE_URL =
  //   process.env.REACT_APP_API_URL || "https://mystore-livid-omega.vercel.app/";

  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("admin")) || null
  );

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // Consolidated useEffect
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    const validateToken = async () => {
      try {
        await axios.get(`${BASE_URL}/api/auth/validate`, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Token validation failed:", error);

        if (userData) {
          handleLogout("admin");
        } else if (currentUser) {
          handleLogout("user");
        }
      }
    };

    // Validate token if user/admin exists
    if (currentUser || userData) {
      validateToken();
    }

    // Sync user/admin state with localStorage
    const handleLocalStorage = (key, value) => {
      if (value) {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.removeItem(key);
      }
    };

    handleLocalStorage("user", currentUser);
    handleLocalStorage("admin", userData);
  }, [BASE_URL, currentUser, userData]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
        withCredentials: true,
      });
      if (currentUser) {
        setCurrentUser(response.data);
      } else if (userData) {
        setUserData(response.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData, role) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login${role === "admin" ? "Admin" : ""}`,
        formData,
        { withCredentials: true }
      );

      const { authToken } = response.data;
      localStorage.setItem("authToken", authToken);

      if (role === "admin") {
        setUserData(response.data);
      } else {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      if (userData) {
        handleLogout("admin");
      } else if (currentUser) {
        handleLogout("user");
      }
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleLogout = (role) => {
    if (role === "admin") {
      setUserData(null);
      localStorage.removeItem("admin");
      window.location.href = "/login";
    } else if (role === "user") {
      setCurrentUser(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        userData,
        BASE_URL,
        login,
        logout,
        handleLinkClick,
        loading,
        fetchUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
