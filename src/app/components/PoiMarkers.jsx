import { useState, useCallback } from "react";
import {Circle} from './circle'
import {AdvancedMarker, Pin, InfoWindow} from '@vis.gl/react-google-maps'
import Image from 'next/image';

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

    const getSocialPlatformName = (url) => {
        if (!url) return null;
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes("linkedin.com")) {
            return "LinkedIn";
        } else if (lowerUrl.includes("instagram.com")) {
            return "Instagram";
        } else if (lowerUrl.includes("facebook.com")) {
            return "Facebook";
        } else if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
            return "Twitter"; // or "X" if you prefer
        } else if (lowerUrl.includes("tiktok.com")) {
            return "TikTok";
        } else if (lowerUrl.includes("youtube.com")) {
            return "YouTube";
        } else if (lowerUrl.includes("pinterest.com")) {
            return "Pinterest";
        } else if (lowerUrl.includes("threads.net")) {
            return "Threads";
        } else if (lowerUrl.includes("bsky.app")) {
            return "Bluesky";
        } else if (lowerUrl.includes("soulup.in")) {
            return "Soulup";
        }
        return "Social Profile"; // Default if platform not recognized
    };


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
        </AdvancedMarker>
      ))}

      {selectedPoi && (
                <InfoWindow
                    position={selectedPoi.location}
                    onCloseClick={() => setSelectedPoi(null)}
                    options={{
                        pixelOffset: { width: 0, height: -35 },
                      }}
                >
                    <div className={`p-4 bg-white rounded-xl shadow-lg w-72 border ${getSocialPlatformName(selectedPoi.socialProfile) == 'Soulup'?'border-red-400':'border-gray-200'} `}>
                        <div className="flex items-center mb-3 pb-3 border-b border-gray-200">
                            <div className="mr-3 rounded-full overflow-hidden w-11 h-11 relative">
                                <Image
                                    src={selectedPoi.profilePhoto || "/user.png"}
                                    alt={`${selectedPoi.name || 'Anonymous'} Profile`}
                                    width={44}
                                    onError={(e) => (e.target.src = "/user.png")}
                                    height={44}
                                    layout="fixed"
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

                                {/* Conditional Peer tag */}
                                {getSocialPlatformName(selectedPoi.socialProfile) == 'Soulup' && (<>
                                    <span className="text-rose-500 ml-auto">Peer</span>
                                                                    {/* Info icon with tooltip */}
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
                                <span className="text-gray-800">{selectedPoi.ageBracket || 'Not specified'}</span>
                            </div>
                        </div>

                        {selectedPoi.socialProfile && (
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700 mr-1">
                                    Profile: 
                                </span>
                                <a
                                    href={selectedPoi.socialProfile}
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

export default PoiMarkers