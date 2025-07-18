import React, { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useGPayUser } from "../../context/GPayUserContext";
import { FaBriefcase, FaGift, FaChartLine } from "react-icons/fa";

// Customize colors and icons per category
const COLORS = ["#facc15", "#22c55e", "#818cf8", "#f97316", "#38bdf8", "#f472b6"];
const CATEGORY_ICONS = {
  Salary: <FaBriefcase />,
  Bonus: <FaGift />,
  Investment: <FaChartLine />,
};

const IncomeChart = () => {
  const { transactions } = useGPayUser();
  const [selectedRange, setSelectedRange] = useState("month");

  // Deduplicate transactions by paymentId
  const uniqueTransactions = Object.values(
    (Array.isArray(transactions) ? transactions : []).reduce((acc, txn) => {
      if (txn && txn.paymentId && !acc[txn.paymentId]) acc[txn.paymentId] = txn;
      return acc;
    }, {})
  );

  // Filter transactions by selected range (day/week/month)
  const now = new Date();
  let filteredTxns = uniqueTransactions.filter((txn) => txn.type === "income");
  if (selectedRange === "day") {
    filteredTxns = filteredTxns.filter(
      (txn) => new Date(txn.date).toDateString() === now.toDateString()
    );
  } else if (selectedRange === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    filteredTxns = filteredTxns.filter(
      (txn) => new Date(txn.date) >= weekAgo && new Date(txn.date) <= now
    );
  } else if (selectedRange === "month") {
    const monthAgo = new Date(now);
    monthAgo.setMonth(now.getMonth() - 1);
    filteredTxns = filteredTxns.filter(
      (txn) => new Date(txn.date) >= monthAgo && new Date(txn.date) <= now
    );
  }

  // Fallback: If no income transactions, show prompt
  if (filteredTxns.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg text-center text-white/80">
        No income data found for this period. Try a different range or add an income transaction.
      </div>
    );
  }

  // Compute income breakdown by category
  const breakdown = {};
  filteredTxns.forEach((txn) => {
    const cat = txn.category || "Other";
    if (!breakdown[cat]) breakdown[cat] = { name: cat, value: 0 };
    breakdown[cat].value += txn.amount || 0;
  });
  const chartData = Object.values(breakdown).map((item) => ({
    ...item,
    icon: CATEGORY_ICONS[item.name] || "💼",
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 shadow-lg w-full min-w-0 overflow-x-auto"
    >
      <div className="flex items-center justify-between mb-4 ">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-green-500 text-transparent bg-clip-text">
          Income Breakdown
        </h3>
        <div className="flex gap-2">
          {["day", "week", "month"].map((range) => (
            <button
              type="button"
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedRange === range
                  ? "bg-yellow-400 text-black"
                  : "bg-white/10 text-white/60"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 space-y-2">
        {chartData.map((entry, i) => (
          <div key={i} className="flex items-center gap-3 text-white/80">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-lg">{entry.icon}</span>
            <span className="font-medium">{entry.name}</span>
            <span className="ml-auto text-white font-semibold">
              ₹{entry.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default IncomeChart;
