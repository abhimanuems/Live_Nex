import React from 'react'
import { BsCameraVideo } from "react-icons/bs";

const Slider = () => {
  return (
    <div className="flex space-x-2 p-4">
      <div className="flex mt-1 ">
        <BsCameraVideo style={{color:"white",fontSize:"25px"}} />
      </div>
      <div>
        <button className="text-base text-white font-medium mt-1">Home</button>
      </div>
    </div>
  );
}

export default Slider