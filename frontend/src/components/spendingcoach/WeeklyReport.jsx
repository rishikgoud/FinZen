import React from "react";
import { motion } from "framer-motion";

const WeeklyReport = ({ transactions = [] }) => {
  const now = new Date();
  const weekTxns = transactions.filter(
    (t) =>
      t.date &&
      t.amount < 0 &&
      (now - new Date(t.date)) / (1000 * 60 * 60 * 24) < 7
  );
  const totals = {};
  weekTxns.forEach((t) => {
    totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount);
  });
  const sorted = Object.entries(totals).sort((a, b) => a[1] - b[1]);
  const hero = sorted[0] || ["Groceries", 0];
  const villain = sorted[sorted.length - 1] || ["Food Delivery", 0];

  return (
    <motion.div
      className="w-full max-w-md bg-[#181f36] border border-white/10 rounded-2xl p-6 mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <h3 className="text-white font-bold mb-2">Weekly Finance Report</h3>
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <span className="text-green-400 text-2xl">🏆</span>
          <span className="text-white text-sm">Hero: {hero[0]}</span>
          <span className="text-green-300 text-xs">₹{hero[1]}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-red-400 text-2xl">😈</span>
          <span className="text-white text-sm">Villain: {villain[0]}</span>
          <span className="text-red-300 text-xs">₹{villain[1]}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyReport;
