import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
    },

    bio: {
      type: String,
      maxlength: 300,
    },

    profilePic: {
      type: String,
      default: "",
    },

    verificationImage: {
      type: String,
    },

    likedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    passedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
