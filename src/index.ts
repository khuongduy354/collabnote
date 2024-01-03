import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SyncTextEmit, SyncTextReceive } from "./types/wsIO";
import { RoomDB } from "./types/roomPayload";
import { addRoom, getRoom } from "./helper/roomDB";
import { applyOT, opsToText } from "./helper/OTfunctions";

const PORT = 8000;

const app = express();
const httpserver = createServer(app);
const io = new Server(httpserver, {
  cors: {
    origin: "*",
  },
});
let roomDB: RoomDB = {};

// emit: roomNotify, syncTextResponse
// receive: join, syncText
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    roomDB = {};
  });
  //create room
  socket.on("join", (roomName: string, userName: string = "User ") => {
    socket.join(roomName);
    addRoom(roomDB, roomName);
    // io.to(roomName).emit("roomNotify", userName + " has joined the room");
  });

  // content changes
  socket.on("syncText", (roomName: string, _payload: SyncTextReceive) => {
    let payload = _payload as SyncTextEmit;
    payload.socketId = socket.id;
    let room = getRoom(roomDB, roomName);
    if (!room) return socket.in(roomName).emit("roomNotify", "Room not found");

    if (payload.rid <= room.synced_ops.length - 1) {
      for (let idx = 0; idx < room.synced_ops.length; idx++) {
        //revision id starts from 1;
        const serverRID = idx + 1;
        if (serverRID >= payload.rid) {
          payload.op = applyOT(payload.op, room.synced_ops[idx]);
        }
      }
    }
    room.synced_ops.push(payload.op);
    payload.rid = room.synced_ops.length;
    io.to(roomName).emit("syncTextResponse", payload);
  });
});

httpserver.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
