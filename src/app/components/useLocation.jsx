"use client";
import { useEffect, useState, useContext } from "react";
import axios from 'axios'

export function GetUserLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [locationRecieved, setLocationRecieved] = useState(true);
  const [city, setCity] = useState()

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
          setLocationRecieved(true)
          setLocation(geoLocation);

          const sendingCoords = axios.post('/api/FindCity', geoLocation).then((res) => {
            console.log(res.data)
            // alert(res.data.District)
            setCity(res.data.District)
          }).catch((err) => {
            console.log(err)
          })
        },
        async (err) => {
          setLocationRecieved(false)

          
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

  return (
    <>
    {locationRecieved?(<></>) : (<div className="p-1 ml-2 mr-2 h-16 flex items-center bg-red-100 rounded border-2 text-lg border-red-600"><h2 className="text-red-500 font-bold">Allow location's from browser setting's to see people facing same issue nearby you!</h2></div>)}
    </>
  );
}

export default GetUserLocation;
