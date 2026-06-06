import React from "react"
import { IoMdClose } from "react-icons/io"
import { motion, AnimatePresence } from "framer-motion"

const Modal = ({ children, isOpen, onClose, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl border border-gray-100"
          >

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {title}
              </h3>

              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition"
              >
                <IoMdClose className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-gray-700">
              {children}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
