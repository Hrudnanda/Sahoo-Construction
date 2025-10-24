import React from "react";
import { motion } from "framer-motion";
import { FaHardHat, FaTools, FaShieldAlt, FaProjectDiagram } from "react-icons/fa";

const Experience = () => {
  const experiences = [
    {
      icon: <FaProjectDiagram />,
      title: "Over 10 Years of Excellence",
      desc: "We have successfully completed over 150 projects including residential, commercial, and industrial constructions, delivering top-notch quality and reliability.",
      details: [
        "Commercial buildings, malls, and offices",
        "High-rise apartments and villas",
        "Industrial and infrastructure projects"
      ]
    },
    {
      icon: <FaShieldAlt />,
      title: "Safety is Our Priority",
      desc: "Strict adherence to safety protocols ensures the wellbeing of our team and clients, maintaining zero major incidents on all projects.",
      details: [
        "Regular safety audits and inspections",
        "Mandatory safety gear and training",
        "Emergency preparedness and risk management"
      ]
    },
    {
      icon: <FaTools />,
      title: "Skilled & Certified Workforce",
      desc: "Our engineers, architects, and construction staff are highly trained and certified to execute projects with precision and professionalism.",
      details: [
        "Licensed civil engineers and architects",
        "Expert craftsmen and technicians",
        "Continuous professional development programs"
      ]
    },
    {
      icon: <FaHardHat />,
      title: "Modern Equipment & Technology",
      desc: "We leverage state-of-the-art machinery and the latest construction technologies for efficient, safe, and high-quality execution.",
      details: [
        "Cranes, mixers, and advanced machinery",
        "3D modeling and BIM technology",
        "Sustainable and eco-friendly construction methods"
      ]
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
        Experience & Safety
      </motion.h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.3 }}
            className="bg-black/30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl relative flex flex-col items-start group cursor-pointer"
          >
            {/* Gradient Icon Circle */}
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ background: "linear-gradient(135deg, #facc15, #fb923c)" }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1.5 }}
            >
              <div className="text-3xl text-white">{exp.icon}</div>
            </motion.div>

            <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-400 transition">{exp.title}</h3>
            <p className="text-gray-200 mb-4 group-hover:text-gray-100 transition">{exp.desc}</p>

            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-1">
              {exp.details.map((detail, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="group-hover:text-gray-100"
                >
                  {detail}
                </motion.li>
              ))}
            </ul>

            {/* Subtle Glow */}
            <motion.div
              className="absolute inset-0 bg-yellow-400/10 rounded-3xl pointer-events-none"
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

export default Experience;
