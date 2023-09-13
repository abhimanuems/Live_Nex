import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import child_process from "child_process";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { Readable } from 'stream'; 
import formatAsFLVPacket from '../src/services/convertingRTMP.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
const app = express();
const io = new Server(8200);

const desiredWidth = 640;
const desiredHeight = 480;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("videoData", (data) => {
  });
  socket.on("dataFromClient", (data) => {
    console.log("Data received from client:", data);
  });
    socket.on("videoFrame", (data) => {
      const formattedData = formatAsFLVPacket(data);
     
       handleVideoFrame(formattedData);
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



function handleVideoFrame(data) {
  try {
 
   const dataStream = new Readable({
     read(size) {
      
       if (data.length === 0) {
        console.log("eneterd at the zero size !")
        //  this.push(null); 
       } else {
         let chunk = data.slice(0, size);
         this.push(chunk);
         data = data.slice(size);
       }
     },
   });

    const ffStreamYouTube = ffmpeg()
      .setFfmpegPath(ffmpegPath)
      .input(dataStream)
      .inputFormat("bin")
      // .inputFPS(30)
      .videoFilters(`scale=${desiredWidth}:${desiredHeight}`)
      .videoCodec("libx264")
      .outputFormat("flv")
      .output("rtmp://a.rtmp.youtube.com/live2/2hfb-3dhu-89kq-cskw-2cqe")
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
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}


