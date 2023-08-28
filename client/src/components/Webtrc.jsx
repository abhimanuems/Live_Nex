import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

const WebRTCStreaming = () => {
  const localVideoRef = useRef(null); 
  useEffect(() => {
    let peerConnection;

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        localVideoRef.current.srcObject = stream; 
        
        const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

        
        
        mediaRecorder.start();
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            console.log("enter here");
            socket.emit("videoData", event.data);
          } else {
            console.log("no video data avaialable");
          }
        };
        peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
          ],
        });

        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

       
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", event.candidate);
          }
        };

         const dataToSend = {
           message: "Hello from the client!",
           timestamp: new Date().getTime(),
         };

         socket.emit("dataFromClient", dataToSend);
      
        socket.on("answer", async (answer) => {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        });

      
        socket.on("ice-candidate", (candidate) => {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        });

      
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

       
        socket.emit("offer", peerConnection.localDescription);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const socket = io("http://localhost:8200/");
    startWebcam();

    return () => {
      peerConnection.close();
      socket.close();
    };
  }, []);

  return (
    <div>
      <video id="localVideo" ref={localVideoRef} autoPlay></video>
    </div>
  );
};

export default WebRTCStreaming;
