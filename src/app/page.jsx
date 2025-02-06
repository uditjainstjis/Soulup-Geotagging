"use client";
// import { use } from 'react';
import React from 'react';
import MapComp from './components/MapComp'
import Select from './components/Select'
import useLocation from './components/getUserLocation'

export default function Home() {

  

  //Location processing here
  // useLocation()
  



  return (
    <div className='mt-2 flex flex-col lg:flex-row'>

      <div className='flex flex-col sm:ml-0 mb-4 md:ml-[5vw]  md:items-start items-center justify-center'>

      <h5 className='text-black mb-1  sm:text-lg md:text-xl  bg-slate-50 p-5 mt-3 rounded-full  sm:w-[100vw] md:w-[90vw] lg:w-[65vw] font-semibold font-mono'>This map shows people who have recently faced the same issue as your's.</h5>
      <div className=' border-yellow-400 border-2 mt-2 rounded-xl w-[96vw] sm:w-[95vw] h-[31vh] sm:h-[40vh] md:w-[90vw] md:h-[56vh]   lg:w-[65vw] lg:h-[60vh] overflow-hidden z-10'>
      <MapComp/>
      </div>
      </div>


      <div className='mt-6 lg:mt-0 p-4 flex flex-row justify-center items-center text-center lg:w-[30vw] text-semibold text-xl font-sans'>
        <Select/>
      </div>




    </div>
  );
}
