"use client";
import React, { useState, useContext } from 'react'; // Removed useEffect as it's not used here directly
import MapComp from './components/MapComp';
import Select from './components/Select'; // This should be your main refactored Select component
import sampleLocations from './components/sampleLocations';
import { MainLocations, ZoomLocations } from './components/contexts';
import Navbar from './components/navbar';

export default function Home() {
  const [Locs, setLocs] = useState(sampleLocations);
  const [ZoomLocs, setZoomLocs] = useState({ lat: 23.86514681568587, lng: 78.45549903489808 });
  const [Zoom, setZoom] = useState(6);

  return (
    <MainLocations.Provider value={{ Locs, setLocs }}>
      <ZoomLocations.Provider value={{ ZoomLocs, setZoomLocs, Zoom, setZoom }}>
        <div className="min-h-screen flex flex-col bg-white"> {/* Overall page container */}
          <Navbar />
          {/* Main Content Area */}
          <main className="flex-grow container md:mt-8 mt:py-8   md:px-6 md:px-8">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Left Column: Controls */}
              <div className=" flex-shrink-0 md:ml-8 space-y-4 md:relative absolute z-10 ">
                <h1 className="text-4xl font-bold tracking-wide md:block hidden font-sans  text-slate-800">SoulUp Maps</h1>
                <h2 className="sm:text-xl md:text-2xl tx  py-2 pl-1 md:shadow-none shadow-around rounded-lg md:w-auto  w-[90vw] mx-auto sm:font-normal font-bold  tracking-wide font-sans bg-white  text-slate-800">What key challenge's are you facing now?</h2>

                <div className="relative">
                  <Select />
                </div>

              </div>

              {/* Right Column: Map */}
              <div className="flex-grow  shadow-around md:min-h-[60vh] lg:min-h-0">
                <div className="w-full mx-auto h-full overflow-hidden">
                  <MapComp Locs={Locs} setLocs={setLocs} Zoom={Zoom} setZoom={setZoom} setZoomLocs={setZoomLocs} ZoomLocs={ZoomLocs}/>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="py-2 md:block hidden">
            <p className="text-xs  text-gray-500 text-center">
              By using this site, you agree to our <a href="/privacy-policy" target='_blank' className="underline hover:text-gray-700">Privacy Policy</a>.
            </p>
          </footer>
        </div>
      </ZoomLocations.Provider>
    </MainLocations.Provider>
  );
}