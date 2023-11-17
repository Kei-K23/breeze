import { Server, Socket } from "socket.io";
import { createExpressApp } from "./lib/server";
import { createServer } from "http";
import { dbConnect } from "./lib/db";

const app = createExpressApp();
const server = createServer(app);
const PORT = parseInt(process.env.PORT || "8090", 10);
const io = new Server(server);

io.on("connection", (socket: Socket): void => {
  console.log("Socket connected!", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected!");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  dbConnect();
});
