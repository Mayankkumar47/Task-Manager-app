import express from "express";
// FIX: Changed '../controllers/' to '../controller/' to match your exact folder name!
import { parseTaskAI } from "../controller/ai.controller.js";

const router = express.Router();

router.post("/parse", parseTaskAI);

export default router;