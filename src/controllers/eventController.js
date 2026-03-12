import Event from "../models/Events.js";
import UserEvent from "../models/UserEvent.js";
import mongoose from "mongoose";

export const createEvent = async (req, res) => {
  try {
    const { name, venueName, city, date, lat, lng } = req.body;

    const event = await Event.create({
      name,
      venueName,
      city,
      date,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNearbyEvents = async (req, res) => {
  try {
    const { lat, lng, radius = 1 } = req.query;

    const events = await Event.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radius * 1000,
        },
      },
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateParticipant = async (req, res) => {
  try {
    const { tempId, userId, eventId } = req.body;

    // Create real UserEvent entry
    await UserEvent.create({
      user: new mongoose.Types.ObjectId(userId),
      event: new mongoose.Types.ObjectId(eventId),
      isTemp: false,
    });

    res.json({ message: "Participant updated successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ message: "Already joined" });
    }
    console.log("UPDATE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    // Skip if temp ID
    if (userId.startsWith("temp_")) {
      return res.status(201).json({ message: "Temporary join acknowledged" });
    }

    const join = await UserEvent.create({
      user: userId,
      event: eventId,
    });

    res.status(201).json({
      message: "User joined event successfully",
      data: join,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User already joined this event",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getUsersInEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const userEvents = await UserEvent.find({
      event: eventId,
      isTemp: false,
    }).populate("user");

    const users = userEvents.map((entry) => entry.user).filter(Boolean);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
