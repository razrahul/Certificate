import express from "express";
import { getDashboardStats, getUpdateLogs, getPrintLogs } from "../controller/logController.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Only SUPERADMIN and ADMIN are allowed to view audit logs and stats
router.get("/stats", verifyToken, authorizeRoles("SUPERADMIN", "ADMIN"), getDashboardStats);
router.get("/updates", verifyToken, authorizeRoles("SUPERADMIN", "ADMIN"), getUpdateLogs);
router.get("/prints", verifyToken, authorizeRoles("SUPERADMIN", "ADMIN"), getPrintLogs);

export default router;
