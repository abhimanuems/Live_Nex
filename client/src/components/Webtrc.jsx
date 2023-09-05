import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

const WebRTCStreaming = () => {
  // const localVideoRef = useRef(null);
  // useEffect(() => {
  //   let peerConnection;

  //   const startWebcam = async () => {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: true,
  //         audio: false,
  //       });
  //       localVideoRef.current.srcObject = stream;

  //       const mediaRecorder = new MediaRecorder(stream, {
  //         mimeType: "video/webm",
  //       });

  //       mediaRecorder.start();
  //       mediaRecorder.ondataavailable = (event) => {
  //         if (event.data.size > 0) {
  //           console.log("enter here");
  //           socket.emit("videoData", event.data);
  //         } else {
  //           console.log("no video data avaialable");
  //         }
  //       };
  //       peerConnection = new RTCPeerConnection({
  //         iceServers: [
  //           { urls: "stun:stun.l.google.com:19302" },
  //           { urls: "stun:stun1.l.google.com:19302" },
  //           { urls: "stun:stun2.l.google.com:19302" },
  //         ],
  //       });

  //       stream.getTracks().forEach((track) => {
  //         peerConnection.addTrack(track, stream);
  //       });

  //       peerConnection.onicecandidate = (event) => {
  //         if (event.candidate) {
  //           socket.emit("ice-candidate", event.candidate);
  //         }
  //       };

  //       const dataToSend = {
  //         message: "Hello from the client!",
  //         timestamp: new Date().getTime(),
  //       };

  //       socket.emit("dataFromClient", dataToSend);

  //       socket.on("answer", async (answer) => {
  //         await peerConnection.setRemoteDescription(
  //           new RTCSessionDescription(answer)
  //         );
  //       });

  //       socket.on("ice-candidate", (candidate) => {
  //         peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  //       });

  //       const offer = await peerConnection.createOffer();
  //       await peerConnection.setLocalDescription(offer);

  //       socket.emit("offer", peerConnection.localDescription);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   const socket = io("http://localhost:8200/");
  //   startWebcam();

  //   return () => {
  //     peerConnection.close();
  //     socket.close();
  //   };
  // }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Video Frame */}
      <div className="w-9/12">
        {/* Video frame content */}
        {/* Replace with your video frame component */}
        <div className="bg-black w-full h-96 mb-4"></div>

        {/* End Call and Mute Buttons */}
        <div className="flex justify-center">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-red-600">
            End Call
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Mute
          </button>
        </div>
      </div>

      {/* Right Panel (Comment Section) */}
      <div className="w-3/12 p-4 bg-white">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {/* Comment section content */}
        {/* You can map through comments and display them here */}
        <div className="overflow-y-hidden h-96">
          {/* Individual comment */}
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-gray-400 mr-2"></div>
            <div>
              <p className="font-semibold">User Name</p>
              <p>Comment text goes here...</p>
            </div>
          </div>
          {/* Repeat for more comments */}
        </div>

        {/* Text Input Box */}
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
  );
}

export default WebRTCStreaming;
