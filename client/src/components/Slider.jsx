import React from 'react'
import { BsCameraVideo } from "react-icons/bs";

const Slider = () => {
  return (
    <div className="flex space-x-2 p-4">
      <div className="flex mt-1 ">
        <BsCameraVideo />
      </div>
      <div>
        <button className="text-base font-medium">Home</button>
      </div>
    </div>
  );
}

export default Slider