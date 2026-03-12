import User from "../models/User.js";
import Match from "../models/Match.js";
import { getIO } from "../config/socket.js";

export const swipeUser = async (req, res) => {
  try {
    const { targetUserId, direction, currentUserId } = req.body;

    if (!targetUserId || !direction) {
      return res.status(400).json({ error: "Missing data" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ error: "User not found" });

    // prevent duplicate swipe
    if (
      currentUser.likedUsers.includes(targetUserId) ||
      currentUser.passedUsers.includes(targetUserId)
    ) {
      return res.json({ message: "Already swiped" });
    }

    // RIGHT SWIPE
    if (direction === "right") {
      console.log("CURRENT USER ID FROM BODY:", currentUserId);
      console.log("TARGET USER ID:", targetUserId);
      currentUser.likedUsers.push(targetUserId);
      await currentUser.save();

      const freshTargetUser = await User.findById(targetUserId);
      console.log("FRESH TARGET LIKED USERS:", freshTargetUser.likedUsers);
      console.log("CHECKING IF TARGET LIKED CURRENT:", currentUserId);

      // Use .some() instead of .includes() for ObjectId comparison
      const isMutual = targetUser.likedUsers.some(
        (id) => id.toString() === currentUserId.toString(),
      );

      console.log("IS MUTUAL:", isMutual);

      if (isMutual) {
        const match = await Match.create({
          users: [currentUserId, targetUserId],
        });
        currentUser.matches.push(match._id);
        targetUser.matches.push(match._id);
        await currentUser.save();
        await targetUser.save();

        const io = getIO();
        io.to(`user_${currentUserId}`).emit("matched", {
          matchId: match._id,
          matchedWith: {
            id: targetUser._id,
            name: targetUser.name,
          },
          expiresAt: match.expiresAt,
        });
        io.to(`user_${targetUserId}`).emit("matched", {
          matchId: match._id,
          matchedWith: {
            id: currentUser._id,
            name: currentUser.name,
          },
          expiresAt: match.expiresAt,
        });
        return res.json({
          match: true,
          matchId: match._id,
        });
      }
      return res.json({ match: false });
    }

    // LEFT SWIPE
    if (direction === "left") {
      currentUser.passedUsers.push(targetUserId);
      await currentUser.save();
      return res.json({ match: false });
    }

    res.status(400).json({ error: "Invalid direction" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
