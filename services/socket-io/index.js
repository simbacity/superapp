import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());

const server = createServer(app);

const origin = process.env.APP_URL;
const io = new Server(server, {
  cors: {
    origin,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
});

server.listen(8080, () => {
  console.log("SERVER IS RUNNING");
  console.log(`cors origin: ${origin}`);
});
