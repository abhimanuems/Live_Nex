import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const Webtrc = () => {
  const videoRef = useRef(null);
  let socket = io("ws://localhost:3100", {
    transports: ["websocket"],
  });
  const [stream, setStream] = useState(null);

  const handleStartRecording = () => {
    if (socket === undefined) {
      socket = io("ws://localhost:3100", {
        transports: ["websocket"],
      });
    }
    console.log(socket);
  };

  const recorderInit = () => {
    let liveStream = videoRef.current.captureStream(30);

    let mediaRecorder = new MediaRecorder(liveStream, {
      mimeType: "video/webm;codecs=h264",
      videoBitsPerSecond: 3 * 1024 * 1024,
    });

    console.log(mediaRecorder, mediaRecorder.ondataavailable);
    mediaRecorder.ondataavailable = (e) => {
      console.log("sending chunks", e.data, socket);
      socket.send(e.data);
    };
    mediaRecorder.start(1000);
  };

  const getStream = async () => {
    if (stream && videoRef.current) return;

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        height: { min: 720, max: 1280 },
        width: { min: 1080, max: 1920 },
        frameRate: { min: 15, ideal: 24, max: 30 },
        facingMode: "user",
      },
    });

    setStream(mediaStream);
    if (videoRef.current) {
      console.log(videoRef.current);
      videoRef.current.srcObject = mediaStream;
    }
  };

  useEffect(() => {
    getStream();
  }, [videoRef]);

  return (
  <div className="flex h-screen bg-gray-100">
    <div className="w-9/12">
      <div className="w-full h-96 mb-4 pt-20">
        <video
          className="w-full h-96 mb-4"
          ref={videoRef}
          autoPlay
          playsInline
          muted={true}
        />
      </div>
      <div className="flex justify-center mt-20">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-red-600"
          
        >
          End Call
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
         
        >
          Create Stream
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={recorderInit}
        >
          init
        </button>
        <button
          className="bg-yellow-600-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleStartRecording}
        >
          start recording
        </button>
      </div>
    </div>

    <div className="w-3/12 p-4 bg-white">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <div className="overflow-y-hidden h-96">
        <div className="flex items-center mb-2">
          <div>
            <p>Live viewer comments show up here</p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type your comment here..."
          className="w-full p-2 border border-gray-300 rounded-l-lg"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">
          Send
        </button>
      </div>
    </div>
  </div>
  )
};

export default Webtrc;
