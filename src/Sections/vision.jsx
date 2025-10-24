import React from "react";
import { motion } from "framer-motion";
import { FaBullseye, FaLightbulb } from "react-icons/fa";

const Vision = () => {
  const sections = [
    {
      icon: <FaBullseye />,
      title: "Our Aim",
      desc: "Deliver innovative, reliable, and sustainable construction solutions that exceed client expectations while prioritizing safety and precision."
    },
    {
      icon: <FaLightbulb />,
      title: "Our Vision",
      desc: "Become the trusted leader in construction, building durable and aesthetic structures that inspire confidence and excellence for generations."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-orange-900 to-yellow-800 text-white relative overflow-hidden">
      {/* Decorative Animated Circles */}
      <motion.div
        className="absolute w-72 h-72 bg-yellow-400/20 rounded-full top-[-80px] left-[-80px] blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-orange-500/20 rounded-full bottom-[-120px] right-[-100px] blur-3xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-bold mb-20 text-center text-yellow-400 drop-shadow-xl"
      >
        Aims & Vision
      </motion.h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.3 }}
            className="bg-black/30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl relative overflow-hidden group cursor-pointer"
          >
            {/* Gradient Circle Behind Icon */}
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ background: "linear-gradient(135deg, #facc15, #fb923c)" }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1.5 }}
            >
              <div className="text-3xl text-white">{section.icon}</div>
            </motion.div>

            <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-400 transition">{section.title}</h3>
            <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition">{section.desc}</p>

            {/* Subtle Glow */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-yellow-400/10 rounded-3xl pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.2 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Vision;

