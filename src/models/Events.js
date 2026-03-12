import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    venueName: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true },
);

eventSchema.index({ location: "2dsphere" });

export default mongoose.model("Event", eventSchema);
