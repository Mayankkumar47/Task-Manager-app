import React, { useRef, useState } from "react"
import { FaCamera } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { motion } from "framer-motion"
import { playClick } from "../utils/soundEffects"

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      playClick()
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    playClick()
    setImage(null)
    setPreviewUrl(null)
  }

  const onChooseFile = () => {
    playClick()
    inputRef.current.click()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        
        {/*  Avatar Node Frame */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="w-20 h-20 rounded-xl bg-slate-950 border-2 border-slate-900 hover:border-[var(--color-accent)]/30 overflow-hidden flex items-center justify-center cursor-pointer shadow shadow-[var(--color-glow)] transition-colors"
          onClick={onChooseFile}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaCamera className="text-xl text-slate-600 hover:text-slate-400 transition-colors" />
          )}
        </motion.div>

        {/*  Action Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={image ? handleRemoveImage : onChooseFile}
          className={`absolute -bottom-1.5 -right-1.5 p-2 rounded-lg shadow border cursor-pointer text-xs
            ${image 
              ? "bg-red-950/40 border-red-900/30 text-red-400 hover:bg-red-950/60" 
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30"}
          `}
        >
          {image ? <MdDelete size={12} /> : <FaCamera size={12} />}
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

export default ProfilePhotoSelector;