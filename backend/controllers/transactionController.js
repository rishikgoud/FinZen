import Transaction from "../models/Transaction.js";
import { io } from '../index.js';

// 🔹 1. Add New Transaction (income or expense)
export const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date, paymentId } = req.body;

    if (!type || !amount || !category || !paymentId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newTransaction = new Transaction({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      date: date || new Date(),
      paymentId,
    });

    await newTransaction.save();
    io.to(newTransaction.user.toString()).emit('transaction:new', newTransaction);

    res.status(201).json({
      message: "Transaction added successfully",
      newTransaction,
    });
  } catch (err) {
    console.error("❌ Error in addTransaction:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 2. Get Spending Breakdown (for chart)
export const getSpendingBreakdown = async (req, res) => {
  try {
    const userId = req.user.id;
    const filter = req.query.filter || "month";

    let startDate = new Date();
    if (filter === "day") {
      startDate.setDate(startDate.getDate() - 1);
    } else if (filter === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const transactions = await Transaction.find({
      user: userId,
      type: "expense",
      createdAt: { $gte: startDate },
    });

    const categoryTotals = {};
    transactions.forEach((tx) => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    });

    const breakdown = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));

    res.json(breakdown);
  } catch (err) {
    console.error("❌ Error in getSpendingBreakdown:", err);
    res.status(500).json({ message: "Server error" });
  }
};
//get income overview
export const getIncomeOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const filter = req.query.filter || "month";
    let startDate = new Date();

    if (filter === "day") {
      startDate.setDate(startDate.getDate() - 1);
    } else if (filter === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const incomeTransactions = await Transaction.find({
      user: userId,
      type: "income",
      createdAt: { $gte: startDate },
    });

    const categoryTotals = {};
    incomeTransactions.forEach((tx) => {
      const category = tx.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + tx.amount;
    });

    const breakdown = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));

    res.json(breakdown); // ✅ RETURN ARRAY
  } catch (err) {
    console.error("❌ Error fetching income data:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Add transaction from GPay mock API (no auth, user provided in body)
export const addFinzenTransaction = async (req, res) => {
  try {
    const { user, paymentId } = req.body;
    // Check if transaction already exists for this user and paymentId
    const existing = await Transaction.findOne({ paymentId, user });
    if (existing) {
      console.log("Skipping duplicate transaction:", paymentId);
      // Still emit for real-time updates/analytics
      io.to(user.toString()).emit('transaction:new', existing);
      return res.status(200).json({ message: "Already saved, skipping" });
    }
    // Do NOT save again
    // io.to(user.toString()).emit('transaction:new', req.body); // Optionally emit the incoming data
    return res.status(200).json({ message: "Received for analysis" });
  } catch (err) {
    console.error("❌ Error in addFinzenTransaction:", err);
    res.status(500).json({ message: "Server error" });
  }
};
