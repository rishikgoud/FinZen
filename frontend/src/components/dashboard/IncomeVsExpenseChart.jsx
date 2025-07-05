// src/components/Dashboard/IncomeVsExpenseChart.jsx
import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useGPayUser } from "../../context/GPayUserContext";

const FILTERS = [
  { key: 'day', label: 'Day', days: 1 },
  { key: 'week', label: 'Week', days: 7 },
  { key: 'month', label: 'Month', days: 30 },
];

const chartStyle = {
  background: "#181c2f",
  borderRadius: "1.5rem",
  padding: "2rem 1rem",
  minHeight: 400,
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 4px 32px rgba(0,0,0,0.1)",
};

const IncomeVsExpenseChart = () => {
  const { transactions } = useGPayUser();
  const [filter, setFilter] = useState("week");

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg text-center text-white/80">
        No transactions to visualize. Try switching filters or create a new GPay mock transaction.
      </div>
    );
  }

  // Parse and normalize
  const parsed = transactions
    .filter(txn => txn && txn.date)
    .map(txn => ({
      ...txn,
      date: new Date(txn.date),
      _day: new Date(txn.date).toLocaleDateString("en-IN", {
        month: "short", day: "numeric"
      })
    }));

  const now = new Date();
  const rangeDays = FILTERS.find(f => f.key === filter)?.days || 7;
  const datesArray = Array.from({ length: rangeDays }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (rangeDays - 1 - i));
    const label = date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    const income = parsed
      .filter(t => t._day === label && t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = parsed
      .filter(t => t._day === label && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { date: label, Income: income, Expense: expense };
  });

  return (
    <div style={chartStyle}>
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Income vs Expense</h3>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-green-400 text-black"
                  : "bg-transparent text-white/70 border border-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={datesArray}>
          <defs>
            <linearGradient id="greenGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff99" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#00ff99" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="redGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff4d4d" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ff4d4d" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{
              background: "#232946",
              border: "1px solid #00ff99",
              borderRadius: 12,
              color: "#fff",
            }}
            labelStyle={{ color: "#fff", fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ color: "#fff", fontSize: 14 }} />
          <Line
            type="monotone"
            dataKey="Income"
            stroke="#00ff99"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Expense"
            stroke="#ff4d4d"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeVsExpenseChart;
