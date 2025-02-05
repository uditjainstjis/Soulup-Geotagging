"use client"; // If using Next.js 13+ App Router

import { useEffect, useRef } from "react";

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Load Google Maps script dynamically
    const loadGoogleMaps = async() => {
      if (window.google) return initMap(); // Prevent duplicate loading

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=marker&v=beta`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => initMap();
    };

    const initMap = () => {
      if (!mapRef.current) return;
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 6,
      });

      const markers = [
        { lat: 28.6139, lng: 77.2090, title: "Delhi" },
        { lat: 28.6561, lng: 77.2407, title: "Old Delhi" },
        { lat: 26.9155, lng: 75.8190, title: "Jaipur" },
        { lat: 29.1563, lng: 75.7292, title: "Hisar" },
      ];

      markers.forEach(({ lat, lng, title }) => {
        new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title,
        });
      });
    };

    loadGoogleMaps();
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "50vw",
        height: "30vw",
        margin: "auto",
        borderRadius: "20px",
      }}
    />
  );
};

export default MapComponent;
