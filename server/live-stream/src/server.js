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
// import ffmpegProcess from "../services/ffmpeg.js"
const io = new Server(8200);
// ffmpeg.getAvailableFormats(function (err, formats) {
//   console.log("Available formats:");
//   console.dir(formats);
// });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("videoData", (data) => {
  });
  socket.on("dataFromClient", (data) => {
    console.log("Data received from client:", data);
  });
  socket.on("videoFrame", (data) => {
     handleVideoFrame(data);

  // try{
  //   const binaryData = Buffer.from((data), 'binary');
  //   const dataStream = new Readable();
  //   dataStream._read = () => {};
  //   if(data.length!=0){
  //       dataStream.push(binaryData);
  //   }
  //    const ffStreamYouTube = ffmpeg()
  //      .setFfmpegPath(ffmpegPath)
  //      .input(dataStream)
  //      .inputFormat("bin")
  //      .inputFPS(30)
  //      .videoCodec("libx264")
  //      .outputFormat("flv")
  //      .output(
  //        "rtmps://live-api-s.facebook.com:443/rtmp/122102324870032468?s_asc=1&s_bl=1&s_oil=2&s_psm=1&s_pub=1&s_sw=0&s_tids=1&s_vt=api-s&a=Abz0C_nXv4qTwEef"
  //      )

  //      .on("end", () => {
  //        console.log("YouTube streaming finished");
  //      })
  //      .on("error", (err) => {
  //        console.error("Error:", err.message);
  //      });

  //    ffStreamYouTube.run(); 
  //    ffStreamYouTube
  //      .on("start", (command) => {
  //        console.log("FFmpeg command:", command);
  //      })
  //      .on("stderr", (stderrLine) => {
  //        console.log("FFmpeg stderr:", stderrLine);
  //      });

  // }catch(error){
  //   console.log(error.message)
  //   throw error
  // }

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


const audioSource = "default"; // PulseAudio audio source
const videoSource = ":44";

function handleVideoFrame(data) {
  try {
    console.log("data length is ",data.length)
     let binaryData = Buffer.from(data, "binary");
   

    // Create a custom Readable stream for data chunking
  
    

    
    const dataStream = new Readable({
      read(size) {
        // Push chunks of data from the binary buffer
        let chunk = binaryData.slice(0, size);
        this.push(chunk);
        binaryData = binaryData.slice(size);
      },
    });

    const ffStreamYouTube = ffmpeg()
      .setFfmpegPath(ffmpegPath)
      .input(dataStream)
      .inputFormat("bin")
      .inputFPS(30)
      .videoCodec("libx264")
      .outputFormat("flv")
      .output(
        "rtmp://live-api-s.facebook.com:443/rtmp/122102324870032468?s_asc=1&s_bl=1&s_oil=2&s_psm=1&s_pub=1&s_sw=0&s_tids=1&s_vt=api-s&a=Abz0C_nXv4qTwEef"
      )
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

