"use client";

import { useEffect, useState, useContext } from 'react';
import React,{useCallback} from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useRouter } from 'next/navigation'
//custom PoiMarkers Imported
import PoiMarkers from './PoiMarkers'
import {MainLocations, ZoomLocations} from './contexts'
import { useUserLocation } from './useLocation';


const MapComp = () => {
  var {Locs, setLocs} = useContext(MainLocations)
  var {ZoomLocs, setZoomLocs} = useContext(ZoomLocations)
  var {Zoom, setZoom} = useContext(ZoomLocations)


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
  const premiumDarkNightThemeStyles = [
    { elementType: "geometry", stylers: [{ color: "#0c1a2a" }] }, // Deeper, richer dark blue base
    { elementType: "labels.text.fill", stylers: [{ color: "#e8eaf6" }] }, // Very light, almost white labels for max contrast
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#0c1a2a" }], // Stroke matching the base for clean labels
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8ab4f8" }], // Light blue for administrative areas - stands out but still night-like
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8ab4f8" }], // Light blue for POIs for consistency
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#082440" }], // Slightly lighter dark blue for parks, subtle differentiation
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#a7ffeb" }], // Bright cyan for park labels - pops!
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#2b4a69" }], // Darker, but still visible road color
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#18324b" }], // Slightly darker road stroke for definition
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#c5cae9" }], // Light gray/blue for road labels
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#64b5f6" }], // Brighter blue for highways - more prominent
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#3b5e7d" }], // Darker stroke for highway definition
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#fff59d" }], // Gold/Yellow for highway labels - classic contrast
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#152a41" }], // Darker transit geometry
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8ab4f8" }], // Light blue for transit station labels
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#040e17" }], // Very deep, almost black water for a night ocean feel
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7dd8f8" }], // Light cyan/blue for water labels - subtle glow
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#040e17" }], // Stroke matching deep water color
    },
  ];


  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} >
      <Map
        // style={{ width: '60vw', height: '60vh'}}
        defaultCenter={ZoomLocs}
        defaultZoom={Zoom}
        gestureHandling={'greedy'}
        // mapId={'6d4a78bd07042b18'}
        styles={premiumDarkNightThemeStyles} // Apply the dark theme styles here
      >
        <PoiMarkers pois={Locs} />
      </Map>
    </APIProvider>
  );
};

export default MapComp;