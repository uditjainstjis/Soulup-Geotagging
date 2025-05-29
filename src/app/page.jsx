"use client";
import React, { useState, useEffect } from 'react'; // Removed useContext from here as it's not needed for providing
import MapComp from './components/MapComp';
import Select from './components/Select';
import { MainLocations, ZoomLocations } from './components/contexts';
import Navbar from './components/navbar';

export default function Home() {
  // CORRECT WAY: Home component OWNS this state
  const [currentLocs, setCurrentLocs] = useState([]); // This is the actual state for locations

  // State for Zoom (this part was okay)
  const [zoomMapLocs, setZoomMapLocs] = useState({ lat: 23.86514681568587, lng: 78.45549903489808 });
  const [currentZoom, setCurrentZoom] = useState(6);

  useEffect(() => {
    console.log('Home: currentLocs state updated:'); // Log the actual state variable
    console.log(currentLocs);
  }, [currentLocs]); // Depend on the actual state variable

  return (
    // Provide the ACTUAL state and its setter function
    <MainLocations.Provider value={{ Locs: currentLocs, setLocs: setCurrentLocs }}>
      <ZoomLocations.Provider value={{ ZoomLocs: zoomMapLocs, setZoomLocs: setZoomMapLocs, Zoom: currentZoom, setZoom: setCurrentZoom }}>
        <div className="min-h-screen flex flex-col bg-white">
          <Navbar />
          <main className="flex-grow container md:mt-8 mt:py-8 md:px-6 md:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className=" flex-shrink-0 md:ml-8 space-y-4 md:relative absolute z-10 ">
                <h1 className="text-4xl font-bold tracking-wide md:block hidden font-sans  text-slate-800">SoulUp Maps</h1>
                <h2 className="sm:text-xl md:text-2xl tx  py-2 pl-1 md:shadow-none shadow-around rounded-lg md:w-auto  w-[90vw] mx-auto sm:font-normal font-bold  tracking-wide font-sans bg-white  text-slate-800">What key challenge's are you facing now?</h2>
                <div className="relative">
                  <Select /> {/* Select might consume MainLocations, ensure it uses useContext correctly */}
                </div>
              </div>
              <div className="flex-grow shadow-around md:min-h-[60vh] lg:min-h-0">
                <div className="w-full mx-auto h-full overflow-hidden">
                  {/* Pass the actual state and setter as props to MapComp */}
                  <MapComp
                    Locs={currentLocs}
                    setLocs={setCurrentLocs}
                    Zoom={currentZoom}
                    setZoom={setCurrentZoom}
                    ZoomLocs={zoomMapLocs}
                    setZoomLocs={setZoomMapLocs}
                  />
                </div>
              </div>
            </div>
          </main>
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