import express from "express";
import { getUserProfile, updateUserProfile, changePassword } from "../controllers/userController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, updateUserProfile);
router.put("/change-password", authenticate, changePassword);

export default router;
