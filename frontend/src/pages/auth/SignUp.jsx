import { useState } from "react"
import AuthLayout from "../../components/AuthLayout"
import { FaEyeSlash } from "react-icons/fa6"
import { FaEye, FaUser, FaEnvelope, FaLock, FaUsers } from "react-icons/fa"
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
      return setError("Enter valid email")
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

      // Sends data straight using your configuration profile
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
        className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden bg-slate-900/40 border-slate-800/80 w-full text-left"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />

        <div className="space-y-5">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl shadow shadow-[var(--color-glow)]">
                <FaUsers className="text-xl text-[var(--color-accent)] animate-pulse" />
              </div>
            </div>
            <h1 className="text-lg font-bold font-mono tracking-widest text-slate-100 uppercase">
              Sign Up
            </h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-bold">
              Create your account to start managing tasks
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Avatar Picker */}
            <div className="flex justify-center pb-1">
              <ProfilePhotoSelector
                image={profilePic}
                setImage={setProfilePic}
              />
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Full Name
              </label>
              <div className="flex items-center gap-3 border border-slate-800 px-3.5 py-2.5 rounded-xl bg-slate-950 focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)] transition-all">
                <FaUser className="text-slate-600 text-xs" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={playClick}
                  className="w-full text-xs outline-none bg-transparent text-slate-100 placeholder-slate-600"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                Email Address
              </label>
              <div className="flex items-center gap-3 border border-slate-800 px-3.5 py-2.5 rounded-xl bg-slate-950 focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)] transition-all">
                <FaEnvelope className="text-slate-600 text-xs" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={playClick}
                  className="w-full text-xs outline-none bg-transparent text-slate-100 placeholder-slate-600"
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={playClick}
                  className="w-full text-xs outline-none bg-transparent text-slate-100 placeholder-slate-600 pr-8"
                />
                <button
                  type="button"
                  onClick={() => { playClick(); setShowPassword(!showPassword); }}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* Error Output */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-950/20 border border-red-900/30 text-red-400 text-[10px] font-mono p-3 rounded-xl"
              >
                Error: {error}
              </motion.div>
            )}

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 btn-primary rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </motion.button>
          </form>

          {/* Alternative Action */}
          <p className="text-xs text-center text-slate-500 font-sans">
            Already have an account?{" "}
            <Link to="/login" onClick={playClick} className="text-[var(--color-accent)] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  )
}

export default SignUp;