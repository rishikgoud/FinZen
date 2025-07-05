import React from "react";
import { motion } from "framer-motion";

const ExpenseBarChart = ({ data = [] }) => {
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="w-full max-w-xl bg-[#181f36] border border-white/10 rounded-2xl p-6 mb-8 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">
        7‑Day Expense Overview
      </h2>
      <div className="flex items-end justify-between gap-3 h-48">
        {data.map((d, i) => {
          const heightPercent = (d.amount / max) * 100;
          const barHeight = `${heightPercent * 1.1 + 20}px`;

          return (
            <motion.div
              key={d.day}
              initial={{ height: 0 }}
              animate={{ height: barHeight }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="flex flex-col items-center justify-end w-8 group"
            >
              <div
                className="w-6 rounded-t-lg bg-gradient-to-br from-red-400 to-pink-500 shadow-md group-hover:scale-105 transition-transform duration-200"
                style={{ height: barHeight }}
              ></div>
              <span className="mt-2 text-xs text-white font-mono">
                {d.day}
              </span>
              <span className="text-[10px] text-white/60 group-hover:text-white font-medium transition-colors">
                ₹{d.amount.toLocaleString()}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseBarChart;
