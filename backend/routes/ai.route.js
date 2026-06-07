import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { parseTaskAI, chatAI } from "../controller/ai.controller.js";

const router = express.Router();

router.post("/parse", parseTaskAI);
router.post("/chat", verifyToken, chatAI);

export default router;