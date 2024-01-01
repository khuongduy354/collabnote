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
enum OperationType {
  Delete = 0,
  Insert = 1,
}
type Operation = {
  optype: OperationType;
  position: number;
  text?: string;
};
type SyncTextReceive = {
  op: Operation;
  rid: number;
};
type SyncTextEmit = {
  op: Operation;
  rid: number;
  socketId: string;
};
// emit: roomNotify, syncText
// receive: join, syncText
io.on("connection", (socket) => {
  console.log("a user connected");

  //create room
  socket.on("join", (roomName: string, userName: string = "User ") => {
    socket.join(roomName);
    io.to(roomName).emit("roomNotify", userName + " has joined the room");
  });

  // content changes
  socket.on("syncText", (roomName: string, data: SyncTextReceive) => {
    (data as SyncTextEmit).socketId = socket.id;
    socket.in(roomName).emit("syncText", data as SyncTextEmit);
  });
});

httpserver.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
