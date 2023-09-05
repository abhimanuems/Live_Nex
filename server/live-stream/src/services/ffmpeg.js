// import child_process from "child_process";

// const streamToYouTube = (chunk, streamKey) => {
//   console.log("enter here");
//   // YouTube RTMP URL (update with your stream key)
//   const youtubeRtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;

//   // Define the ffmpeg command with the necessary arguments
//   const ffmpegArgs = [
//     "-re", // Read input at native frame rate
//     "-i",
//     `${chunk}`, // Input source (your video file or source)
//     "-f",
//     "flv", // Output format is FLV
//     "-c:v",
//     "libx264", // Video codec
//     "-pix_fmt",
//     "yuv420p", // Pixel format
//     "-c:a",
//     "aac", // Audio codec
//     "-ar",
//     "44100", // Audio sample rate
//     "-b:a",
//     "128k", // Audio bitrate
//     "-vb",
//     "400k", // Video bitrate
//     "-maxrate",
//     "3000k", // Max video bitrate
//     "-preset",
//     "ultrafast", // Preset for encoding speed
//     "-r",
//     "30", // Frame rate
//     "-g",
//     "30",
//     youtubeRtmpUrl, // YouTube RTMP URL
//   ];

//   //   // Spawn the ffmpeg process with the provided arguments
//   const ffmpeg_process = child_process.spawn("ffmpeg", ffmpegArgs);

//   return ffmpeg_process;
// };


// const ffmpegProcess = streamToYouTube(videoSource, youtubeStreamKey);

// // Handle the ffmpeg process as needed (e.g., listen for events)
// ffmpegProcess.on("exit", (code, signal) => {
//   console.log(`ffmpeg process exited with code ${code} and signal ${signal}`);
// });



// export default ffmpegProcess;