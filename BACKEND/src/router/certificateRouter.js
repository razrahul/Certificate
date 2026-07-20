import express from "express";
import { searchCertificateTR, updateCertificateTR, logCertificatePrint } from "../controller/certificateController.js";
import { validateRequest } from "../middleware/validation.js";
import { searchCertificateSchema, updateCertificateSchema } from "../middleware/certificateValidation.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/searchTR", validateRequest(searchCertificateSchema), searchCertificateTR);
router.put("/updateTR", verifyToken, validateRequest(updateCertificateSchema), updateCertificateTR);
router.post("/print-log", verifyToken, validateRequest(searchCertificateSchema), logCertificatePrint);

export default router;
