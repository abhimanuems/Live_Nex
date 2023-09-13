import React from 'react'
import Header from '../components/Header'
import BodyPage from './BodyPage';
import Slider from '../components/Slider';

const Homepage = () => {
 return (
   <>
     <div>
       <Header />
     </div>
     <div className="flex">
       <div className=" w-1/6  h-screen bg-slate-400">
         <Slider />
       </div>

       <div className=" w-5/6">
         <BodyPage />
       </div>
     </div>
   </>
 );
};

export default Homepage