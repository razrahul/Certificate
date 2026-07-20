import express from "express";
import { healthCheack, registerUser, loginUser, changePassword, logoutUser, updateUserRole, adminResetPassword, getUserProfile } from "../controller/userController.js";
import { validateRequest, registerUserSchema, loginUserSchema, changePasswordSchema, updateUserRoleSchema, adminResetPasswordSchema } from "../middleware/validation.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/health", healthCheack);
router.post("/register", verifyToken, authorizeRoles("SUPERADMIN"), validateRequest(registerUserSchema), registerUser);
router.post("/login", validateRequest(loginUserSchema), loginUser);
router.post("/change-password", verifyToken, validateRequest(changePasswordSchema), changePassword);
router.post("/logout", verifyToken, logoutUser);
router.put("/update-role", verifyToken, authorizeRoles("SUPERADMIN"), validateRequest(updateUserRoleSchema), updateUserRole);
router.post("/admin-reset-password", verifyToken, authorizeRoles("SUPERADMIN"), validateRequest(adminResetPasswordSchema), adminResetPassword);
router.get("/profile", verifyToken, getUserProfile);

export default router;