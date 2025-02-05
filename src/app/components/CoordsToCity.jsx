import React from 'react'

const CoordsToCity = async(lat, lon) => {

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
  return (
    <div>CoordsToCity</div>
  )
}

export default CoordsToCity