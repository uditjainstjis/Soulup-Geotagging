import { useState, useEffect, useCallback, useRef } from "react";
import { Circle } from './circle';
import { InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Image from 'next/image';
import getSocialPlatformName from './SocialPlatforms';

// Updated helper function to create the SVG string for a map pin
// Now includes a separate black inner circle
const createPinSvg = (pinColor) => {
  // SVG ViewBox: 0 0 384 512
  // Main pin path coordinates are relative to this box.
  // The center of the pin's head circle is typically at (192, 192)
  // The radius of the inner hole is typically 64 in this coordinate system.
  const innerCircleCx = 192;
  const innerCircleCy = 192;
  const innerCircleRadius = 64;
  const innerCircleColor = "#000000"; // Black color for the inner circle

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 384 512">
      <!-- Main Pin Shape (colored yellow or red) -->
      <path fill="${pinColor}" stroke="#000000" stroke-width="8" d="M192 0C85.9 0 0 85.9 0 192c0 77.4 28.6 98.8 171.1 309.4c3.4 5 9.7 8.6 16.9 8.6s13.5-3.6 16.9-8.6C355.4 290.8 384 269.4 384 192C384 85.9 298.1 0 192 0zm0 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/>

      <!-- Inner Circle (filled black) - Drawn on top of the path -->
      <circle cx="${innerCircleCx}" cy="${innerCircleCy}" r="${innerCircleRadius}" fill="${innerCircleColor}" />
    </svg>`;
};


const PoiMarkers = ({ pois }) => {
    const map = useMap();
    const [markers, setMarkers] = useState({});
    const clusterer = useRef(null);
    const [circleCenter, setCircleCenter] = useState(null);
    const [selectedPoi, setSelectedPoi] = useState(null);

    const handleMarkerClick = useCallback((_event, poi) => {
        console.log('marker clicked:', poi.location);
        setCircleCenter({ lat: poi.location.lat, lng: poi.location.lng });
        setSelectedPoi(poi);
    }, []);

    useEffect(() => {
        if (!map || !google || !google.maps) {
            console.warn("Google Maps API not available yet.");
            return;
        }

        // Clear previous markers and listeners
        setMarkers(prevMarkers => {
            Object.values(prevMarkers).forEach(marker => {
                google.maps.event.clearInstanceListeners(marker);
            });
            return {};
        });

        // Create new markers with custom pin icons
        const newMarkers = {};
        if (pois && pois.length > 0) {
            const defaultColor = '#FBBC04'; // Yellow
            const soulupColor = '#DC2626'; // Red (Tailwind's red-600)

            pois.forEach((poi, idx) => {
                const isSoulup = getSocialPlatformName(poi.socialProfile) === 'Soulup';
                const pinColor = isSoulup ? soulupColor : defaultColor;

                // Create the SVG string with the chosen color (inner circle is handled by the function)
                const svgString = createPinSvg(pinColor);

                // Create the google.maps.Icon object using the SVG Data URI
                const customIcon = {
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`,
                    scaledSize: new google.maps.Size(24, 32), // The size the SVG renders at
                    anchor: new google.maps.Point(15, 40),   // Anchor at bottom-center (15 = 30/2, 40 = height)
                };

                const marker = new google.maps.Marker({
                    position: poi.location,
                    icon: customIcon, // Apply the custom SVG pin icon
                    // title: poi.name
                });

                marker.addListener('click', (e) => handleMarkerClick(e, poi));
                newMarkers[poi.id || idx] = marker;
            });
        }
        setMarkers(newMarkers);

    }, [map, pois, handleMarkerClick]);

    // Effect to create/update the MarkerClusterer instance (remains the same)
    useEffect(() => {
        if (!map) return;

        if (clusterer.current) {
            clusterer.current.clearMarkers();
        }

        const markerValues = Object.values(markers);
        if (markerValues.length > 0) {
            clusterer.current = new MarkerClusterer({
                map,
                markers: markerValues,
            });
        } else {
            clusterer.current = null;
        }

        return () => {
            if (clusterer.current) {
                clusterer.current.clearMarkers();
                clusterer.current = null;
            }
        };
    }, [map, markers]);


    return (
        <>
            {/* Circle remains the same */}
            <Circle
                radius={800}
                center={circleCenter}
                strokeColor={'#0c4cb3'}
                strokeOpacity={1}
                strokeWeight={3}
                fillColor={'#3b82f6'}
                fillOpacity={0.3}
            />

            {/* InfoWindow remains the same */}
            {selectedPoi && (
                <InfoWindow
                    position={selectedPoi.location}
                    onCloseClick={() => {
                        setSelectedPoi(null);
                        setCircleCenter(null);
                    }}
                    options={{
                         // Offset should still be correct as the overall size/anchor hasn't changed
                        pixelOffset: { width: 0, height: -40 },
                    }}
                >
                    {/* InfoWindow content remains the same */}
                   <div className={`p-4 bg-white rounded-xl shadow-lg w-72 border ${getSocialPlatformName(selectedPoi.socialProfile) == 'Soulup'?'border-red-400':'border-gray-200'} `}>
                         {/* ... Your existing InfoWindow content ... */}
                         <div className="flex items-center mb-3 pb-3 border-b border-gray-200">
                            <div className="mr-3 rounded-full overflow-hidden w-11 h-11 relative">
                                <Image
                                    src={selectedPoi.profilePhoto || "/user.png"}
                                    alt={`${selectedPoi.name || 'Anonymous'} Profile`}
                                    width={44}
                                    onError={(e) => (e.target.src = "/user.png")}
                                    height={44}
                                    objectFit="cover"
                                    className="rounded-full"
                                    priority
                                />
                            </div>
                            <div>
                                <h2 className='text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors'>
                                    {selectedPoi.name || 'Anonymous User'}
                                </h2>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                <span className="text-start">{selectedPoi.city}</span>
                                {getSocialPlatformName(selectedPoi.socialProfile) == 'Soulup' && (<>
                                    <span className="text-rose-500 ml-auto">Peer</span>
                                    <span className="relative group cursor-pointer text-xs text-gray-400 border border-gray-300 rounded-full px-1.5 py-0.5">
                                    i
                                    <span className="absolute left-2/3 -translate-x-full -translate-y-6  mt-1 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        This person is a Soulup Peer.
                                    </span>
                                </span></>
                                )}
                                </div>
                            </div>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700 mr-1">Issue:</span>
                            <span className="text-gray-800">{selectedPoi.tag}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div>
                                <span className="font-semibold text-gray-700 mr-1">Gender:</span>
                                <span className="text-gray-800">{selectedPoi.gender || 'Not specified'}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700 mr-1">Age:</span>
                                <span className="text-gray-800">{selectedPoi.age || selectedPoi.ageBracket || 'Not specified'}</span>
                            </div>
                        </div>
                        {selectedPoi.socialProfile && (
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700 mr-1">
                                    Profile:
                                </span>
                                <a
                                    href={
                                        selectedPoi.socialProfile.startsWith("www.")
                                            ? `https://${selectedPoi.socialProfile}`
                                            : selectedPoi.socialProfile.startsWith("http")
                                            ? selectedPoi.socialProfile
                                            : `https://${selectedPoi.socialProfile}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline text-sm"
                                >
                                    View Profile {getSocialPlatformName(selectedPoi.socialProfile) ? `(${getSocialPlatformName(selectedPoi.socialProfile)})` : ''}
                                </a>
                            </div>
                        )}
                        <div className="text-right text-gray-500 text-xs italic">
                            {new Date(selectedPoi.time).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                        </div>
                    </div>
                </InfoWindow>
            )}
        </>
    );
};

export default PoiMarkers;