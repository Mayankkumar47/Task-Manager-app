import axios from "axios"

// Falls back to your local Node server port if the environment variable is empty
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export default axiosInstance