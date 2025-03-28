"use client";

import { useEffect, useState, useContext } from 'react';
import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useRouter } from 'next/navigation';
// Custom PoiMarkers Imported
import PoiMarkers from './PoiMarkers';
import { MainLocations, ZoomLocations } from './contexts';
import { useUserLocation } from './useLocation';
import UserDetailsForm from '../components/UserDetailsForm';

const MapComp = () => {
  var { Locs, setLocs } = useContext(MainLocations);
  var { ZoomLocs, setZoomLocs } = useContext(ZoomLocations);
  var { Zoom, setZoom } = useContext(ZoomLocations);

  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getLocations() {
      try {
        const res = await fetch("/api/Loc"); // Calls Next.js API route
        const data = await res.json();
        if (res.ok) {
          setLocs(data);
          console.log("data from server to plot locations", data);
        } else {
          if (res.status == 401) {
            router.push('/signin');
            return; // Prevent further execution
          } else {
            throw new Error("Failed to fetch location", res);
          }
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setError("Failed to fetch location");
      }
    }
    
    async function checkDetails() {
      const check = await fetch('/api/userdetails');
      const userDetails = await check.json();
      if (!userDetails.gender) {
        router.push('details');
      }
    }
    
    getLocations().then(() => {
      if (window.location.pathname !== '/signin') {
        checkDetails();
      }
    });
  }, []);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={ZoomLocs}
        defaultZoom={Zoom}
        gestureHandling={'greedy'}
        mapId={'6d4a78bd07042b18'}
      >
        <PoiMarkers pois={Locs} />
      </Map>
    </APIProvider>
  );
};

export default MapComp;