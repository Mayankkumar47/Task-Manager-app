import React, { useState } from "react"
import { ImAttachment } from "react-icons/im"
import { IoMdAdd } from "react-icons/io"
import { MdDelete } from "react-icons/md"
import { motion } from "framer-motion"

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("")

  const handleAddOption = () => {
    if (option.trim() !== "") {
      setAttachments([...attachments, option.trim()])
      setOption("")
    }
  }

  const handleDeleteOption = (index) => {
    const updatedArray = attachments.filter((_, i) => i !== index)
    setAttachments(updatedArray)
  }

  return (
    <div className="space-y-3">

      {/*  ATTACHMENT LIST */}
      {attachments.map((item, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl"
        >
          <div className="flex items-center gap-3 flex-1">
            <ImAttachment className="text-gray-400" />
            <p className="text-sm text-gray-700 truncate">{item}</p>
          </div>

          <button
            type="button"
            onClick={() => handleDeleteOption(index)}
            className="text-red-500 hover:text-red-700 transition"
          >
            <MdDelete className="text-lg" />
          </button>
        </motion.div>
      ))}

      {/*  INPUT */}
      <div className="flex items-center gap-3 mt-3">

        <div className="flex items-center gap-3 flex-1 border border-gray-200 px-3 py-2 rounded-xl bg-white focus-within:ring-2 focus-within:ring-blue-500">
          <ImAttachment className="text-gray-400" />

          <input
            type="text"
            placeholder="Paste attachment link..."
            value={option}
            onChange={(e) => setOption(e.target.value)}
            className="w-full text-sm outline-none bg-transparent"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleAddOption}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium shadow hover:bg-blue-700"
        >
          <IoMdAdd className="text-lg" />
          Add
        </motion.button>

      </div>
    </div>
  )
}

export default AddAttachmentsInput