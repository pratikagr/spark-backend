// server/src/app.js
import swipeRoutes from "./routes/swipeRoutes.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import express from "express";
import cors from "cors";

const app = express();

app.use(cookieParser());

app.get("/admin/seed", async (req, res) => {
  try {
    const Admin = (await import("./src/models/Admin.js")).default;
    await Admin.create({ username: "admin", password: "password" });
    res.json({ message: "Admin created" });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow cloudflare tunnels + localhost
      if (
        !origin ||
        origin.includes("localhost") ||
        origin.includes("railway.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is working" });
});

// Routes
app.use("/api/swipe", swipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/events", eventRoutes);

export default app;
