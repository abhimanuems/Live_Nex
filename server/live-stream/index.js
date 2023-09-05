import ffmpeg  from "fluent-ffmpeg";

// Input video file path
const inputFilePath = "temp_input.mp4";

// RTMP destination URL (e.g., your RTMP server URL)
const rtmpUrl = "rtmp://your-rtmp-server-url/app/stream-key";

// Create an FFmpeg command
const command = ffmpeg();

// Set the input file
command.input(inputFilePath);

// Set FFmpeg options (codec, bitrate, resolution, etc.)
command.videoCodec("libx264"); // Video codec
command.audioCodec("aac"); // Audio codec
command.format("flv"); // Output format for RTMP

// Set the RTMP destination URL
command.output(rtmpUrl);

// Run the FFmpeg command
command
  .on("end", () => {
    console.log("Conversion finished");
  })
  .on("error", (err) => {
    console.error("Error:", err);
  })
  .run();
