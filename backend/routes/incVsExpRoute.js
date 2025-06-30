import express from "express";
import { getIncomeVsExpense } from "../controllers/incomevsexpense.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/income-vs-expense", authMiddleware, getIncomeVsExpense);

export default router;
