import express from "express";
import {
  createEvent,
  getNearbyEvents,
  joinEvent,
  getUsersInEvent,
  updateParticipant,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/create", createEvent);
router.get("/nearby", getNearbyEvents);
router.post("/update-participant", updateParticipant);
router.post("/:eventId/join", joinEvent);
router.get("/:eventId/users", getUsersInEvent);

export default router;
