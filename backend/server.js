const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// To establish connection
io.on("connection", (socket) => {
  socket.on("send_msg", (data) => {
    socket?.broadcast?.emit("receive_msg", data);
  });

  socket.on("join_room", (data) => {
    socket.join(data?.roomId);

    // checking whether user has joined room successfully
    const rooms = io.sockets.adapter.rooms;
    if (rooms?.has(data?.roomId) && rooms?.get(data?.roomId)?.has(socket.id)) {
      socket.emit(
        "room_joining_msg",
        `Room ${data?.roomId} joined successfully!`
      );
    } else {
      socket.emit(
        "room_joining_msg",
        `Something went wrong while joining room ${data?.roomId}!`
      );
    }
  });
});

httpServer.listen(5000, () => {
  console.log("Server is up!");
});
