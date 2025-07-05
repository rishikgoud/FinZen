import React from 'react';
import { motion } from 'framer-motion';

const InsightCard = ({ aiResponse, loading }) => (
  <motion.div
    className="bg-[#121c30] border border-cyan-400/40 rounded-xl p-4 text-cyan-100 shadow-xl max-w-lg mx-auto mt-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {loading ? (
      <div className="flex items-center gap-2">
        <span className="animate-bounce text-cyan-300 text-lg">🤖</span>
        <span className="animate-pulse">Thinking...</span>
      </div>
    ) : (
      <div className="text-sm whitespace-pre-line">{aiResponse}</div>
    )}
  </motion.div>
);

export default InsightCard; 