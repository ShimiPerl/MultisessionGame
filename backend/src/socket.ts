import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001", "*"],
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.id);
    });
  });

  return io;
}

export function getIo(): Server {
  if (!io) {
    throw new Error(
      "Socket.io not initialized. Call initSocket(httpServer) first."
    );
  }
  return io;
}
