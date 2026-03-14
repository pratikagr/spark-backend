import express from "express";
import {
  adminLogin,
  getAllEvents,
  createEvent,
  deleteEvent,
  getEventUsers,
  getEventMatches,
} from "../controllers/adminController.js";
import { adminProtect } from "../middleware/adminProtect.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/events", adminProtect, getAllEvents);
router.post("/events/create", adminProtect, createEvent);
router.delete("/events/:id", adminProtect, deleteEvent);
router.get("/events/:id/users", adminProtect, getEventUsers);
router.get("/events/:id/matches", adminProtect, getEventMatches);

export default router;
