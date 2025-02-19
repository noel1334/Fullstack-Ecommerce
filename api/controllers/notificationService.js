
import { Server } from "socket.io";

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  console.log("Socket.IO initialized.");
}

function sendNotification(notification) {
  if (io) {
    io.emit("new_notification", notification);
    console.log("Notification sent:", notification);
  } else {
    console.error(
      "Socket.IO not initialized.  Call initializeSocket() first."
    );
  }
}

export { initializeSocket, sendNotification };