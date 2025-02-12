import { useState, useCallback } from "react";
import {Circle} from './circle'
import {AdvancedMarker, Pin, InfoWindow} from '@vis.gl/react-google-maps'

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
      {pois.map((poi,idx) => (
        <AdvancedMarker key={idx} position={poi.location} clickable={true} onClick={(event) => handleClick(event, poi)}>
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
                        <h1 className='text-lg text-semibold'>Faced <span className='font-bold'>{selectedPoi.tag}</span> --{'>'} {selectedPoi.time}</h1>
                        <p className='text-lg text-semibold'>{selectedPoi.city}</p>
                        {/* <p>Latitude:{selectedPoi.location.lat}</p> */}
                        {/* <p>Longitude:{selectedPoi.location.lng}</p> */}
                        {/* Add more content here based on your POI data */}
                        {/* <p>Key: {selectedPoi._idx}</p> */}
                    </div>
                </InfoWindow>
            )}

    </>
  );
};

export default PoiMarkers