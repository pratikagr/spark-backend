import Admin from "../models/Admin.js";
import Match from "../models/Match.js";
import Event from "../models/Event.js";
import UserEvent from "../models/UserEvent.js";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { name, venueName, city, date, lat, lng } = req.body;
    const event = await Event.create({
      name,
      venueName,
      city,
      date,
      location: { type: "Point", coordinates: [lng, lat] },
    });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventUsers = async (req, res) => {
  try {
    const userEvents = await UserEvent.find({
      event: req.params.id,
      isTemp: false,
    }).populate("user");
    const users = userEvents.map((entry) => entry.user).filter(Boolean);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventMatches = async (req, res) => {
  try {
    // Get all users in this event
    const userEvents = await UserEvent.find({
      event: req.params.id,
      isTemp: false,
    });
    const userIds = userEvents.map((ue) => ue.user);

    // Find matches where both users are in this event
    const matches = await Match.find({
      users: { $elemMatch: { $in: userIds } },
    }).populate("users", "name age profilePic");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
