import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import child_process from "child_process";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { Readable } from "stream";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
const app = express();

try {
  const inputVideoPath = "../video/video.mp4"; // Replace with the path to your input video file
  const outputVideoPath = "../videovideoconverted.avi"; // Replace with the desired output video file path

  const ffConvertVideo = ffmpeg()
    .setFfmpegPath(ffmpegPath)
    .input(inputVideoPath) // Specify the input video file path
    .inputFormat("mp4") // Specify the input format (e.g., mp4)
    .videoCodec("libx264") // Specify the video codec for output
    .outputFormat("flv")
    .output("rtmp://a.rtmp.youtube.com/live2/uhu2-vje2-3dau-c0xb-5e13")

    .on("end", () => {
      console.log("Video conversion finished");
    })
    .on("error", (err) => {
      console.error("Error:", err.message);
    });

  ffConvertVideo.run();
  ffConvertVideo
    .on("start", (command) => {
      console.log("FFmpeg command:", command);
    })
    .on("stderr", (stderrLine) => {
      console.log("FFmpeg stderr:", stderrLine);
    });
} catch (error) {
  console.log(error);
  console.log(error.message);
  throw error;
}
