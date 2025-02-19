import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api/",
  baseURL: "https://mystore-livid-omega.vercel.app/api/",
  headers: {
    "Content-Type": "multipart/form-data", 
  },
  withCredentials: true, 
});

export default axiosInstance;
