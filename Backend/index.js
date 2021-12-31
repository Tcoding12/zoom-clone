import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server);
let user = [];

const adduser = (userName, roomId) => {
  user.push({
    userName: userName,
    roomId: roomId,
  });
};

const leaveRoom = (userName) => {
  user = user.filter((user) => user.userName !== userName);
};
const getUser = (roomId) => {
  return user.filter((user) => user.roomId === roomId);
};
io.on("connection", (socket) => {
  console.log("Someone Connected");
  socket.on("join-room", ({ roomId, userName }) => {
    console.log("User Joined room");
    console.log(userName);
    console.log(roomId);
    socket.join(roomId);
    adduser(userName, roomId);
    socket.to(roomId).emit("userConnected", userName);

    io.to(roomId).emit("all-users", getUser(roomId));

    socket.on("disconnected", () => {
      console.log("disconnected");
      socket.leave(roomId);
      leaveRoom(userName);
      io.to(roomId).emit("all-users", getUser(roomId));
    });
  });
});
const port = 3001;
app.get("/", (req, res) => {
  res.send("hello  worlds");
});

server.listen(port, () => {
  console.log(`Zoom Api  Clone  localhost:3001`);
});
