import express from "express";
import { healthCheack,registerUser,loginUser } from "../controller/userController.js";

const router = express.Router();

router.get("/health", healthCheack);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;