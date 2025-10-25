import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-pink-400 to-purple-500 p-6 md:p-16 relative overflow-hidden">
      
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

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <FaPhone />, title: "Call Us", info: "+91 98765 43210", color: "yellow-400" },
            { icon: <FaEnvelope />, title: "Email", info: "info@civilconstruct.com", color: "green-400" },
            { icon: <FaMapMarkerAlt />, title: "Location", info: "123 Main Street, City, State", color: "blue-400" },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className={`bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 flex flex-col items-center text-center border-l-4 border-${item.color} transition-transform`}
            >
              <div className={`text-${item.color} text-4xl mb-4`}>{item.icon}</div>
              <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
              <p className="text-gray-700 mt-2">{item.info}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-3xl mx-auto"
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


