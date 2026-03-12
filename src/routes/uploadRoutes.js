import express from "express";
import upload from "../middleware/upload.js";
import { uploadProfileImages } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "verification", maxCount: 1 },
  ]),
  uploadProfileImages,
);

export default router;
