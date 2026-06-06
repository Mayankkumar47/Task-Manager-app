import { useState } from "react"
import AuthLayout from "../../components/AuthLayout"
import { FaEyeSlash, FaPeopleGroup } from "react-icons/fa6"
import { FaEye } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from "../../utils/helper"
import axiosInstance from "../../utils/axioInstance"
import { useDispatch, useSelector } from "react-redux"
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/slice/userSlice"
import { motion } from "framer-motion"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)

  const { loading } = useSelector((state) => state.user)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError("Please enter a valid email")
      return
    }

    if (!password) {
      setError("Password is required")
      return
    }

    setError(null)

    try {
      dispatch(signInStart())

      const res = await axiosInstance.post(
        "/auth/sign-in",
        { email, password },
        { withCredentials: true }
      )

      dispatch(signInSuccess(res.data))

      if (res.data.role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/user/dashboard")
      }

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login failed. Try again."

      setError(msg)
      dispatch(signInFailure(msg))
    }
  }

  return (
    <AuthLayout>
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Top bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

          <div className="p-8 space-y-6">

            {/* Logo */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaPeopleGroup className="text-3xl text-blue-600" />
                </div>
              </div>

              <h1 className="text-2xl font-bold mt-3 text-gray-800">
                TaskFlow
              </h1>

              <p className="text-sm text-gray-500">
                Manage your tasks efficiently
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-600">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              {/* Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
              >
                {loading ? "Signing in..." : "Login"}
              </motion.button>

            </form>

            {/* Footer */}
            <p className="text-sm text-center text-gray-500">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600 font-medium">
                Sign up
              </Link>
            </p>

          </div>
        </div>
      </motion.div>
    </AuthLayout>
  )
}

export default Login