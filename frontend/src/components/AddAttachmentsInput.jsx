import React, { useState } from "react"
import { ImAttachment } from "react-icons/im"
import { IoMdAdd } from "react-icons/io"
import { MdDelete } from "react-icons/md"
import { motion } from "framer-motion"
import { playClick } from "../utils/soundEffects"

const AddAttachmentsInput = ({ attachments = [], setAttachments }) => {
  const [option, setOption] = useState("")

  const handleAddOption = () => {
    if (option.trim() !== "") {
      playClick()
      setAttachments([...attachments, option.trim()])
      setOption("")
    }
  }

  const handleDeleteOption = (index) => {
    playClick()
    const updatedArray = attachments.filter((_, i) => i !== index)
    setAttachments(updatedArray)
  }

  return (
    <div className="space-y-3 text-left">
      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Relational Attachments</label>

      {/*  ATTACHMENT LIST */}
      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
        {attachments.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.005 }}
            className="flex items-center justify-between bg-slate-900/40 border border-slate-900 px-4 py-3 rounded-xl shadow-md"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <ImAttachment className="text-[var(--color-accent)] shrink-0 text-sm" />
              <p className="text-xs text-slate-300 truncate font-mono">{item}</p>
            </div>

            <button
              type="button"
              onClick={() => handleDeleteOption(index)}
              className="text-red-400 hover:text-red-500 transition cursor-pointer ml-3"
            >
              <MdDelete className="text-base" />
            </button>
          </motion.div>
        ))}
      </div>

      {/*  INPUT */}
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center gap-3 flex-1 border border-slate-800 px-3.5 py-2.5 rounded-xl bg-slate-950 focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)] transition-all">
          <ImAttachment className="text-slate-500" />
          <input
            type="text"
            placeholder="Paste system URL or hyperlink resource..."
            value={option}
            onChange={(e) => setOption(e.target.value)}
            className="w-full text-xs outline-none bg-transparent text-slate-100 placeholder-slate-600"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddOption();
              }
            }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleAddOption}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-[var(--color-accent)]/30 text-[var(--color-accent)] rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow cursor-pointer transition-all shrink-0"
        >
          <IoMdAdd className="text-base" />
          <span>Add</span>
        </motion.button>
      </div>
    </div>
  )
}

export default AddAttachmentsInput