import React from 'react'
import Header from '../components/Header';
import Slider from '../components/Slider';
import Share from '../components/Share'
const SharePage = () => {
  return (
    <div className='bg-gray-100'>
      <div>
        <Header />
      </div>
      <div className="flex">
        <div className=" w-1/6  h-screen bg-[#19376D]">
          <Slider />
        </div>

        <div className=" w-5/6">
          <Share />
        </div>
      </div>
    </div>
  );
}

export default SharePage