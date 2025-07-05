import express from "express";
import { getTransactions, addTransaction, editTransaction, deleteTransaction } from "../controllers/mockTransactionController.js";

const router = express.Router();

// Mock transaction endpoints
router.get("/transactions", getTransactions);
router.post("/transactions", addTransaction);
router.put("/transactions/:id", editTransaction);
router.delete("/transactions/:id", deleteTransaction);

export default router; 