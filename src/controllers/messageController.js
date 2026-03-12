import Message from "../models/Message.js";
import Match from "../models/Match.js";

export const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.query.userId; // pass as query param for now

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    const isPartOfMatch = match.users.some(
      (id) => id.toString() === userId.toString(),
    );
    if (!isPartOfMatch) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const messages = await Message.find({ matchId })
      .sort({ timestamp: 1 })
      .lean();

    return res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { matchId, message, userId } = req.body; // userId from body

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    if (Date.now() > new Date(match.expiresAt).getTime()) {
      return res.status(403).json({ error: "Chat has expired" });
    }

    const isPartOfMatch = match.users.some(
      (id) => id.toString() === userId.toString(),
    );
    if (!isPartOfMatch) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const newMessage = await Message.create({
      matchId,
      senderId: userId,
      message,
      timestamp: Date.now(),
    });

    res.json({ success: true, message: newMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
