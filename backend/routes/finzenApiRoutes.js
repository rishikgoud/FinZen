import express from "express";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { io } from '../index.js';

const router = express.Router();

// Middleware to validate Finzen API key
const validateFinzenApiKey = (req, res, next) => {
  const apiKey = req.headers.authorization?.split(' ')[1];
  
  if (!apiKey || apiKey !== process.env.FINZEN_API_KEY) {
    return res.status(401).json({ message: "Invalid API key" });
  }
  
  next();
};

// POST /api/v1/transactions - Receive transactions from GPay mock API
router.post("/transactions", validateFinzenApiKey, async (req, res) => {
  try {
    const { user, transaction } = req.body;
    
    if (!user || !transaction) {
      return res.status(400).json({ message: "Missing user or transaction data" });
    }
    
    console.log(`🔄 Received transaction from GPay mock API for user ${user.upiId}`);
    
    // Check if transaction already exists
    const existingTransaction = await Transaction.findOne({ 
      paymentId: transaction.paymentId,
      user: user.userId 
    });
    
    if (existingTransaction) {
      console.log(`✅ Transaction ${transaction.paymentId} already exists, skipping`);
      return res.status(200).json({ 
        message: "Transaction already exists",
        transaction: existingTransaction 
      });
    }
    
    // Find or create user
    let finzenUser = await User.findOne({ userId: user.userId });
    if (!finzenUser) {
      finzenUser = new User({
        userId: user.userId,
        upiId: user.upiId,
        name: user.name,
        email: `${user.upiId.split('@')[0]}@finzen.com`
      });
      await finzenUser.save();
      console.log(`✅ Created new Finzen user: ${user.upiId}`);
    }
    
    // Create new transaction
    const newTransaction = new Transaction({
      user: finzenUser._id,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date || new Date(),
      paymentId: transaction.paymentId,
      senderUpi: transaction.senderUpi,
      receiverUpi: transaction.receiverUpi,
      source: "gpay_mock"
    });
    
    await newTransaction.save();
    
    // Emit real-time update
    io.to(finzenUser._id.toString()).emit('transaction:new', newTransaction);
    
    console.log(`✅ Successfully saved transaction ${transaction.paymentId} for user ${user.upiId}`);
    
    res.status(201).json({
      message: "Transaction saved successfully",
      transaction: newTransaction
    });
    
  } catch (error) {
    console.error("❌ Error saving transaction from GPay mock API:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/v1/transactions - Get transactions for a specific user
router.get("/transactions", validateFinzenApiKey, async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const upiId = req.headers['upi-id'];
    
    if (!userId || !upiId) {
      return res.status(400).json({ message: "Missing User-ID or UPI-ID headers" });
    }
    
    console.log(`🔄 Fetching transactions for user ${upiId} (${userId})`);
    
    // Find user
    const user = await User.findOne({ userId, upiId });
    if (!user) {
      console.log(`❌ User not found: ${upiId}`);
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get user's transactions
    const transactions = await Transaction.find({ user: user._id })
      .sort({ date: -1 })
      .limit(100);
    
    console.log(`✅ Found ${transactions.length} transactions for user ${upiId}`);
    
    // Transform to match GPay mock API format
    const transformedTransactions = transactions.map(tx => ({
      paymentId: tx.paymentId,
      title: tx.description,
      category: tx.category,
      amount: tx.amount,
      type: tx.type,
      date: tx.date,
      senderUpi: tx.senderUpi,
      receiverUpi: tx.receiverUpi,
      source: tx.source || "finzen"
    }));
    
    res.json(transformedTransactions);
    
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/v1/users/:upiId - Get user profile
router.get("/users/:upiId", validateFinzenApiKey, async (req, res) => {
  try {
    const { upiId } = req.params;
    
    const user = await User.findOne({ upiId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get user's transaction count and total balance
    const transactions = await Transaction.find({ user: user._id });
    const totalIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    res.json({
      userId: user.userId,
      upiId: user.upiId,
      name: user.name,
      email: user.email,
      transactionCount: transactions.length,
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense
    });
    
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/v1/sync-status - Update sync status
router.post("/sync-status", validateFinzenApiKey, async (req, res) => {
  try {
    const { upiId, status, lastSync } = req.body;
    
    console.log(`🔄 Updated sync status for ${upiId}: ${status}`);
    
    // In a real implementation, you might want to store this in a database
    // For now, we'll just log it
    
    res.json({ 
      message: "Sync status updated",
      upiId,
      status,
      lastSync
    });
    
  } catch (error) {
    console.error("❌ Error updating sync status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/v1/health - Health check
router.get("/health", validateFinzenApiKey, (req, res) => {
  res.json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

export default router; 