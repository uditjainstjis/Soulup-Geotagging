"use client";
// import { use } from 'react';
import React from 'react';

import MapComp from './components/MapComp'
// import useLocation from './components/getUserLocation'

export default function Home() {

  

  //Location processing here
  // useLocation()



  return (
    <div className='mt-2'>

      <div className='flex flex-col sm:ml-0  md:ml-[5vw]  md:items-start items-center justify-center'>

      <h5 className='mb-1 text-xl  bg-slate-200/10 p-5 mt-3 rounded-full  sm:w-[100vw] md:w-[90vw] lg:w-[65vw] font-semibold font-mono'>This is the map showing how many people faced the same issue as you recently.</h5>
      <div className=' border-yellow-400 border-2 rounded-xl w-[96vw] sm:w-[95vw] h-[35vh] sm:h-[40vh] md:w-[90vw] md:h-[56vh]   lg:w-[65vw] lg:h-[60vh] overflow-hidden z-10'>
      <MapComp/>
      </div>

      </div>
    </div>
  );
}
