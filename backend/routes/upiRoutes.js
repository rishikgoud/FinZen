import express from "express";
import authenticate from "../middleware/auth.js";
import fetch from "node-fetch";

const router = express.Router();

// User-specific data storage (in-memory for demo)
const userData = new Map();

// Finzen sync tracking
const syncStatus = new Map();
const lastSyncTime = new Map();

// Initialize user data with some sample transactions
const initializeUserData = (upiId) => {
  if (!userData.has(upiId)) {
    userData.set(upiId, {
      upiId: upiId,
      balance: 50000,
      name: upiId.split('@')[0] || "User",
      email: `${upiId.split('@')[0]}@finzen.com`,
      userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transactions: [
        {
          id: Date.now() + 1,
          title: "Swiggy Order",
          category: "Food",
          date: "2025-06-23",
          amount: -250,
          icon: "🍔",
          paymentId: `payment_${Date.now()}_1`,
          source: "local"
        },
        {
          id: Date.now() + 2,
          title: "Salary Credited",
          category: "Income",
          date: "2025-06-21",
          amount: 25000,
          icon: "💼",
          paymentId: `payment_${Date.now()}_2`,
          source: "local"
        },
        {
          id: Date.now() + 3,
          title: "Phone Recharge",
          category: "Bills",
          date: "2025-06-20",
          amount: -399,
          icon: "📱",
          paymentId: `payment_${Date.now()}_3`,
          source: "local"
        },
        {
          id: Date.now() + 4,
          title: "Movie Night",
          category: "Entertainment",
          date: "2025-06-19",
          amount: -600,
          icon: "🎬",
          paymentId: `payment_${Date.now()}_4`,
          source: "local"
        },
      ]
    });
  }
  return userData.get(upiId);
};

// Helper function to extract upiId from token
const extractUpiIdFromToken = (token) => {
  if (!token) return null;
  // Token format: mock_token_{upiId}_{timestamp}
  const parts = token.split('_');
  if (parts.length >= 3) {
    return parts[2]; // upiId is the third part
  }
  return null;
};

