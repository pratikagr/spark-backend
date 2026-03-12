import { Server } from "socket.io";
import Message from "../models/Message.js";
import Match from "../models/Match.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    // Critical for bad network at events
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ["polling"],
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins their match room
    socket.on("join_match", async ({ matchId, userId }) => {
      socket.join(`match_${matchId}`);
      console.log(`User ${userId} joined match ${matchId}`);
    });

    socket.on("join_user", ({ userId }) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined personal room`);
    });

    // Handle sending message
    socket.on("send_message", async ({ matchId, senderId, message }) => {
      try {
        // Check if match is still active (7 min check)
        const match = await Match.findById(matchId);
        if (!match || Date.now() > new Date(match.expiresAt).getTime()) {
          socket.emit("chat_ended", { matchId });
          return;
        }

        // Save message to DB
        const newMessage = await Message.create({
          matchId,
          senderId,
          message,
          timestamp: Date.now(),
        });

        // Broadcast to both users in the room
        socket.to(`match_${matchId}`).emit("receive_message", {
          matchId,
          senderId,
          message,
          timestamp: newMessage.timestamp,
        });
      } catch (err) {
        console.error("Message error:", err);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
