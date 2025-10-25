import React from "react";
import photo from "../assets/my.jpg";
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

      {/* Main Section */}
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

      {/* Aim & Vision Section */}
      <div className="relative z-10 py-20 bg-gradient-to-b from-black/80 to-yellow-900/30 text-center">
        <h2 className="text-4xl font-bold mb-10 text-yellow-400">Our Aim & Vision</h2>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-10 px-6 max-w-6xl mx-auto">
          {/* Aim Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-black/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-yellow-500 w-full md:w-1/2"
          >
            <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Our Aim</h3>
            <p className="text-gray-200 leading-relaxed">
              Our primary goal is to deliver reliable and sustainable construction 
              services that bring innovative design and superior craftsmanship to every project. 
              We aim to create landmarks that inspire communities.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-black/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-yellow-500 w-full md:w-1/2"
          >
            <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Our Vision</h3>
            <p className="text-gray-200 leading-relaxed">
              We envision becoming a globally trusted name in construction, 
              known for innovation, sustainability, and a strong commitment to 
              engineering excellence and customer satisfaction.
            </p>
          </motion.div>
        </div>

        {/* Engineer Photo Card with bottom 1/4 shadow */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-20 flex justify-center"
        >
          <div className="relative group w-80 sm:w-96 md:w-[28rem] rounded-2xl overflow-hidden border border-yellow-500">
            <img
              src={photo}
              alt="Engineer"
              className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-transparent"></div>

            {/* Bottom text */}
            <div className="absolute bottom-5 left-0 right-0 text-center text-white px-4">
              <h4 className="text-xl md:text-2xl font-bold text-yellow-400 drop-shadow-md">
                Dedicated Engineers
              </h4>
              <p className="text-sm md:text-base text-gray-200 mt-2 drop-shadow-sm">
                Committed to quality, safety, and innovation at every step.
              </p>
            </div>

            {/* Bottom 1/4 shadow */}
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          </div>
        </motion.div>
      </div>

      {/* Floating Contact Button */}
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

