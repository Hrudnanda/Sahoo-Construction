// components/WhatsAppButton.jsx
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "9040475287"; // Replace with your number (include country code)
  const message = "Hello! I'm interested in your services."; // Optional default message

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
    
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0 }}
      whileHover={{ scale: 1.2 }}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
    >
      <FaWhatsapp className="text-2xl " />
      
    </motion.a>
  );
};

export default WhatsAppButton;
