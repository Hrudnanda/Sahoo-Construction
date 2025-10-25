import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const Whatsapp = () => {
  const phoneNumber = "YOUR_PHONE_NUMBER"; // Replace with your WhatsApp number
  const message = "Hello! I want to chat with you."; // Optional message
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
      animate={{
        y: [0, -10, 0], // Moves up 10px and back
      }}
      transition={{
        duration: 2, // 2 seconds for one loop
        repeat: Infinity, // Keep looping
        repeatType: "loop",
      }}
      whileHover={{ scale: 1.2 }} // Slightly enlarge on hover
    >
      <FaWhatsapp size={28} />
    </motion.a>
  );
};

export default Whatsapp;
