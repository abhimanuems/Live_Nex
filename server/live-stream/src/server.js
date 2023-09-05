import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import child_process from "child_process";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { Readable } from 'stream'; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
const app = express();
// import ffmpegProcess from "../services/ffmpeg.js";
const io = new Server(8200);
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("videoData", (data) => {
  });
  socket.on("dataFromClient", (data) => {
    console.log("Data received from client:", data);
  });
  socket.on("videoFrame", (data) => {
  try{
    const binaryData = Buffer.from((data), 'binary');
    const dataStream = new Readable();
    dataStream.push(binaryData);
      dataStream.push(null);
     const ffStreamYouTube = ffmpeg()
       .setFfmpegPath(ffmpegPath) 
       .input(dataStream)
       .inputFormat("rawvideo") 
       .inputFPS(30) 
       .videoCodec("libx264") 
       .output("rtmp://a.rtmp.youtube.com/live2/3f81-asd4-dt67-qpah-9wvy") 
       .on("end", () => {
         console.log("YouTube streaming finished");
       })
       .on("error", (err) => {
         console.error("Error:", err.message);
       });

     ffStreamYouTube.run(); 
     ffStreamYouTube
       .on("start", (command) => {
         console.log("FFmpeg command:", command);
       })
       .on("stderr", (stderrLine) => {
         console.log("FFmpeg stderr:", stderrLine);
       });
  }catch(error){
    console.log(error)
    console.log(error.message)
    throw error
  }

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
