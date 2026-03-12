import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 60 * 1000),
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Match", matchSchema);
