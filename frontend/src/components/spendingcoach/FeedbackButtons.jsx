import React from "react";
import { motion } from "framer-motion";

const FeedbackButtons = () => {
  const handleClick = (type) => alert(`Feedback: ${type}`);
  return (
    <div className="flex gap-4 justify-center mt-4 mb-8">
      {["Helpful", "Confused", "Retry"].map((label, idx) => (
        <motion.button
          key={idx}
          whileTap={{ scale: 0.92 }}
          className={`px-4 py-2 rounded-full ${
            label === "Helpful"
              ? "bg-green-500"
              : label === "Confused"
              ? "bg-red-400"
              : "bg-gray-500"
          } text-white font-bold border-2 border-white/10 hover:opacity-90 transition`}
          onClick={() => handleClick(label)}
        >
          {label === "Retry" ? "🔄 Retry" : label === "Helpful" ? "👍 Helpful" : "😕 Confused"}
        </motion.button>
      ))}
    </div>
  );
};

export default FeedbackButtons;
