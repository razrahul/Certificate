import express from "express";
import { searchCertificateTR, updateCertificateTR, logCertificatePrint } from "../controller/certificateController.js";
import { validateRequest } from "../middleware/validation.js";
import { searchCertificateSchema, updateCertificateSchema } from "../middleware/certificateValidation.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/searchTR", verifyToken, authorizeRoles("SUPERADMIN", "ADMIN", "OPERATOR"), validateRequest(searchCertificateSchema), searchCertificateTR);
router.put("/updateTR", verifyToken, authorizeRoles("SUPERADMIN", "ADMIN", "OPERATOR"), validateRequest(updateCertificateSchema), updateCertificateTR);
router.post("/print-log", verifyToken, authorizeRoles("SUPERADMIN", "ADMIN", "OPERATOR"), validateRequest(searchCertificateSchema), logCertificatePrint);

export default router;
