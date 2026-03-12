import express from "express";
import { likeUser } from "../controllers/likeController.js";

const router = express.Router();

router.post("/", likeUser);

export default router;
