import express from "express";
import { getCardsOverview } from "../controllers/cardController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.get("/cards", authenticate, getCardsOverview);

export default router;
