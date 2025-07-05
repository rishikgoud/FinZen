import React, { useState } from "react";
import { motion } from "framer-motion";
import { fetchLoanEligibility } from "../../utils/api";
import { useGPayUser } from "../../context/GPayUserContext";

const LoanEligibilityDesk = () => {
  const { gpayUser, transactions } = useGPayUser();
  // Deduplicate transactions by paymentId
  const uniqueTransactions = Array.isArray(transactions)
    ? Object.values(
        transactions.reduce((acc, txn) => {
          if (txn && txn.paymentId && !acc[txn.paymentId]) acc[txn.paymentId] = txn;
          return acc;
        }, {})
      )
    : [];

  // Compute monthly income, expense, and savings
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const monthlyIncome = uniqueTransactions
    .filter(
      (txn) =>
        txn.type === "income" &&
        new Date(txn.date).getMonth() === thisMonth &&
        new Date(txn.date).getFullYear() === thisYear
    )
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const monthlyExpense = uniqueTransactions
    .filter(
      (txn) =>
        txn.type === "expense" &&
        new Date(txn.date).getMonth() === thisMonth &&
        new Date(txn.date).getFullYear() === thisYear
    )
    .reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const monthlySavings = monthlyIncome - monthlyExpense;

  const [income, setIncome] = useState(monthlyIncome ? monthlyIncome.toString() : "");
  const [employment, setEmployment] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update income field if monthlyIncome changes
  React.useEffect(() => {
    setIncome(monthlyIncome ? monthlyIncome.toString() : "");
  }, [monthlyIncome]);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    const res = await fetchLoanEligibility(income, employment, creditScore);
    if (res) setResult(res);
    else setError("Could not check eligibility. Try again.");
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg mb-8"
    >
      <h3 className="text-xl font-semibold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text mb-4">
        Loan Eligibility Desk
      </h3>
      <form className="space-y-4" onSubmit={handleCheck}>
        <input
          type="number"
          placeholder="Monthly Income (₹)"
          className="w-full p-3 rounded-lg bg-white/10 placeholder-white text-white focus:outline-none"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          required
        />
        <div className="flex gap-4">
          <div className="flex-1 bg-white/10 rounded-lg p-3 text-white/80">
            <div className="text-xs">Monthly Expense</div>
            <div className="font-bold text-lg">₹{monthlyExpense.toLocaleString()}</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-lg p-3 text-white/80">
            <div className="text-xs">Monthly Savings</div>
            <div className="font-bold text-lg">₹{monthlySavings.toLocaleString()}</div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Employment Type (e.g., salaried, self-employed)"
          className="w-full p-3 rounded-lg bg-white/10 placeholder-white text-white focus:outline-none"
          value={employment}
          onChange={(e) => setEmployment(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Credit Score"
          className="w-full p-3 rounded-lg bg-white/10 placeholder-white text-white focus:outline-none"
          value={creditScore}
          onChange={(e) => setCreditScore(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Eligibility"}
        </button>
      </form>
      {error && <p className="text-red-400 mt-2">{error}</p>}
      {result && (
        <div className="mt-6 p-4 rounded-lg bg-white/10 border border-white/10">
          <p className="text-white/80 mb-1 font-semibold">Result:</p>
          <p className={result.eligible ? "text-green-400" : "text-red-400"}>
            {result.reason}
          </p>
          {result.eligible && (
            <p className="text-white/70 mt-1">Max Loan Amount: <span className="font-bold">₹{result.maxLoan}</span></p>
          )}
          <p className="text-white/50 mt-2 text-xs">(Based on income: ₹{result.input.income}, employment: {result.input.employment}, credit score: {result.input.creditScore})</p>
        </div>
      )}
    </motion.div>
  );
};

export default LoanEligibilityDesk; 