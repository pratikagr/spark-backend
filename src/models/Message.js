import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxLength: 500, // keep payloads small for bad networks
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// This index makes fetching chat history fast
messageSchema.index({ matchId: 1, timestamp: 1 });

export default mongoose.model("Message", messageSchema);
