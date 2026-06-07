import { useState } from "react"
import { IoMdAdd } from "react-icons/io"
import { MdDelete } from "react-icons/md"
import { motion } from "framer-motion"
import { playClick } from "../utils/soundEffects"

const TodoListInput = ({ todoList = [], setTodoList }) => {
  const [option, setOption] = useState("")

  const handleAddOption = () => {
    if (option.trim() !== "") {
      playClick()
      setTodoList([...todoList, option.trim()])
      setOption("")
    }
  }

  const handleDeleteOption = (index) => {
    playClick()
    setTodoList(todoList.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3 text-left">
      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Subtask Checklist Sequence</label>

      {/*  LIST */}
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
        {todoList.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.005 }}
            className="flex items-center justify-between bg-slate-900/40 border border-slate-900 px-4 py-3 rounded-xl shadow-md"
          >
            <p className="text-xs text-slate-200 flex items-center gap-2 font-sans">
              <span className="text-[10px] text-[var(--color-accent)] font-mono font-bold">
                {index < 9 ? `0${index + 1}` : index + 1}
              </span>
              {item}
            </p>

            <button
              type="button"
              onClick={() => handleDeleteOption(index)}
              className="text-red-400 hover:text-red-500 transition cursor-pointer"
            >
              <MdDelete className="text-base" />
            </button>
          </motion.div>
        ))}
      </div>

      {/*  INPUT */}
      <div className="flex gap-3 pt-1">
        <input
          type="text"
          placeholder="Append subtask sequence..."
          value={option}
          onChange={(e) => setOption(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddOption();
            }
          }}
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] rounded-xl outline-none transition"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleAddOption}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-[var(--color-accent)]/30 text-[var(--color-accent)] rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow cursor-pointer transition-all"
        >
          <IoMdAdd className="text-base" />
          <span>Add</span>
        </motion.button>
      </div>

    </div>
  )
}

export default TodoListInput