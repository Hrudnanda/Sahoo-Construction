import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHardHat, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-yellow-500/20 shadow-md text-white">
      <div className="flex justify-between items-center px-6 md:px-12 py-4">
        {/* Logo */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 text-2xl font-bold tracking-wide"
        >
          <FaHardHat className="text-yellow-400" />
          <span>Sahoo Construction</span>
        </motion.div>

        {/* Desktop Menu */}
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden md:flex gap-8 text-lg font-medium"
        >
          {["Home", "Projects", "Services", "About", "Contact"].map((item) => (
            <li
              key={item}
              className="hover:text-yellow-400 cursor-pointer transition duration-300"
            >
              {item}
            </li>
          ))}
        </motion.ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 border border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300"
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/90 text-center py-6 space-y-4 text-lg"
          >
            {["Home", "Projects", "Services", "About", "Contact"].map((item) => (
              <p
                key={item}
                className="hover:text-yellow-400 cursor-pointer transition duration-300"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
