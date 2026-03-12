import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import User from "./src/models/User.js";
import { createServer } from "http";
import { initSocket } from "./src/config/socket.js";

connectDB();

const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);
initSocket(httpServer);
console.log("SERVER STARTED");

app.get("/test-user", async (req, res) => {
  const user = await User.create({
    name: "Test",
  });

  res.json(user);
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
