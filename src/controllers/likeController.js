import User from "../models/User.js";
import Match from "../models/Match.js";

export const likeUser = async (req, res) => {
  try {
    const { currentUserId, targetUserId } = req.body;

    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ error: "Missing user ids" });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: "Cannot like yourself" });
    }

    const user = await User.findById(currentUserId);
    const target = await User.findById(targetUserId);

    if (!user || !target) {
      return res.status(404).json({ error: "User not found" });
    }

    // prevent duplicate likes
    if (user.likedUsers.includes(targetUserId)) {
      return res.json({ message: "Already liked" });
    }

    user.likedUsers.push(targetUserId);
    await user.save();

    if (target.likedUsers.includes(currentUserId)) {
      const match = await Match.create({
        users: [currentUserId, targetUserId],
      });

      return res.json({
        message: "It's a match!",
        matchId: match._id,
      });
    }

    res.json({ message: "User liked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
