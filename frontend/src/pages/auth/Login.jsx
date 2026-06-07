import { useState } from "react"
import AuthLayout from "../../components/AuthLayout"
import { FaEyeSlash } from "react-icons/fa6"
import { FaEye, FaLock, FaEnvelope, FaCheckCircle } from "react-icons/fa"
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
import { playClick, playSuccess, playError } from "../../utils/soundEffects"

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
      playError()
      setError("Please enter a valid email")
      return
    }

    if (!password) {
      playError()
      setError("Password is required")
      return
    }

    setError(null)
    playClick()

    try {
      dispatch(signInStart())

      const res = await axiosInstance.post(
        "/auth/sign-in",
        { email, password },
        { withCredentials: true }
      )

      dispatch(signInSuccess(res.data))
      playSuccess()

      if (res.data.role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/user/dashboard")
      }

    } catch (err) {
      playError()
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
        className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden bg-slate-900/40 border-slate-800/80 w-full text-left"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Accent Glow Line at top of card */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />

        <div className="space-y-6">
          {/* Logo & Subtext */}
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl shadow shadow-[var(--color-glow)]">
                <FaCheckCircle className="text-2xl text-[var(--color-accent)] animate-pulse" />
              </div>
            </div>

            <h1 className="text-lg font-bold font-mono tracking-widest text-slate-100 uppercase">
              Sign In
            </h1>

            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-bold">
              Enter your credentials to access your workspace
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Email Address
              </label>
              <div className="flex items-center gap-3 border border-slate-800 px-3.5 py-2.5 rounded-xl bg-slate-950 focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)] transition-all">
                <FaEnvelope className="text-slate-600 text-xs" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={playClick}
                  className="w-full text-xs outline-none bg-transparent text-slate-100 placeholder-slate-600"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Password
              </label>
              <div className="flex items-center gap-3 border border-slate-800 px-3.5 py-2.5 rounded-xl bg-slate-950 focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)] transition-all relative">
                <FaLock className="text-slate-600 text-xs" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={playClick}
                  className="w-full text-xs outline-none bg-transparent text-slate-100 placeholder-slate-600 pr-8"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => { playClick(); setShowPassword(!showPassword); }}
                  className="absolute right-3.5 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-950/20 border border-red-900/30 text-red-400 text-[10px] font-mono p-3 rounded-xl">
                Error: {error}
              </div>
            )}

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 btn-primary rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>

          </form>

          {/* Footer */}
          <p className="text-xs text-center text-slate-500 font-sans">
            Don't have an account?{" "}
            <Link to="/signup" onClick={playClick} className="text-[var(--color-accent)] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

        </div>
      </motion.div>
    </AuthLayout>
  )
}

export default Login