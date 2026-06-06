import React from "react"
import { useRef, useState } from "react"
import { FaCamera } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { motion } from "framer-motion"

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setPreviewUrl(null)
  }

  const onChooseFile = () => {
    inputRef.current.click()
  }

  return (
    <div className="flex flex-col items-center">

      <div className="relative">

        {/*  Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer shadow-sm"
          onClick={onChooseFile}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaCamera className="text-3xl text-gray-400" />
          )}
        </motion.div>

        {/*  Action Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={image ? handleRemoveImage : onChooseFile}
          className={`absolute -bottom-2 -right-2 p-2 rounded-full shadow text-white
            ${image ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
          `}
        >
          {image ? <MdDelete size={14} /> : <FaCamera size={14} />}
        </motion.button>

      </div>

      {/*  Hidden Input */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

    </div>
  )
}

export default ProfilePhotoSelector