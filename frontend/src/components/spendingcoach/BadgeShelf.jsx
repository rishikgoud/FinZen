import React from 'react';
import { motion } from 'framer-motion';

const BADGES = [
  { name: 'Bronze Streak', icon: '🔥', desc: '3-Day Budget Streak' },
  { name: 'Ice Your Spending', icon: '🧊', desc: 'No spending for 24h' },
  { name: 'Hero', icon: '🦸', desc: 'Spent 34% less on Swiggy' },
  { name: 'Villain', icon: '👹', desc: 'Overspending on gadgets' },
];

const BadgeShelf = ({ unlocked = [0, 1] }) => (
  <div className="w-full py-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-cyan-200 font-semibold">Badges & Streaks</span>
      <span className="text-yellow-400 animate-bounce">🏆</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {BADGES.map((b, i) => (
        <motion.div
          key={b.name}
          className={`rounded-xl p-4 flex flex-col items-center shadow-lg border-2 ${unlocked.includes(i) ? 'border-cyan-400 bg-cyan-900' : 'border-gray-700 bg-[#181f36] opacity-60'}`}
          whileHover={{ scale: 1.08 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
        >
          <span className="text-3xl mb-2">{b.icon}</span>
          <span className="text-cyan-100 font-bold text-sm mb-1">{b.name}</span>
          <span className="text-xs text-cyan-300 text-center">{b.desc}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

export default BadgeShelf; 