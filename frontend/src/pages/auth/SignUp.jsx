import { useState } from "react"
import AuthLayout from "../../components/AuthLayout"
import { FaEyeSlash, FaPeopleGroup } from "react-icons/fa6"
import { FaEye } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from "../../utils/helper"
import ProfilePhotoSelector from "../../components/ProfilePhotoSelector"
import axiosInstance from "../../utils/axioInstance" 
import uploadImage from "../../utils/uploadImage"
import { motion } from "framer-motion"

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

    if (!fullName) return setError("Name is required")
    if (!validateEmail(email)) return setError("Enter valid email")
    if (!password) return setError("Password is required")

    setError(null)

    try {
      setLoading(true)

      let profileImageUrl = ""

      if (profilePic) {
        const uploadRes = await uploadImage(profilePic)
        profileImageUrl = uploadRes.imageUrl || ""
      }

      // Sends data straight to port 3000 using your configuration profile
      await axiosInstance.post("http://localhost:3000/api/auth/sign-up", {
        name: fullName,
        email,
        password,
        profileImageUrl,
      })

      navigate("/login")

    } catch (err) {
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
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Accent Line */}
          <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

          <div className="p-8 space-y-6">
            {/* Logo and Header */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaPeopleGroup className="text-3xl text-blue-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mt-3 text-gray-800">
                Create Account
              </h1>
              <p className="text-sm text-gray-500">
                Start managing your tasks
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Picker */}
              <div className="flex justify-center">
                <ProfilePhotoSelector
                  image={profilePic}
                  setImage={setProfilePic}
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50/50 outline-none transition-all"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50/50 outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50/50 outline-none pr-10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Output Container */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-xl border border-red-100 font-medium"
                >
                  {error}
                </motion.div>
              )}

              {/* Action Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </motion.button>
            </form>

            {/* Alternative Action */}
            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </AuthLayout>
  )
}

export default SignUp