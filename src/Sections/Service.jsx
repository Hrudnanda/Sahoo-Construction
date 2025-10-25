import React from "react";
import { motion } from "framer-motion";
import { FaHammer, FaToilet, FaTools, FaBuilding } from "react-icons/fa";

const services = [
  {
    icon: <FaBuilding className="text-yellow-400 w-12 h-12" />,
    title: "Construction",
    description: "We handle residential, commercial, and industrial construction projects from start to finish with top-notch quality.",
    points: [
      "Modern and durable designs",
      "Timely project delivery",
      "High-quality materials and craftsmanship",
    ],
  },
  {
    icon: <FaHammer className="text-yellow-400 w-12 h-12" />,
    title: "Renovation",
    description: "Professional renovation solutions to refresh and modernize spaces while maintaining structural integrity.",
    points: [
      "Interior & exterior renovation",
      "Custom solutions for every client",
      "Sustainable & eco-friendly materials",
    ],
  },
  {
    icon: <FaToilet className="text-yellow-400 w-12 h-12" />,
    title: "Plumbing",
    description: "Expert plumbing services for homes, offices, and industrial spaces, ensuring reliable water management.",
    points: [
      "Pipe installations and repairs",
      "Leak detection & prevention",
      "Water-efficient solutions",
    ],
  },
  {
    icon: <FaTools className="text-yellow-400 w-12 h-12" />,
    title: "Maintenance",
    description: "Regular maintenance and repair services to keep your infrastructure safe, functional, and long-lasting.",
    points: [
      "Electrical & plumbing maintenance",
      "Preventive inspections",
      "Emergency repair services",
    ],
  },
];

const Service = () => {
  return (
    <div className="py-24 bg-gray-900 text-white text-center">
      <h2 className="text-5xl font-bold text-yellow-400 mb-16">Our Services</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-6 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-black/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-yellow-500 flex flex-col items-center text-center"
          >
            {/* Icon */}
            <div className="mb-4">{service.icon}</div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">{service.title}</h3>

            {/* Description */}
            <p className="text-gray-300 mb-4">{service.description}</p>

            {/* Key Points */}
            <ul className="text-gray-200 mb-6 list-disc list-inside space-y-1">
              {service.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>

            {/* Learn More Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-yellow-300 transition"
            >
              Learn More
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Service;

