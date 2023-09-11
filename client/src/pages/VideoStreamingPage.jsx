import React from 'react';
import HeaderStream from "../components/HeaderStream";
import VideoStreaming from '../components/VideoStreaming'


const VideoStreamingPage = () => {
  return (
    <>
      <HeaderStream />
      <div>
        <VideoStreaming />
      </div>
    </>
  );
}

export default VideoStreamingPage