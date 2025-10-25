import React from "react";
import { motion } from "framer-motion";

// Import your images
import construction1 from "../assets/my.jpg";
import construction2 from "../assets/my.jpg";
import plumbing1 from "../assets/my.jpg";
import plumbing2 from "../assets/my.jpg";

const worksData = [
  {
    title: "Residential Construction",
    image: construction1,
  },
  {
    title: "Commercial Construction",
    image: construction2,
  },
  {
    title: "Plumbing Works",
    image: plumbing1,
  },
  {
    title: "Renovation Works",
    image: plumbing2,
  },
];

const Works = () => {
  return (
    <div className="py-16 px-6 md:px-16 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
        Our Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {worksData.map((work, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
          >
            <img
              src={work.image}
              alt={work.title}
              className="w-full h-48 object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="p-4 bg-white relative z-10">
              <h3 className="text-xl font-semibold">{work.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Works;
