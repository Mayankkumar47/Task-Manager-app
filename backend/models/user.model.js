import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImageUrl: {
      type: String,
      default:
        process.env.DEFAULT_PROFILE_IMAGE_URL ||
        "https://res.cloudinary.com/dbli9atjv/image/upload/v1775673999/user_akkke4.png",
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

export default User
