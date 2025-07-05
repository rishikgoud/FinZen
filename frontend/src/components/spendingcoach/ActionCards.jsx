import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ActionCards = ({ actions = [], onAct }) => {
  const [actedIdx, setActedIdx] = useState(null);
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide mt-6">
      {actions.map((a, i) => (
        <motion.div
          key={i}
          className={`min-w-[220px] bg-[#181f36] border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition-transform relative`}
          whileTap={{ scale: 0.95, rotate: i % 2 === 0 ? -5 : 5 }}
          onClick={() => {
            setActedIdx(i);
            onAct && onAct(a, i);
            setTimeout(() => setActedIdx(null), 1200);
          }}
        >
          <span className="text-2xl">{a.icon}</span>
          <span className="text-cyan-100 text-center">{a.text}</span>
          <button className="mt-2 px-3 py-1 bg-cyan-700 rounded-full text-xs text-white hover:bg-cyan-500 transition">Act</button>
          <AnimatePresence>
            {actedIdx === i && (
              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-300 text-2xl animate-bounce">🪙</span>
                <span className="text-green-300 text-xs mt-1 animate-fadein">+₹ Saved!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default ActionCards; 