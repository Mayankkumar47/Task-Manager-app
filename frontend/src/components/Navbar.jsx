import React, { useState } from "react"
import { MdClose, MdMenu } from "react-icons/md"
import { motion, AnimatePresence } from "framer-motion"
import SideMenu from "./SideMenu"

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false)

  return (
    <>
      {/*  NAVBAR */}
      <div className="bg-white shadow-sm sticky top-0 z-30 px-6 py-3 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden transition"
            onClick={() => setOpenSideMenu(!openSideMenu)}
          >
            {openSideMenu ? (
              <MdClose className="text-2xl" />
            ) : (
              <MdMenu className="text-2xl" />
            )}
          </button>

          {/*  APP NAME */}
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 tracking-tight">
            TaskFlow
          </h2>
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Manage your tasks efficiently
          </span>
        </div>
      </div>

      {/*  MOBILE SIDEBAR WITH ANIMATION */}
      <AnimatePresence>
        {openSideMenu && (
          <motion.div
            className="fixed inset-0 z-40 flex lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpenSideMenu(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="relative z-50 w-72 h-full bg-white shadow-xl"
            >
              <button
                className="absolute top-4 right-4 p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
                onClick={() => setOpenSideMenu(false)}
              >
                <MdClose className="text-2xl" />
              </button>

              <div className="pt-16">
                <SideMenu activeMenu={activeMenu} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar