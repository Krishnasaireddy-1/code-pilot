const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  // Fetch and send all previous messages on connection
  try {
    const pastMessages = await prisma.message.findMany({
      orderBy: { timestamp: "asc" }
    });
    socket.emit("previousMessages", pastMessages);
  } catch (err) {
    console.error("Error fetching previous messages:", err);
  }

  // Listen for new message
  socket.on("sendMessage", async (data) => {
    const { text, senderId, receiverId } = data;
    console.log("Received message:", data);
    if (!text || !senderId || !receiverId) {
      console.warn("Invalid message data:", data);
      return;
    }
  
    try {
      const savedMessage = await prisma.message.create({
        data: {
          text,
          senderId,
          receiverId,
          timestamp: new Date()
        }
      });
  
      io.emit("receiveMessage", savedMessage);
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  });

  // Listen for real-time code sharing (optional feature)
  
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("codeUpdate", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
