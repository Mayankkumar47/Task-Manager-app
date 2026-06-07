import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { getChatMessages, postChatMessage } from "../controller/chat.controller.js"

const router = express.Router()

router.get("/", verifyToken, getChatMessages)
router.post("/", verifyToken, postChatMessage)

export default router
