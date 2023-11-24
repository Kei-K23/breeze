import { Server, Socket } from "socket.io";
import { createExpressApp } from "./lib/server";
import { createServer } from "http";
import { dbConnect } from "./lib/db";

const app = createExpressApp();
const server = createServer(app);
const PORT = parseInt(process.env.PORT || "8090", 10);
const activeUsers = new Map(); // Map to store active users
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected!", socket.id);

  io.emit("system_active_users", Array.from(activeUsers.values()));

  // event for tracking online and offline status
  socket.on("client_connect", (id) => {
    // Store the user ID in the map when a client connects
    activeUsers.set(socket.id, id);

    // Emit the updated list of active users to all clients
    io.emit("system_active_users", Array.from(activeUsers.values()));
  });
  // event for notification response for accept group
  socket.on("response_notification_accept", (data) => {
    io.emit("response_notification_accept", data);
  });
  socket.on("response_notification_decline", (data) => {
    socket.broadcast.emit("response_notification_decline", data);
  });

  // event for notification sending to user
  socket.on("send_notification", (notification) => {
    socket.broadcast.emit("receive_notification", notification);
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
    console.log(data);
    socket.broadcast.emit("add_friend", data);
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  dbConnect();
});
