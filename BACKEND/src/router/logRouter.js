import express from "express";
import { getDashboardStats, getUpdateLogs, getPrintLogs } from "../controller/logController.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Allowed roles for dashboard stats and audit logs
router.get("/stats", verifyToken, authorizeRoles("SUPERADMIN", "ADMIN", "OPERATOR"), getDashboardStats);
router.get("/updates", verifyToken, authorizeRoles("SUPERADMIN", "ADMIN", "OPERATOR"), getUpdateLogs);
router.get("/prints", verifyToken, authorizeRoles("SUPERADMIN", "ADMIN", "OPERATOR"), getPrintLogs);

export default router;
