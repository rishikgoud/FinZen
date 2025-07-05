import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const faceByMood = {
  "😄": "😄",
  "😐": "😐",
  "😬": "😬",
  "😢": "😢",
  default: "🤖",
};

function useTypewriter(text, loading) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    if (loading) return setDisplay("");
    let i = 0;
    const id = setInterval(() => {
      setDisplay(text.slice(0, i + 1));
      i++;
      if (i > text.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [text, loading]);
  return display;
}

const AIAvatar = ({ tip, loading, mood }) => {
  const face = faceByMood[mood] || faceByMood.default;
  const typedTip = useTypewriter(tip, loading);

  return (
    <motion.div
      className="fixed bottom-8 left-8 z-40 flex flex-col items-center"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="w-20 h-20 bg-[#181f36] border-2 border-white/20 rounded-full flex items-center justify-center text-5xl">
        {face}
      </div>
      <div className="mt-2 px-4 py-2 bg-[#232946] border border-white/10 rounded-xl text-white text-sm max-w-xs min-h-[48px]">
        {loading ? (
          <span className="animate-pulse text-gray-300">Thinking...</span>
        ) : (
          <span>{typedTip}</span>
        )}
      </div>
    </motion.div>
  );
};

export default AIAvatar;
