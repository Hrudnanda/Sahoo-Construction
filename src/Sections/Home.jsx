import React from "react";
import { motion, useAnimation } from "framer-motion";
import { FaHardHat, FaPhoneAlt } from "react-icons/fa";

const gradientVariants = {
  animate: {
    background: [
      "linear-gradient(135deg, #1a1a1a, #4b0000, #ff9900)",
      "linear-gradient(135deg, #0d0d0d, #661a00, #ffcc33)",
      "linear-gradient(135deg, #111111, #993300, #ffcc66)",
    ],
    transition: {
      duration: 15,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "linear",
    },
  },
};

const Home = () => {
  const controls = useAnimation();
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        variants={gradientVariants}
        animate="animate"
        className="absolute inset-0 z-0"
      >
        <img
          src="https://cdn.pixabay.com/photo/2017/08/10/03/40/construction-2617721_1280.jpg"
          alt="Construction Site"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <FaHardHat className="text-yellow-400 text-6xl mb-6 drop-shadow-lg" />

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-xl">
            Building <span className="text-yellow-400">Dreams</span> with Strength & Precision
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lg md:text-xl text-gray-100 max-w-2xl mb-10 leading-relaxed"
          >
            At <span className="text-yellow-300 font-semibold">Sahoo Construction</span>, 
            we craft structures that embody durability, innovation, and timeless design.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-300 transition-all"
          >
            Get a Free Quote
          </motion.button>
        </motion.div>
      </div>

      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 w-full flex justify-center z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-black/60 border border-yellow-400 px-6 py-2 rounded-full text-yellow-300 font-semibold shadow-md hover:bg-yellow-400 hover:text-black transition"
        >
          <FaPhoneAlt /> Contact Us Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;
