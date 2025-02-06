"use client"

import {Circle} from './circle'
import { useEffect, useState } from 'react';
import React,{useCallback} from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';



const PoiMarkers = ({ pois }) => {
    const [circleCenter, setCircleCenter] = useState(null)
    const [selectedPoi, setSelectedPoi] = useState(null)
    const [poiData, setPoiData] = useState({});


    const handleClick = useCallback((ev, poi) => {
        if(!ev.latLng) return;
        console.log('marker clicked:', ev.latLng.toString());
        setCircleCenter(ev.latLng) ;
        setSelectedPoi(poi);
      });


    return (
    <>
        <Circle
          radius={800}
          center={circleCenter}
          strokeColor={'#0c4cb3'}
          strokeOpacity={1}
          strokeWeight={3}
          fillColor={'#3b82f6'}
          fillOpacity={0.3}
        />
      {pois.map((poi) => (
        <AdvancedMarker key={poi.key} position={poi.location} clickable={true} onClick={(event) => handleClick(event, poi)}>
        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        {/* //use glyph property to write something on pin */}
        </AdvancedMarker>
      ))}

      {selectedPoi && (
                <InfoWindow
                    position={selectedPoi.location}
                    onCloseClick={() => setSelectedPoi(null)} // Close on close click
                >
                    <div>
                        <h1>John Cena</h1>
                        <p>Depressed</p>
                        <p>Delhi</p>
                        {/* <p>Latitude:{selectedPoi.location.lat}</p> */}
                        {/* <p>Longitude:{selectedPoi.location.lng}</p> */}
                        {/* Add more content here based on your POI data */}
                        <p>Key: {selectedPoi.key}</p>
                    </div>
                </InfoWindow>
            )}

    </>
  );
};

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


const MapComp = () => {
  const [locations, setLocation] = useState(sampleLocations);
  const [error, setError] = useState(null);



  useEffect(() => { 
    async function getLocations() {
      try {
        const res = await fetch("/api/Loc"); // Calls Next.js API route
        const data = await res.json();
        if (res.ok) {
          console.log("Location:", data);
          // alert('data recieved', data)
          // setLocation(data);
        } else {
          throw new Error("Failed to fetch location ry cry");
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
