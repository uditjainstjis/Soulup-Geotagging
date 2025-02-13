"use client";
// import { use } from 'react';
import React, {useState, useEffect, useContext } from 'react';
import MapComp from './components/MapComp'
import Select from './components/Select'
import sampleLocations from './components/sampleLocations'
import {ShowDidWeGotUserLocation} from './components/useLocation'
import { MainLocations, ZoomLocations } from './components/contexts';

export default function Home() {
  const [Locs, setLocs] = useState(sampleLocations)
  const [ZoomLocs, setZoomLocs] = useState({ lat: 23.6138954, lng: 87.2090057 })
  const [Zoom, setZoom] = useState(6)

  return (
    <MainLocations.Provider value={{Locs, setLocs}}>
      <ZoomLocations.Provider value = {{ZoomLocs, setZoomLocs, Zoom, setZoom}}>

    <div className='mt-2 flex flex-col lg:flex-row'>

      <div className='flex flex-col sm:ml-0 mb-4 md:ml-[5vw]  md:items-start items-center justify-center'>
      <ShowDidWeGotUserLocation/>

      <h5 className='text-black mb-1  border border-gray-300  sm:text-lg md:text-xl  bg-slate-50 p-5 mt-3 rounded-full  sm:w-[100vw] md:w-[90vw] lg:w-[65vw] font-semibold font-mono'>Find others around you dealing with the same thing as you.</h5>
      <div className=' border-yellow-400 border-2 mt-2 rounded-xl w-[96vw] sm:w-[95vw] h-[31vh] sm:h-[40vh] md:w-[90vw] md:h-[56vh]   lg:w-[65vw] lg:h-[60vh] overflow-hidden z-10'>
      <MapComp/>
      </div>
      </div>

      <div className='mt-6 lg:mt-0 p-4 flex flex-row justify-center items-center text-center lg:w-[30vw] text-semibold text-xl font-sans'>
        <Select/>
      </div>


    </div>
    <p className="text-xs text-gray-500 text-center relative mt-[20vh] ">
    By using this site, you agree to our <a href="/privacy-policy" target='_blank' className="underline">Privacy Policy</a>.
    </p>

    </ZoomLocations.Provider>
    </MainLocations.Provider>

  );
}
