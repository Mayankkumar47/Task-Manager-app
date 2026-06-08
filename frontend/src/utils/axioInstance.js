import axios from "axios"
import { store } from "../redux/store"
import { signOutSuccess } from "../redux/slice/userSlice"

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

// Intercept 401 Unauthorized errors to clean up stale persisted Redux state
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(signOutSuccess())
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default axiosInstance