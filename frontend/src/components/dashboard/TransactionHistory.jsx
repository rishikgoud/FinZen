import React from "react";
import { motion } from "framer-motion";
import { useGPayUser } from "../../context/GPayUserContext";
import { useNavigate } from "react-router-dom";

const filters = ["All", "Income", "Expense"];

const TransactionHistory = ({ preview = false }) => {
  const { transactions } = useGPayUser();
  const [activeFilter, setActiveFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();

  if (!Array.isArray(transactions)) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg text-center text-red-400">
        Unable to load transactions. Please ensure your GPay mock API returns an array from /upi/transactions/:upiId.<br/>
        If you have not created any transactions in the mock API, please do so first.
      </div>
    );
  }

  // Filtered and searched transactions
  const filtered = transactions.filter((txn) => {
    const matchType =
      activeFilter === "All" ||
      (activeFilter === "Income" && txn.type === "income") ||
      (activeFilter === "Expense" && txn.type === "expense");
    const matchSearch =
      txn.title?.toLowerCase().includes(search.toLowerCase()) ||
      txn.category?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg relative"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
          Transactions
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-1 rounded-md bg-white/10 text-white placeholder-white/60 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1 rounded-full font-medium transition-all text-sm ${
              activeFilter === filter
                ? "bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white"
                : "bg-white/10 text-white/60 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      {/* Transaction Table */}
      <div className="overflow-x-auto max-h-[350px] scrollbar-thin scrollbar-thumb-[#1db954]/40 relative">
        {filtered.length === 0 ? (
          <p className="text-white text-center">No transactions found.</p>
        ) : (
          <table className="w-full text-white/90">
            <thead>
              <tr className="bg-white/10">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => (
                <tr
                  key={txn._id || txn.id}
                  className="hover:bg-white/20 transition border-b border-white/5"
                >
                  <td className="p-2 flex items-center gap-2">
                    <span className="text-xl">{txn.icon || "💸"}</span>
                    <span>{txn.title}</span>
                  </td>
                  <td className="p-2">{txn.category}</td>
                  <td className="p-2">{new Date(txn.date).toLocaleDateString()}</td>
                  <td
                    className={`p-2 text-right font-semibold ${
                      txn.type === "expense" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {txn.type === "expense" ? "-" : "+"}₹{Math.abs(txn.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionHistory;
