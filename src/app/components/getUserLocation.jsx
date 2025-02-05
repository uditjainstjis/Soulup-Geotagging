"use client";
import { useEffect, useState } from "react";

async function getIPLocation() {
  const res = await fetch("/api/get-ip-location"); // Calls Next.js API route
  const data = await res.json();

  console.log("IP-based Location:", data);
  alert(`IP Location:\nLatitude: ${data.latitude}\nLongitude: ${data.longitude}\nCity: ${data.city}, ${data.region}, ${data.country}`);

  return data;
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
          console.warn("Geolocation denied, using IP location", err);
          setError("Geolocation denied, using IP location");
          const ipLocation = await getIPLocation();
          setLocation(ipLocation);
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
