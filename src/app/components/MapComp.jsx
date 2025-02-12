"use client"

import { useEffect, useState } from 'react';
import React,{useCallback} from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useRouter } from 'next/navigation'
//custom PoiMarkers Imported
import PoiMarkers from './PoiMarkers'


const MapComp = () => {
  const [locations, setLocation] = useState(sampleLocations);
  const [error, setError] = useState(null);
  const router = useRouter()

  useEffect(() => { 
    async function getLocations() {
      try {
        const res = await fetch("/api/Loc"); // Calls Next.js API route
        const data = await res.json();
        if (res.ok) {
          setLocation(data);
          console.log(locations)
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
        <PoiMarkers pois={locations} />
      </Map>
    </APIProvider>
  );
};

export default MapComp;



const sampleLocations = [
  { key: 'a', location: { lat: 30.65608095, lng: 77.24079592327321 } },
  { key: 'b', location: { lat: 26.9154576, lng: 79.8189817 } },
  { key: 'c', location: { lat: 29.1562688, lng: 75.7292303 } },
  { key: 'd', location: { lat: 29.65608095, lng: 78.24079592327321 } },
  { key: 'e', location: { lat: 25.9154576, lng: 75.8189817 } },
  { key: 'f', location: { lat: 24.1562688, lng: 73.7292303 } },
  { key: 'g', location: { lat: 20.65608095, lng: 78.24079592327321 } },
  { key: 'h', location: { lat: 17.9154576, lng: 70.8189817 } },
  { key: 'i', location: { lat: 20.65608095, lng: 82.24079592327321 } },
  { key: 'j', location: { lat: 25.9154576, lng: 75.8189817 } },
  { key: 'k', location: { lat: 24.1562688, lng: 73.7292303 } },
  { key: 'l', location: { lat: -33.8690081, lng: 151.2052393 } },
  { key: 'm', location: { lat: -33.8587568, lng: 151.2058246 } },

];
