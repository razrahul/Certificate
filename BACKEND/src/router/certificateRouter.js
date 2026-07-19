import express from "express";
import { searchCertificateTR, updateCertificateTR } from "../controller/certificateController.js";
import { validateRequest } from "../middleware/validation.js";
import { searchCertificateSchema, updateCertificateSchema } from "../middleware/certificateValidation.js";

const router = express.Router();

router.post("/searchTR", validateRequest(searchCertificateSchema), searchCertificateTR);
router.put("/updateTR", validateRequest(updateCertificateSchema), updateCertificateTR);

export default router;
