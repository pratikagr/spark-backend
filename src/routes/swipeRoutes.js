import express from "express";
import { swipeUser } from "../controllers/swipeController.js";

const router = express.Router();

router.post("/", swipeUser);

export default router;
