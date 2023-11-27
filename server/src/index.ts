import { Server } from "socket.io";
import { createExpressApp } from "./lib/server";
import { createServer } from "http";
import { dbConnect } from "./lib/db";
import dotenv from "dotenv";

dotenv.config();
const FRONTEND_URL = process.env.CORS_ORIGIN_URL;

const app = createExpressApp();
const server = createServer(app);
const PORT = parseInt(process.env.PORT || "8090", 10);

const activeUsers = new Map(); // Map to store active users

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected!", socket.id);
  io.emit("system_active_users", Array.from(activeUsers.values()));

  socket.on("client_connect", ({ id, roomId }) => {
    try {
      // Store the user ID in the map when a client connects
      activeUsers.set(socket.id, { id, roomId });

      // Join the room
      socket.join(roomId);

      // Emit the updated list of active users to all clients
      io.emit("system_active_users", Array.from(activeUsers.values()));
    } catch (error) {
      console.error("Error occurred during room joining:", error);
      // Handle the error as needed
    }
  });

  // event for notification response for accept group
  socket.on("response_notification_accept", (data) => {
    socket.broadcast.emit("response_notification_accept", data);
    socket.broadcast.emit("response_notification_accept_group", data);
  });
  socket.on("response_notification_decline", (data) => {
    socket.broadcast.emit("response_notification_decline", data);
  });

  // event for notification sending to user
  socket.on("send_notification", (notification) => {
    socket.broadcast.emit("receive_notification", notification);
    socket.broadcast.emit("response_notification_delete_group", notification);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected!");

    // Remove the disconnected user from the map
    activeUsers.delete(socket.id);

    // Emit the updated list of active users to all clients
    io.emit("system_active_users", Array.from(activeUsers.values()));
  });

  // event for add friend request
  socket.on("add_friend", (data) => {
    socket.broadcast.emit("add_friend", data);
  });

  // event for accept friend request
  socket.on("accept_friend", (data) => {
    socket.broadcast.emit("accept_friend", data);
  });

  // event for decline friend request
  socket.on("decline_friend", (data) => {
    socket.broadcast.emit("decline_friend", data);
  });

  // event for join room
  socket.on("join_room", ({ roomId, name }) => {
    socket.join(roomId);
  });

  socket.on("chat_message", ({ roomId, message }) => {
    io.to(roomId).emit("message", message);
  });
  socket.on("typing_message", ({ roomId, name }) => {
    socket.broadcast.to(roomId).emit("typing_message", { roomId, name });
  });

  // event for leaving a room
  socket.on("leave_room", ({ roomId }) => {
    socket.leave(roomId);
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  dbConnect();
});
