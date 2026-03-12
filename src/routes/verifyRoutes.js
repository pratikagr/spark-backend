import express from "express";
import { verifyFace } from "../controllers/faceVerifyController.js";

const router = express.Router();

router.post("/", verifyFace);

export default router;
