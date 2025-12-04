import { createServer } from "node:http";
import { Server } from "socket.io";

const port = parseInt(process.env.SOCKET_PORT || "4000", 10);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
  connectTimeout: 45000,
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.emit("message", {
    text: "Welcome to Socket.IO!",
    timestamp: new Date().toISOString(),
  });

  socket.on("client-message", (data) => {
    console.log("Received from client:", data);
    socket.emit("message", {
      text: `Server received: "${data.text}"`,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Socket.IO server listening on port ${port}`);
});
