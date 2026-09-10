import { useState } from "react"
import AuthLayout from "../../components/AuthLayout"
import { FaEyeSlash } from "react-icons/fa6"
import { FaEye, FaUser, FaEnvelope, FaLock } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from "../../utils/helper"
import ProfilePhotoSelector from "../../components/ProfilePhotoSelector"
import axiosInstance from "../../utils/axioInstance"
import uploadImage from "../../utils/uploadImage"
import { motion } from "framer-motion"
import { playClick, playSuccess, playError } from "../../utils/soundEffects"

const SignUp = () => {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [profilePic, setProfilePic] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!fullName) {
      playError()
      return setError("Name is required")
    }
    if (!validateEmail(email)) {
      playError()
      return setError("Enter a valid email address")
    }
    if (!password) {
      playError()
      return setError("Password is required")
    }

    setError(null)
    playClick()

    try {
      setLoading(true)
      let profileImageUrl = ""

      if (profilePic) {
        const uploadRes = await uploadImage(profilePic)
        profileImageUrl = uploadRes.imageUrl || ""
      }

      await axiosInstance.post("/auth/sign-up", {
        name: fullName,
        email,
        password,
        profileImageUrl,
      })

      playSuccess()
      navigate("/login")

    } catch (err) {
      playError()
      const msg =
        err.response?.data?.message ||
        "Signup failed. Try again."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-5"
      >
        {/* Header */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black tracking-tight text-white">Create your account</h2>
          <p className="text-sm text-slate-500 font-medium">Join TaskFlow and start managing work smarter</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Avatar Picker */}
          <div className="flex justify-center py-1">
            <ProfilePhotoSelector
              image={profilePic}
              setImage={setProfilePic}
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 block tracking-wide">
              Full name
            </label>
            <div className="flex items-center gap-3 border border-white/[0.08] px-3.5 py-3 rounded-xl bg-white/[0.03] focus-within:border-indigo-500/60 focus-within:bg-indigo-500/5 transition-all">
              <FaUser className="text-slate-600 text-xs shrink-0" />
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onFocus={playClick}
                className="w-full text-sm outline-none bg-transparent text-slate-100 placeholder-slate-600"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 block tracking-wide">
              Email address
            </label>
            <div className="flex items-center gap-3 border border-white/[0.08] px-3.5 py-3 rounded-xl bg-white/[0.03] focus-within:border-indigo-500/60 focus-within:bg-indigo-500/5 transition-all">
              <FaEnvelope className="text-slate-600 text-xs shrink-0" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={playClick}
                className="w-full text-sm outline-none bg-transparent text-slate-100 placeholder-slate-600"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={playClick}
                className="w-full text-sm outline-none bg-transparent text-slate-100 placeholder-slate-600 pr-8"
              />
              <button
                type="button"
                onClick={() => { playClick(); setShowPassword(!showPassword) }}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
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
            {loading ? "Creating account…" : "Create Account"}
          </motion.button>

        </form>

        {/* Footer */}
        <p className="text-xs text-center text-slate-500">
          Already have an account?{" "}
          <Link to="/login" onClick={playClick} className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Sign in →
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}

export default SignUp