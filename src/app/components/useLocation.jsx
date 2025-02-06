"use client";
import { useEffect, useState } from "react";
import axios from 'axios'

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

          setLocation(geoLocation);

          const sendingCoords = axios.post('/api/FindCity', geoLocation).then((res) => {
            console.log(res.data)
          }).catch((err) => {
            console.log(err)
          })
        },
        async (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            console.warn("User denied geolocation, using IP location");
            setError("Geolocation denied, using IP location");
          } else {
            console.warn("Geolocation error:", err);
          }
        }
      );
    } else {
      console.warn("Geolocation API not supported, using IP location.");
    }
  }, []);

  return { location, error };
}

export default useLocation;
