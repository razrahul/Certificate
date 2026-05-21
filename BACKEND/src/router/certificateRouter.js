import express from "express";
import { searchCertificate } from "../controller/certificateController.js";

const router = express.Router();

router.post("/search", searchCertificate);

export default router;
