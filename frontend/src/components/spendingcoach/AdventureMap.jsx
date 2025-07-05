import React from 'react';
import { motion } from 'framer-motion';

const LEVELS = [
  { label: 'Setup', icon: '🛠️' },
  { label: 'Connect UPI', icon: '🏦' },
  { label: 'Set Goals', icon: '🎯' },
  { label: 'First Nudge', icon: '💡' },
  { label: 'Save ₹500', icon: '💰' },
  { label: 'Unlock Badge', icon: '🏅' },
];

const AdventureMap = ({ currentLevel = 2 }) => (
  <div className="w-full flex items-center justify-center py-4 overflow-x-auto">
    <div className="flex gap-6">
      {LEVELS.map((lvl, i) => (
        <motion.div
          key={lvl.label}
          className={`flex flex-col items-center relative ${i < LEVELS.length - 1 ? 'pr-8' : ''}`}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: i <= currentLevel ? 1.1 : 1, opacity: i <= currentLevel ? 1 : 0.5 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <div className={`w-14 h-14 flex items-center justify-center rounded-full text-3xl font-bold border-4 ${i <= currentLevel ? 'border-cyan-400 bg-cyan-900 shadow-[0_0_16px_#00ffd0aa]' : 'border-gray-700 bg-[#181f36]'}`}>{lvl.icon}</div>
          <span className={`mt-2 text-xs ${i <= currentLevel ? 'text-cyan-200 font-semibold' : 'text-gray-400'}`}>{lvl.label}</span>
          {i < LEVELS.length - 1 && (
            <div className={`absolute top-1/2 right-0 w-8 h-1 ${i < currentLevel ? 'bg-cyan-400' : 'bg-gray-700'} rounded-full -z-10`}></div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

export default AdventureMap; 