// Finzen API integration functions
const syncTransactionWithFinzen = async (user, transaction) => {
  try {
    console.log(`🔄 Syncing transaction ${transaction.paymentId} with Finzen for user ${user.upiId}`);
    
    const response = await fetch(`${process.env.FINZEN_API_URL}/transactions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FINZEN_API_KEY}`
      },
      body: JSON.stringify({
        user: { 
          userId: user.userId, 
          upiId: user.upiId, 
          name: user.name 
        },
        transaction: {
          paymentId: transaction.paymentId,
          title: transaction.title,
          category: transaction.category,
          amount: transaction.amount,
          type: transaction.amount > 0 ? "income" : "expense",
          date: transaction.date,
          description: transaction.title,
          senderUpi: transaction.amount < 0 ? user.upiId : "other@upi",
          receiverUpi: transaction.amount > 0 ? user.upiId : "other@upi"
        }
      })
    });

    if (response.ok) {
      console.log(`✅ Successfully synced transaction ${transaction.paymentId} with Finzen`);
      return true;
    } else {
      console.log(`❌ Failed to sync transaction ${transaction.paymentId} with Finzen: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`🚨 Error syncing transaction ${transaction.paymentId} with Finzen:`, error);
    return false;
  }
};

const fetchTransactionsFromFinzen = async (user) => {
  try {
    console.log(`🔄 Fetching transactions from Finzen for user ${user.upiId}`);
    
    const response = await fetch(`${process.env.FINZEN_API_URL}/transactions`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${process.env.FINZEN_API_KEY}`,
        'User-ID': user.userId,
        'UPI-ID': user.upiId
      }
    });

    if (response.ok) {
      const finzenTransactions = await response.json();
      console.log(`✅ Fetched ${finzenTransactions.length} transactions from Finzen for user ${user.upiId}`);
      return finzenTransactions;
    } else {
      console.log(`❌ Failed to fetch transactions from Finzen: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error(`🚨 Error fetching transactions from Finzen:`, error);
    return [];
  }
};

const syncAllUsersWithFinzen = async () => {
  console.log('🔄 Starting Finzen sync for all users...');
  
  for (const [upiId, user] of userData.entries()) {
    try {
      // Sync local transactions to Finzen
      for (const transaction of user.transactions) {
        if (transaction.source === 'local' && !transaction.syncedToFinzen) {
          const success = await syncTransactionWithFinzen(user, transaction);
          if (success) {
            transaction.syncedToFinzen = true;
          }
        }
      }
      
      // Fetch new transactions from Finzen
      const finzenTransactions = await fetchTransactionsFromFinzen(user);
      for (const finzenTx of finzenTransactions) {
        // Check if transaction already exists
        const existing = user.transactions.find(tx => tx.paymentId === finzenTx.paymentId);
        if (!existing) {
          const newTransaction = {
            id: Date.now() + Math.random(),
            title: finzenTx.title || finzenTx.description,
            category: finzenTx.category,
            date: finzenTx.date,
            amount: finzenTx.amount,
            icon: "💸",
            paymentId: finzenTx.paymentId,
            source: "finzen",
            syncedToFinzen: true
          };
          user.transactions.unshift(newTransaction);
          console.log(`✅ Synced new Finzen transaction: ${finzenTx.paymentId}`);
        }
      }
      
      lastSyncTime.set(upiId, new Date());
    } catch (error) {
      console.error(`🚨 Error syncing user ${upiId} with Finzen:`, error);
    }
  }
  
  console.log('✅ Finzen sync completed for all users');
};

// Start background sync (every 5 minutes)
if (process.env.FINZEN_SYNC_INTERVAL) {
  setInterval(syncAllUsersWithFinzen, parseInt(process.env.FINZEN_SYNC_INTERVAL));
  console.log(`🔄 Background Finzen sync started (interval: ${process.env.FINZEN_SYNC_INTERVAL}ms)`);
}

// POST /upi/auth - UPI authentication
router.post("/auth", (req, res) => {
  try {
    const { upiId, password } = req.body;
    
    // Mock authentication - accept any valid UPI ID format
    if (upiId && password && upiId.includes('@')) {
      const token = `mock_token_${upiId}_${Date.now()}`;
      
      // Initialize user data if not exists
      const userInfo = initializeUserData(upiId);
      
      res.json({ 
        token,
        user: {
          upiId: userInfo.upiId,
          name: userInfo.name,
          balance: userInfo.balance,
          userId: userInfo.userId
        }
      });
    } else {
      res.status(401).json({ message: "Invalid UPI ID or password" });
    }
  } catch (error) {
    console.error("Error in /upi/auth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /upi/me - Get current UPI user
router.get("/me", authenticate, (req, res) => {
  try {
    // Extract upiId from token
    const token = req.headers.authorization?.split(' ')[1];
    const upiId = extractUpiIdFromToken(token);
    
    if (!upiId) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    const userInfo = initializeUserData(upiId);
    res.json({
      upiId: userInfo.upiId,
      balance: userInfo.balance,
      name: userInfo.name,
      email: userInfo.email,
      userId: userInfo.userId,
      lastSync: lastSyncTime.get(upiId) || null
    });
  } catch (error) {
    console.error("Error in /upi/me:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /upi/transactions/:upiId - Get transactions for a UPI user (local only)
router.get("/transactions/:upiId", authenticate, (req, res) => {
  try {
    const { upiId } = req.params;
    
    // Verify that the requesting user can access this upiId's data
    const token = req.headers.authorization?.split(' ')[1];
    const requestingUpiId = extractUpiIdFromToken(token);
    
    if (!requestingUpiId || requestingUpiId !== upiId) {
      console.log(`🚨 Security Alert: User ${requestingUpiId} attempted to access data for ${upiId}`);
      return res.status(403).json({ message: "Access denied. You can only access your own data." });
    }
    
    const userInfo = initializeUserData(upiId);
    
    // Transform user-specific transactions to match expected format
    const transformedTransactions = userInfo.transactions.map(txn => ({
      _id: txn.id,
      title: txn.title,
      category: txn.category,
      date: txn.date,
      amount: txn.amount,
      icon: txn.icon,
      type: txn.amount > 0 ? "income" : "expense",
      senderUpiId: txn.amount < 0 ? upiId : "other@upi",
      receiverUpiId: txn.amount > 0 ? upiId : "other@upi",
      source: txn.source || "local",
      paymentId: txn.paymentId
    }));
    
    res.json(transformedTransactions);
  } catch (error) {
    console.error("Error in /upi/transactions/:upiId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /upi/transactions/:upiId/finzen - Get transactions with Finzen sync
router.get("/transactions/:upiId/finzen", authenticate, async (req, res) => {
  try {
    const { upiId } = req.params;
    
    // Verify that the requesting user can access this upiId's data
    const token = req.headers.authorization?.split(' ')[1];
    const requestingUpiId = extractUpiIdFromToken(token);
    
    if (!requestingUpiId || requestingUpiId !== upiId) {
      console.log(`🚨 Security Alert: User ${requestingUpiId} attempted to access data for ${upiId}`);
      return res.status(403).json({ message: "Access denied. You can only access your own data." });
    }
    
    const userInfo = initializeUserData(upiId);
    
    // Set sync status
    syncStatus.set(upiId, 'syncing');
    
    try {
      // Sync local transactions to Finzen
      for (const transaction of userInfo.transactions) {
        if (transaction.source === 'local' && !transaction.syncedToFinzen) {
          await syncTransactionWithFinzen(userInfo, transaction);
          transaction.syncedToFinzen = true;
        }
      }
      
      // Fetch new transactions from Finzen
      const finzenTransactions = await fetchTransactionsFromFinzen(userInfo);
      for (const finzenTx of finzenTransactions) {
        // Check if transaction already exists
        const existing = userInfo.transactions.find(tx => tx.paymentId === finzenTx.paymentId);
        if (!existing) {
          const newTransaction = {
            id: Date.now() + Math.random(),
            title: finzenTx.title || finzenTx.description,
            category: finzenTx.category,
            date: finzenTx.date,
            amount: finzenTx.amount,
            icon: "💸",
            paymentId: finzenTx.paymentId,
            source: "finzen",
            syncedToFinzen: true
          };
          userInfo.transactions.unshift(newTransaction);
          console.log(`✅ Synced new Finzen transaction: ${finzenTx.paymentId}`);
        }
      }
      
      lastSyncTime.set(upiId, new Date());
      syncStatus.set(upiId, 'completed');
      
    } catch (error) {
      console.error(`🚨 Error during Finzen sync for ${upiId}:`, error);
      syncStatus.set(upiId, 'failed');
    }
    
    // Transform user-specific transactions to match expected format
    const transformedTransactions = userInfo.transactions.map(txn => ({
      _id: txn.id,
      title: txn.title,
      category: txn.category,
      date: txn.date,
      amount: txn.amount,
      icon: txn.icon,
      type: txn.amount > 0 ? "income" : "expense",
      senderUpiId: txn.amount < 0 ? upiId : "other@upi",
      receiverUpiId: txn.amount > 0 ? upiId : "other@upi",
      source: txn.source || "local",
      paymentId: txn.paymentId
    }));
    
    res.json({
      transactions: transformedTransactions,
      syncStatus: syncStatus.get(upiId),
      lastSync: lastSyncTime.get(upiId)
    });
  } catch (error) {
    console.error("Error in /upi/transactions/:upiId/finzen:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /upi/transactions - Add new transaction
router.post("/transactions", authenticate, async (req, res) => {
  try {
    const { title, category, date, amount, icon, type } = req.body;
    
    // Extract upiId from token
    const token = req.headers.authorization?.split(' ')[1];
    const upiId = extractUpiIdFromToken(token);
    
    if (!upiId) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    const userInfo = initializeUserData(upiId);
    
    const newTransaction = {
      id: Date.now(),
      title: title || "Manual Transaction",
      category: category || "Other",
      date: date || new Date().toISOString().slice(0, 10),
      amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      icon: icon || "💸",
      paymentId: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: "local",
      syncedToFinzen: false
    };
    
    // Add to user-specific transactions
    userInfo.transactions.unshift(newTransaction);
    
    // Update user balance
    userInfo.balance += newTransaction.amount;
    
    // Sync with Finzen immediately
    try {
      await syncTransactionWithFinzen(userInfo, newTransaction);
      newTransaction.syncedToFinzen = true;
    } catch (error) {
      console.error(`🚨 Error syncing new transaction with Finzen:`, error);
    }
    
    // Transform the new transaction to match expected format
    const transformedTransaction = {
      _id: newTransaction.id,
      title: newTransaction.title,
      category: newTransaction.category,
      date: newTransaction.date,
      amount: newTransaction.amount,
      icon: newTransaction.icon,
      type: newTransaction.amount > 0 ? "income" : "expense",
      senderUpiId: newTransaction.amount < 0 ? upiId : "other@upi",
      receiverUpiId: newTransaction.amount > 0 ? upiId : "other@upi",
      source: newTransaction.source,
      paymentId: newTransaction.paymentId
    };
    
    res.status(201).json(transformedTransaction);
  } catch (error) {
    console.error("Error in POST /upi/transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /upi/send - Send money to another user
router.post("/send", authenticate, async (req, res) => {
  try {
    const { receiverUpi, amount, category, note, paymentId } = req.body;
    
    // Extract upiId from token
    const token = req.headers.authorization?.split(' ')[1];
    const senderUpi = extractUpiIdFromToken(token);
    
    if (!senderUpi) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    const sender = initializeUserData(senderUpi);
    const receiver = initializeUserData(receiverUpi);
    
    // Validate amount
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    
    // Check sender balance
    if (sender.balance < numAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    
    // Create transaction for sender (expense)
    const senderTx = {
      id: Date.now(),
      title: note || `Sent to ${receiverUpi}`,
      category: category || "Transfer",
      date: new Date().toISOString().slice(0, 10),
      amount: -numAmount,
      icon: "💸",
      paymentId: paymentId || `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: "local",
      syncedToFinzen: false
    };
    
    // Create transaction for receiver (income)
    const receiverTx = {
      id: Date.now() + 1,
      title: note || `Received from ${senderUpi}`,
      category: category || "Transfer",
      date: new Date().toISOString().slice(0, 10),
      amount: numAmount,
      icon: "💰",
      paymentId: paymentId || `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: "local",
      syncedToFinzen: false
    };
    
    // Update balances and transactions
    sender.balance -= numAmount;
    sender.transactions.unshift(senderTx);
    
    receiver.balance += numAmount;
    receiver.transactions.unshift(receiverTx);
    
    // Sync with Finzen
    try {
      await syncTransactionWithFinzen(sender, senderTx);
      await syncTransactionWithFinzen(receiver, receiverTx);
      senderTx.syncedToFinzen = true;
      receiverTx.syncedToFinzen = true;
    } catch (error) {
      console.error(`🚨 Error syncing transfer with Finzen:`, error);
    }
    
    res.json({
      message: "Transfer successful",
      senderBalance: sender.balance,
      receiverBalance: receiver.balance,
      transaction: {
        _id: senderTx.id,
        title: senderTx.title,
        category: senderTx.category,
        date: senderTx.date,
        amount: senderTx.amount,
        icon: senderTx.icon,
        type: "expense",
        senderUpiId: senderUpi,
        receiverUpiId: receiverUpi,
        source: senderTx.source,
        paymentId: senderTx.paymentId
      }
    });
  } catch (error) {
    console.error("Error in POST /upi/send:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /upi/balance/:upiId - Get user balance
router.get("/balance/:upiId", authenticate, (req, res) => {
  try {
    const { upiId } = req.params;
    
    // Verify that the requesting user can access this upiId's data
    const token = req.headers.authorization?.split(' ')[1];
    const requestingUpiId = extractUpiIdFromToken(token);
    
    if (!requestingUpiId || requestingUpiId !== upiId) {
      console.log(`🚨 Security Alert: User ${requestingUpiId} attempted to access balance for ${upiId}`);
      return res.status(403).json({ message: "Access denied. You can only access your own data." });
    }
    
    const userInfo = initializeUserData(upiId);
    res.json({ balance: userInfo.balance });
  } catch (error) {
    console.error("Error in /upi/balance/:upiId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /upi/sync-status/:upiId - Get sync status
router.get("/sync-status/:upiId", authenticate, (req, res) => {
  try {
    const { upiId } = req.params;
    
    // Verify that the requesting user can access this upiId's data
    const token = req.headers.authorization?.split(' ')[1];
    const requestingUpiId = extractUpiIdFromToken(token);
    
    if (!requestingUpiId || requestingUpiId !== upiId) {
      return res.status(403).json({ message: "Access denied. You can only access your own data." });
    }
    
    res.json({
      syncStatus: syncStatus.get(upiId) || 'idle',
      lastSync: lastSyncTime.get(upiId) || null
    });
  } catch (error) {
    console.error("Error in /upi/sync-status/:upiId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /upi/users - List all users (for debugging, remove in production)
router.get("/users", (req, res) => {
  try {
    const users = Array.from(userData.keys()).map(upiId => {
      const user = userData.get(upiId);
      return {
        upiId,
        name: user.name,
        balance: user.balance,
        transactionCount: user.transactions.length,
        lastSync: lastSyncTime.get(upiId) || null,
        syncStatus: syncStatus.get(upiId) || 'idle'
      };
    });
    res.json(users);
  } catch (error) {
    console.error("Error in /upi/users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router; 