// src/components/Dashboard/FinancialOverviewCards.jsx
import React from "react";
import { motion } from "framer-motion";
import { useGPayUser } from "../../context/GPayUserContext";
import { FaWallet, FaArrowUp, FaArrowDown, FaPiggyBank } from "react-icons/fa";

const FinancialOverviewCards = () => {
  const { gpayUser, transactions } = useGPayUser();

  // Fallback: If transactions is not an array, show error
  if (!Array.isArray(transactions)) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg text-center text-red-400">
        Unable to load transactions. Please ensure your GPay mock API returns an array from /upi/transactions/:upiId.<br/>
        If you have not created any transactions in the mock API, please do so first.
      </div>
    );
  }

  // Fallback: If no transactions, show prompt
  if (transactions.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg text-center text-white/80">
        No transactions found. Connect your GPay account and make a transaction to see your financial overview.
      </div>
    );
  }

  // Deduplicate transactions by paymentId
  const uniqueTransactions = Object.values(
    transactions.reduce((acc, txn) => {
      if (txn && txn.paymentId && !acc[txn.paymentId]) acc[txn.paymentId] = txn;
      return acc;
    }, {})
  );

  // Compute analytics
  const totalIncome = uniqueTransactions
    .filter((txn) => txn.type === "income")
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const totalExpense = uniqueTransactions
    .filter((txn) => txn.type === "expense")
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const balance = gpayUser?.balance ?? totalIncome - totalExpense;
  const savings = totalIncome - totalExpense;

  // Card data
  const cards = [
    {
      label: "Total Income",
      value: `₹${totalIncome.toLocaleString()}`,
      icon: <FaArrowDown className="text-green-400" />,
      gradient: "from-green-500 to-emerald-400",
      title: "Income",
    },
    {
      label: "Total Spend",
      value: `₹${totalExpense.toLocaleString()}`,
      icon: <FaArrowUp className="text-red-400" />,
      gradient: "from-red-500 to-pink-400",
      title: "Expense",
    },
    {
      label: "Balance",
      value: `₹${balance.toLocaleString()}`,
      icon: <FaWallet className="text-blue-400" />,
      gradient: "from-blue-500 to-cyan-400",
      title: "Balance",
    },
    {
      label: "Savings",
      value: `₹${savings.toLocaleString()}`,
      icon: <FaPiggyBank className="text-yellow-400" />,
      gradient: "from-yellow-400 to-lime-400",
      title: "Savings",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full min-w-0 overflow-x-auto">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          className={`rounded-xl p-4 sm:p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-[#1db954]/60 w-full min-w-0 bg-gradient-to-r ${card.gradient}`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full text-white text-3xl">
              {card.icon}
            </div>
            <div>
              <p className="text-sm uppercase text-white/80">{card.label}</p>
              <p className="text-lg font-semibold">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FinancialOverviewCards;
