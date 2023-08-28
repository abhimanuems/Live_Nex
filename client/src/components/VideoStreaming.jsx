// Your React component
import React, { useEffect } from "react";
import io from "socket.io-client";

const App = () => {
  useEffect(() => {
    const socket = io("http://localhost:8200"); 

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const videoElement = document.getElementById("video");
      videoElement.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          socket.emit("videoFrame", event.data);
        }
      };

      mediaRecorder.start(1000); //

      return () => {
        socket.disconnect(); 
      };
    });
  }, []);

  return (
    <div>
      <button>button</button>
      <video id="video" autoPlay playsInline />
    </div>
  );
};

export default App;
