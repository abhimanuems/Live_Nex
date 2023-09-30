import React from 'react'
import Header from '../components/Header';
import Slider from '../components/Slider';
import Ticket from '../components/Ticket';

const TicketPage = () => {
  return (
    <>
      <div>
        <Header />
      </div>
      <div className="flex">
        <div className=" w-1/6  h-screen bg-[#19376D]">
          <Slider />
        </div>

        <div className=" w-5/6">
          <Ticket />
        </div>
      </div>
    </>
  );
}

export default TicketPage