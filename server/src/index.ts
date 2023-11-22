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

  socket.on("response_notification", (data) => {
    io.emit("response_notification", data);
  });

  socket.on(
    "send_notification",
    (notification: {
      title: string;
      content: string;
      sourceIdToConfirm: string; /// confirmation id
      senderId: string;
      createdAt: Date;
      receiverId: string;
    }) => {
      console.log(notification);
      io.emit("receive_notification", notification);
    }
  );

  socket.on("disconnect", () => {
    console.log("Socket disconnected!");

    // Remove the disconnected user from the map
    activeUsers.delete(socket.id);

    // Emit the updated list of active users to all clients
    io.emit("system_active_users", Array.from(activeUsers.values()));
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  dbConnect();
});
