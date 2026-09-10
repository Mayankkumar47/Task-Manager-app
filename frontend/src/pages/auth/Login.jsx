import { useState } from "react"
import AuthLayout from "../../components/AuthLayout"
import { FaEyeSlash } from "react-icons/fa6"
import { FaEye, FaLock, FaEnvelope } from "react-icons/fa"
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

  const handleQuickFill = () => {
    playClick()
    setEmail("guest@taskflow.io")
    setPassword("guestpasscode123")
  }

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
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black tracking-tight text-white">Welcome back</h2>
          <p className="text-sm text-slate-500 font-medium">Sign in to your TaskFlow workspace</p>
        </div>

        {/* Quick Demo Card */}
        <button
          type="button"
          onClick={handleQuickFill}
          className="w-full group relative flex items-start gap-3.5 p-3.5 rounded-xl border border-indigo-500/25 bg-indigo-500/8 hover:bg-indigo-500/15 hover:border-indigo-500/45 transition-all text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/25 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-indigo-300 text-xs font-bold">→</span>
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200 transition-colors">Try Free Demo Account</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Click to auto-fill guest credentials and explore the platform instantly
            </p>
          </div>
          <span className="absolute top-2.5 right-3 text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/15 border border-indigo-500/25 px-2 py-0.5 rounded-full uppercase tracking-wide">
            Free
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">or sign in manually</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 block tracking-wide">
              Email address
            </label>
            <div className="flex items-center gap-3 border border-white/[0.08] px-3.5 py-3 rounded-xl bg-white/[0.03] focus-within:border-indigo-500/60 focus-within:bg-indigo-500/5 transition-all">
              <FaEnvelope className="text-slate-600 text-xs shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={playClick}
                className="w-full text-sm outline-none bg-transparent text-slate-100 placeholder-slate-600"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 block tracking-wide">
              Password
            </label>
            <div className="flex items-center gap-3 border border-white/[0.08] px-3.5 py-3 rounded-xl bg-white/[0.03] focus-within:border-indigo-500/60 focus-within:bg-indigo-500/5 transition-all relative">
              <FaLock className="text-slate-600 text-xs shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={playClick}
                className="w-full text-sm outline-none bg-transparent text-slate-100 placeholder-slate-600 pr-8"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => { playClick(); setShowPassword(!showPassword) }}
                className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/8 border border-red-500/20 text-red-400 text-xs font-medium p-3 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.012 }}
            whileTap={{ scale: 0.988 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer mt-1"
          >
            {loading ? "Signing in…" : "Sign In"}
          </motion.button>

        </form>

        {/* Footer */}
        <p className="text-xs text-center text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" onClick={playClick} className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Create account →
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}

export default Login