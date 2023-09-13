import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    let peerConnection;
    const socket = io("http://localhost:8200/");
    navigator.mediaDevices.getUserMedia({ video: true,audio:true }).then((stream) => {
      const videoElement = document.getElementById("video");
      videoElement.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log(event.data)
          socket.emit("videoFrame", event.data);
        }
      };

      mediaRecorder.start(1000);
      peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
      });
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", event.candidate);
        }
      };
      socket.on("answer", async (answer) => {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      });
      socket.on("ice-candidate", (candidate) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      });

      return () => {
        socket.disconnect();
      };
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-9/12">
        <div className=" w-full h-96 mb-4 pt-20 ">
          <video
            className=" w-full h-96 mb-4"
            id="video"
            autoPlay
            playsInline
          />
        </div>
        <div className="flex justify-center mt-20">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-red-600 "
            onClick={() => {
            
              navigate("/");
            }}
          >
            End Call
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Mute
          </button>
        </div>
      </div>

      <div className="w-3/12 p-4 bg-white">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <div className="overflow-y-hidden h-96">
          <div className="flex items-center mb-2">
            <div>
              <p>Live viewer comments show up here </p>
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
  );
};

export default App;
