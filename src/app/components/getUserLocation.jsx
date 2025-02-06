"use client";
import { useEffect, useState } from "react";
import CoordsToCity from './CoordsToCity'

async function getIPLocation() {
  try {
    const res = await fetch("/api/get-ip-location"); // Calls Next.js API route
    const data = await res.json();
    
    if (res.ok) {
      console.log("IP-based Location:", data);
      alert(`IP Location: ${data.city}, ${data.region}, ${data.country}`);
      return data;
    } else {
      throw new Error("Failed to fetch IP location");
    }
  } catch (error) {
    console.error("Error fetching IP location:", error);
    alert("Unable to retrieve IP location.");
    return null;
  }
}

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            source: "Geolocation API",
          };

          console.log("Geolocation API Location:", geoLocation);
          alert(`Geolocation:\nLatitude: ${geoLocation.latitude}\nLongitude: ${geoLocation.longitude}\nAccuracy: ${geoLocation.accuracy} meters`);

          setLocation(geoLocation);
        },
        async (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            console.warn("User denied geolocation, using IP location");
            alert("Location access denied. Using IP-based location instead.");
            setError("Geolocation denied, using IP location");
            const ipLocation = await getIPLocation();
            setLocation(ipLocation);
          } else {
            console.warn("Geolocation error:", err);
            alert("Unable to retrieve location.");
          }
        }
      );
    } else {
      console.warn("Geolocation API not supported, using IP location.");
      getIPLocation().then(setLocation);
    }
  }, []);

  return { location, error };
}

export default useLocation;
