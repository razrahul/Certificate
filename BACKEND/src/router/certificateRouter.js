import express from "express";
import { searchCertificateTR } from "../controller/certificateController.js";

const router = express.Router();

router.post("/searchTR", searchCertificateTR);

export default router;
