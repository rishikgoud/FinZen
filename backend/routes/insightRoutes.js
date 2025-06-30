import express from "express";
import { getInsights, getSpendingCoachAdvice, getPortfolio, tradePortfolio, getLoanEligibility, getGoalBooster } from "../controllers/insightController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.get("/insights", authenticate, getInsights);
router.get("/spending-coach", authenticate, getSpendingCoachAdvice);
router.get("/portfolio", authenticate, getPortfolio);
router.post("/portfolio/trade", authenticate, tradePortfolio);
router.get("/loan-eligibility", authenticate, getLoanEligibility);
router.get("/goal-booster", authenticate, getGoalBooster);

export default router;
