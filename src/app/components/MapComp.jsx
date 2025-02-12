"use client"

import { useEffect, useState, useContext } from 'react';
import React,{useCallback} from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useRouter } from 'next/navigation'
//custom PoiMarkers Imported
import PoiMarkers from './PoiMarkers'
import {MainLocations} from './contexts'


const MapComp = () => {
  var {Locs, setLocs} = useContext(MainLocations)
  // const [locations, setLocation] = useState(Locs);
  const [error, setError] = useState(null);
  const router = useRouter()

  useEffect(() => { 
    async function getLocations() {
      try {
        const res = await fetch("/api/Loc"); // Calls Next.js API route
        const data = await res.json();
        if (res.ok) {
          setLocs(data)
          // console.log(Locs)
          console.log("data from server to plot locations", data)

        } else {
          if(res.status==401){

            router.push('/signin')
          }else{
          throw new Error("Failed to fetch location ;(",res);
          }
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setError("Failed to fetch location");
      }
    }
    getLocations();
  },[])


  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} >
      <Map
        // style={{ width: '60vw', height: '60vh'}}
        defaultCenter={{ lat: 28.6138954, lng: 77.2090057 }}
        defaultZoom={6}
        gestureHandling={'greedy'}
        mapId={'6d4a78bd07042b18'}

      >
        <PoiMarkers pois={Locs} />
      </Map>
    </APIProvider>
  );
};

export default MapComp;

