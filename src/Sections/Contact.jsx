import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaHardHat, FaTools, FaWater } from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  const contactItems = [
    { icon: <FaPhone />, title: "Call Us", info: "+91 98765 43210", color: "yellow-400" },
    { icon: <FaEnvelope />, title: "Email", info: "info@civilconstruct.com", color: "green-400" },
    { icon: <FaMapMarkerAlt />, title: "Location", info: "123 Main Street, City, State", color: "blue-400" },
    { icon: <FaHardHat />, title: "Construction Safety", info: "Certified Safety Experts", color: "red-400" },
    { icon: <FaTools />, title: "Quality Work", info: "Top-notch Construction Services", color: "purple-400" },
    { icon: <FaWater />, title: "Plumbing Services", info: "Reliable Plumbing Solutions", color: "teal-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-red-800 to-black p-6 md:p-16 relative overflow-hidden">
      
      {/* Top CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sticky top-4 mx-auto max-w-4xl rounded-full p-4 text-center shadow-2xl z-20 mb-10 backdrop-blur-sm bg-white/30"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-white text-yellow-500 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition-all"
        >
          Ready to Start a Project With Us?
        </motion.button>
      </motion.div>

      <div className="space-y-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Get in Touch
          </h1>
          <p className="text-white/90 mt-4 max-w-2xl mx-auto text-lg md:text-xl drop-shadow-md">
            We’d love to hear about your project. Reach out to us and let’s build something amazing together!
          </p>
        </motion.div>

        {/* Contact & Services Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08, y: -10, rotate: 1 }}
              className={`relative group bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center transition-all hover:shadow-3xl`}
            >
              {/* Colored circle behind icon */}
              <div className={`w-20 h-20 flex items-center justify-center rounded-full mb-4 bg-gradient-to-br from-${item.color} to-${item.color}/70 text-white text-4xl transform transition-all group-hover:scale-110`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-lg text-white mb-2 drop-shadow-md">{item.title}</h3>
              <p className="text-white/80">{item.info}</p>
              {/* Floating glow effect */}
              <span className={`absolute -bottom-4 w-24 h-1 bg-gradient-to-r from-${item.color} to-white opacity-40 rounded-full blur-xl`}></span>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Send Us a Message
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-yellow-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Message</label>
              <textarea
                placeholder="Your Message"
                className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:border-blue-400 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-all"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;



