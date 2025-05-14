"use client";
import React, { useState, useContext } from 'react'; // Removed useEffect as it's not used here directly
import MapComp from './components/MapComp';
import Select from './components/Select'; // This should be your main refactored Select component
import sampleLocations from './components/sampleLocations';
import { MainLocations, ZoomLocations } from './components/contexts';
import Navbar from './components/navbar';
// No need to import ActionButtonsController here, as Select.js will handle it.

export default function Home() {
  const [Locs, setLocs] = useState(sampleLocations);
  const [ZoomLocs, setZoomLocs] = useState({ lat: 23.86514681568587, lng: 78.45549903489808 });
  const [Zoom, setZoom] = useState(6);

  // The 'selectedChallenge' state and its handling are now managed internally by your refactored 'Select.js' component (as 'optionValue').
  // If 'Home.js' needs to know about the selected challenge for other purposes,
  // you'd need to modify 'Select.js' to accept an 'onChange' prop and call it.
  // For now, assuming 'Select.js' is self-contained for this functionality.
  // const [selectedChallenge, setSelectedChallenge] = useState('Loneliness');

  return (
    <MainLocations.Provider value={{ Locs, setLocs }}>
      <ZoomLocations.Provider value={{ ZoomLocs, setZoomLocs, Zoom, setZoom }}>
        <div className="min-h-screen flex flex-col bg-white"> {/* Overall page container */}
          <Navbar />
          {/* Main Content Area */}
          <main className="flex-grow container mt-8 py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Left Column: Controls */}
              <div className=" flex-shrink-0 ml-8 space-y-4">
                <h1 className="text-4xl font-bold tracking-wide font-sans  text-slate-800">SoulUp Maps</h1>
                <h2 className="text-2xl  tracking-wider font-sans   text-slate-800">What key challenge's are you facing currently?</h2>

                {/*
                  The Select component (your refactored main component) goes here.
                  It handles its own state for challenge selection, time dropdowns,
                  and rendering the ActionButtonsController.
                */}
                <div className="relative">
                  <Select />
                  {/*
                    The commented-out props like 'value' and 'onChange' for 'selectedChallenge'
                    are not needed here if 'Select.js' manages its own selection state (optionValue).
                    Any custom styling should ideally be handled within Select.js or via its parent div.
                  */}
                </div>

                {/*
                  DO NOT render ActionButtonsController directly here.
                  Your main 'Select.js' component is responsible for rendering it.
                */}
                {/* <ActionButtonsController/>  <-- REMOVE THIS LINE */}

                {/* <ShowDidWeGotUserLocation /> This could be a small text info or a toast,
                    ensure it's correctly implemented if still needed.
                    Its logic might be better suited inside Select.js if related to location for actions.
                */}
              </div>

              {/* Right Column: Map */}
              <div className="flex-grow  shadow-around md:min-h-[60vh] lg:min-h-0">
                <div className="w-full h-full overflow-hidden">
                  <MapComp />
                </div>
              </div>
            </div>
          </main>

          <div className="flex flex-row ml-[5vw]">
                <img src="cluster.png" className="w-16 mr-3"></img>
                <p className="text-xs text-start">these blue and red circle shows there are that no. of people in that area</p>
                </div>

          {/* Footer */}
          <footer className="py-2">
            <p className="text-xs text-gray-500 text-center">
              By using this site, you agree to our <a href="/privacy-policy" target='_blank' className="underline hover:text-gray-700">Privacy Policy</a>.
            </p>
          </footer>
        </div>
      </ZoomLocations.Provider>
    </MainLocations.Provider>
  );
}