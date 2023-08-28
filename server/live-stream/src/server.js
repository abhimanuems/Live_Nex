import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
const app = express();
const io = new Server(8200, {
  cors: {
    origin: "http://localhost:3000",
    methods: "*",
    credentials: true,
  },
});

// app.listen(process.env.PORTNUMBER, () =>
//   console.log(`server started at ${process.env.PORTNUMBER}`)
// );
// const server = http.createServer(app);
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("videoData", (data) => {
    console.log(data);
  });
  socket.on("dataFromClient", (data) => {
    console.log("Data received from client:", data);
  });
  socket.on("videoFrame", (data) => {
    console.log(data);
  });

  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    console.log("Received ice candidate:", data);
    socket.broadcast.emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
