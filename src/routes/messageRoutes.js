import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

// send message
router.post("/", sendMessage);

// get chat history by matchId
router.get("/:matchId", getMessages);

export default router;
