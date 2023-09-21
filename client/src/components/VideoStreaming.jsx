import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BsFillMicMuteFill, BsCameraVideoOffFill } from "react-icons/bs";
import { AiFillVideoCamera, AiFillCloseCircle } from "react-icons/ai";
import { MdScreenShare } from "react-icons/md";
import { GoUnmute } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  useFacebookGetCommentsMutation,
  useYoutubeCommentsMutation,
} from "../slices/userApiSlice.js";
import { useDispatch } from "react-redux";
import {clearRTMPURLS} from "../slices/userDetails.js"

const VideoStreaming = () => {
  const videoRef = useRef(null);
  const intervalIdRef = useRef(null);
  const [fbcomments] = useFacebookGetCommentsMutation();
  const [youTubeComments] = useYoutubeCommentsMutation();
  const [confirmButton, setConfirmButton] = useState(false);
  const [isCameraActive, setCameraActive] = useState(false);
  const [ismute, setMute] = useState(true);
  const [stopCam, setCam] = useState(true);
  const [isShareScreen, SetShareScreen] = useState(false);
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [rtmpUrlFb, setRtmpFb] = useState(null);
  const [rtmpurlYoutube, setyoutubeRTMP] = useState(null);
  const [fbliveComments,setFbLiveComments] = useState([]);
  const { userDetails } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();


  useEffect(() => {
   setRTMPUrls();
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [rtmpUrlFb, rtmpurlYoutube]);
 

  const setRTMPUrls = ()=>{
     if (userDetails.rtmpUrl) setRtmpFb(userDetails.rtmpUrl);
     if (userDetails.rtmpurlYoutube) {
       setyoutubeRTMP(userDetails.rtmpurlYoutube);
     }
  }

  const socket = io("ws://localhost:3100", {
    transports: ["websocket"],
    query: {
      rtmpUrlYoutube: rtmpurlYoutube,
      rtmUrlFaceBook: rtmpUrlFb,
    },
  });

  const handleStartRecording = () => {
    if (!socket) {
      toast.error("Socket is not initialized");
      console.error("Socket is not initialized.");
      return;
    }
    setRTMPUrls();
    recorderInit();

    const getFbComments =async()=>{
      try {
        const fbcomment =await fbcomments().unwrap(); 
        setFbLiveComments([...fbliveComments,fbcomment]);
        console.log(fbliveComments)
      }
      catch(err){
        console.error(err.message);
        toast.error(err.message)
      }
       
    }

    const youtubeComments = async()=>{
     const youtubeComments = await youTubeComments().unwrap();
     console.log(youtubeComments);
    }
     if (intervalIdRef.current) {
       clearInterval(intervalIdRef.current);
     }
      intervalIdRef.current = setInterval(()=>{
        youtubeComments();
        fbcomments();
      }, 5000);
  };

  const recorderInit = () => {
    const liveStream = videoRef.current.captureStream(30);

    const mediaRecorder = new MediaRecorder(liveStream, {
      mimeType: "video/webm;codecs=h264",
      videoBitsPerSecond: 3 * 1024 * 1024,
    });

    mediaRecorder.ondataavailable = (e) => {
      socket.send(e.data);
    };
    mediaRecorder.start(1000);
  };

  const getStream = async () => {
    if (stream && videoRef.current) return;

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: ismute,
      video: {
        height: { min: 720, max: 1280 },
        width: { min: 1080, max: 1920 },
        frameRate: { min: 15, ideal: 24, max: 30 },
        facingMode: "user",
      },
    });

    setStream(mediaStream);
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  };

  useEffect(() => {
    getStream();
  }, [videoRef, ismute, stopCam, isShareScreen]);

  const stopRecording = () => {
    if (isCameraActive) {
      if (socket) {
        socket.close();
      }
    }
  };

  const handleToggleCamera =()=>{
     setCameraActive(!isCameraActive);
     
     if (!isCameraActive && stream) {
       const videoTracks = stream.getVideoTracks();
       videoTracks.forEach((track) => {
         track.enabled = false; 
       });
     } else if (stream) {
       const videoTracks = stream.getVideoTracks();
       videoTracks.forEach((track) => {
         track.enabled = true; 
       });
     }

  }

  const leaveStudio = () => {
    socket.emit("client-stop-ffmpeg");
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    clearInterval(intervalIdRef.current);
    stopRecording();
    dispatch(clearRTMPURLS());
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-9/12">
        <div className="w-full h-96 mb-4 pt-20">
          <video
            className="w-full h-96 mb-4"
            ref={videoRef}
            autoPlay
            playsInline
            muted={!isCameraActive} // Mute/unmute based on camera state
          />
        </div>
        <div className="flex justify-center mt-20">
          <div className="mt-28 border-2">
            {!ismute ? (
              <button
                className="mx-5 my-2  text-blue-950"
                onClick={() => {
                  setMute(true);
                }}
              >
                <GoUnmute style={{ fontSize: "28px", marginLeft: "10px" }} />
                <p>unmute</p>
              </button>
            ) : (
              <button
                className="mx-5 my-2  text-red-600"
                onClick={() => {
                  setMute(false);
                }}
              >
                <BsFillMicMuteFill
                  style={{ fontSize: "28px", marginLeft: "2px" }}
                />

                <p>Mute</p>
              </button>
            )}

            <button
              className="mx-5 my-2  text-blue-950"
              onClick={handleToggleCamera} // Toggle the camera on/off
            >
              {isCameraActive ? (
                <AiFillVideoCamera
                  style={{ fontSize: "30px", marginLeft: "14px" }}
                />
              ) : (
                <BsCameraVideoOffFill
                  style={{ fontSize: "30px", marginLeft: "14px" }}
                />
              )}
              <p>{isCameraActive ? "Start cam" : " Stop cam"}</p>
            </button>

            <button
              className="mx-5 my-2  text-blue-950"
              onClick={() => SetShareScreen(true)}
            >
              <MdScreenShare style={{ fontSize: "30px", marginLeft: "22px" }} />
              <p>share Screen</p>
            </button>
            <button className="mx-5 my-2  text-red-800" onClick={leaveStudio}>
              <AiFillCloseCircle
                style={{ fontSize: "30px", marginLeft: "22px" }}
              />
              <p>Leave Studio</p>
            </button>
          </div>
        </div>
      </div>

      <div className="w-3/12 p-4 bg-white">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleStartRecording}
        >
          Go Live
        </button>
        <h2 className="text-2xl font-semibold mb-4 mt-2">Comments</h2>
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
  );
};


export default VideoStreaming;
