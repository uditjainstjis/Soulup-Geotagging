"use client";

import React, {useEffect} from 'react'
import {createRoot} from 'react-dom/client';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

import { MarkerClusterer } from "@googlemaps/markerclusterer";

// const markerCluster = new MarkerClusterer({ markers, map });

const MapComponentFinal = () => {
  useEffect(()=>{
  const initMap = async()=>{
    if (typeof window !== "undefined" && window.google) {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
      "marker",
    );
        
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 5,
      center: { lat: 28.6138954, lng: 77.2090057 },
      mapId: "DEMO_MAP_ID",

    });

    const infoWindow = new google.maps.InfoWindow({
      content: "hehe ye hai content",
      disableAutoPan: true,
    });
    // Create an array of alphabetical characters used to label the markers.
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const markers = locations.map((position, i) => {
      const label = labels[i % labels.length];
      const pinGlyph = new google.maps.marker.PinElement({
        glyph: label,
        glyphColor: "white",
      });
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position,
        content: pinGlyph.element,
      });
      
  
      // markers can only be keyboard focusable when they have click listeners
      // open info window when marker is clicked
      marker.addListener("click", () => {
        infoWindow.setContent(position.lat + ", " + position.lng);
        infoWindow.open(map, marker);
      });
      return marker;
    });
  
  
    // Add a marker clusterer to manage the markers.
    new MarkerClusterer({ markers, map });
  }
  }
  const locations = [
    { lat: 28.65608095, lng: 77.24079592327321 },
    { lat: 26.9154576, lng: 75.8189817 },
    { lat: 29.1562688, lng: 75.7292303 },
    { lat: -33.848588, lng: 151.209834 },
    { lat: -33.851702, lng: 151.216968 },
    { lat: -34.671264, lng: 150.863657 },
    { lat: -35.304724, lng: 148.662905 },
    { lat: -36.817685, lng: 175.699196 },
    { lat: -36.828611, lng: 175.790222 },
    { lat: -37.75, lng: 145.116667 },
    { lat: -37.759859, lng: 145.128708 },
    { lat: -37.765015, lng: 145.133858 },
    { lat: -37.770104, lng: 145.143299 },
    { lat: -37.7737, lng: 145.145187 },
    { lat: -37.774785, lng: 145.137978 },
    { lat: -37.819616, lng: 144.968119 },
    { lat: -38.330766, lng: 144.695692 },
    { lat: -39.927193, lng: 175.053218 },
    { lat: -41.330162, lng: 174.865694 },
    { lat: -42.734358, lng: 147.439506 },
    { lat: -42.734358, lng: 147.501315 },
    { lat: -42.735258, lng: 147.438 },
    { lat: -43.999792, lng: 170.463352 },
  ];
  
  initMap();
},[])



  return(
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} >
      {/* <Map
        style={{width: '50vw', height: '50vh', marginLeft:'auto', marginRight:'auto', marginTop:'20vh'}}
        defaultCenter={{lat:28.6138954, lng:77.2090057}}
        defaultZoom={6}
      gestureHandling={'greedy'}

      /> */}
      <div id="map" 
      style={{ width: "50vw", height: "50vh", marginLeft:'auto', marginRight:'auto', marginTop:'20vh' }}
      ></div>
    </APIProvider>
    // <div>MapComponentFinal</div>
  )
}

export default MapComponentFinal