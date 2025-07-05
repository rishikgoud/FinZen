import React from "react";
import { motion } from "framer-motion";

const SavingsNudger = ({ goal = "Save ₹2000 this week", weeklySavings = 1500 }) => {
  const target = 2000;
  const percent = Math.min(100, Math.round((weeklySavings / target) * 100));

  return (
    <div className="w-full max-w-md bg-[#181f36] border border-white/10 rounded-2xl p-6 mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-white font-bold">Goal:</span>
        <span className="text-white text-sm">{goal}</span>
      </div>
      <div className="w-full h-5 bg-[#232946] rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-5 bg-green-400"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      <div className="flex justify-between text-xs text-white">
        <span>Saved: ₹{weeklySavings}</span>
        <span>{percent}%</span>
        <span>Target: ₹{target}</span>
      </div>
    </div>
  );
};

export default SavingsNudger;
