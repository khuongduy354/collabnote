import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 8000;

const app = express();
const httpserver = createServer(app);
const io = new Server(httpserver, {
  cors: {
    origin: "*",
  },
});
// const rooms: Array<string> = [];

type LinePayload = {
  line: number;
  line_data: any;
};

io.on("connection", (socket) => {
  console.log("a user connected");

  //create room
  socket.on("join", (roomName: string, userName: string = "User ") => {
    // if (!rooms.includes(roomName)) rooms.push(roomName);
    socket.join(roomName);
    io.to(roomName).emit("roomNotify", userName + " has joined the room");
  });

  //notification

  // content changes
  socket.on("contentChanges", (roomName: string, data) => {
    console.log(data);
    socket.broadcast.to(roomName).emit("contentChanges", data);
  });
});

httpserver.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
