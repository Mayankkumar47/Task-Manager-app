import { useState } from "react"
import { IoMdAdd } from "react-icons/io"
import { MdDelete } from "react-icons/md"
import { motion } from "framer-motion"

const TodoListInput = ({ todoList = [], setTodoList }) => {
  const [option, setOption] = useState("")

  const handleAddOption = () => {
    if (option.trim() !== "") {
      setTodoList([...todoList, option.trim()])
      setOption("")
    }
  }

  const handleDeleteOption = (index) => {
    setTodoList(todoList.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">

      {/*  LIST */}
      {todoList.map((item, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.01 }}
          className="flex items-center justify-between bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl"
        >
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>

          <button
            onClick={() => handleDeleteOption(index)}
            className="text-red-500 hover:text-red-700 transition"
          >
            <MdDelete />
          </button>
        </motion.div>
      ))}

      {/*  INPUT */}
      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Add a new task..."
          value={option}
          onChange={(e) => setOption(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddOption()
          }}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddOption}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm shadow hover:bg-blue-700"
        >
          <IoMdAdd />
          Add
        </motion.button>

      </div>

    </div>
  )
}

export default TodoListInput