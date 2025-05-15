"use client";
import { useEffect, useState, useContext, useRef } from 'react';
import React from 'react';
import { APIProvider, Map as GoogleMapComponent } from '@vis.gl/react-google-maps';
import { useRouter } from 'next/navigation';
import PoiMarkers from './PoiMarkers'; // Make sure this path is correct
import { MainLocations, ZoomLocations } from './contexts'; // Make sure this path is correct
import { useUserLocation } from './useLocation'; // Make sure this path is correct (assuming this hook exists)

// --- SVG Icon Components (remain the same) ---
const SunIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="5" fill={color} stroke="none" />
    <g stroke={color}>
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </g>
  </svg>
);

const MoonIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 0012 21a9 9 0 009-8.21z" />
  </svg>
);

const premiumDarkNightThemeStyles = [
    // ... (your dark theme styles remain unchanged)
    { elementType: "geometry", stylers: [{ color: "#0c1a2a" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#e8eaf6" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0c1a2a" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#8ab4f8" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#8ab4f8" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#082440" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#a7ffeb" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#2b4a69" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#18324b" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#c5cae9" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#64b5f6" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#3b5e7d" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#fff59d" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#152a41" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#8ab4f8" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#040e17" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#7dd8f8" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#040e17" }] },
];


const MapComp = ({Locs, setLocs, ZoomLocs, setZoomLocs, Zoom, setZoom}) => {
    // var { Locs, setLocs } = useContext(MainLocations); // Locs might be redundant if allLocations is the source
    // var { ZoomLocs, setZoomLocs } = useContext(ZoomLocations); // Assuming this handles the map center/zoom
    // var { Zoom, setZoom } = useContext(ZoomLocations); // Assuming this handles the map zoom

    // State for the final combined list of locations
    const [allLocations, setAllLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Removed state/refs/constants used for chunking ---
    // const [totalCount, setTotalCount] = useState(0);
    // const fetchedChunks = useRef(new Map());
    // const locationsPerChunk = 1000;
    // const concurrentLimit = 10;

    const router = useRouter();
    const isMounted = useRef(true);
    const redirected = useRef(false);
    const [currentTheme, setCurrentTheme] = useState('light');

    // --- Removed chunk-related functions ---
    // reconstructLocations, runTasksWithConcurrencyLimit

    useEffect(() => {
        isMounted.current = true;
        redirected.current = false;

        // --- Simplified fetchData function ---
        async function fetchData() {
            // Check if component is still mounted and no redirection has occurred
            if (!isMounted.current || redirected.current) {
                console.log("fetchData: Component not mounted or already redirected. Aborting.");
                return;
            }

            setIsLoading(true);
            setError(null);
            setAllLocations([]); // Clear previous data

            try {
                console.log("Fetching: Checking user details...");
                const detailsCheckRes = await fetch('/api/userdetails');

                // Check again after fetch
                if (!isMounted.current || redirected.current) return;

                if (!detailsCheckRes.ok) {
                    if (detailsCheckRes.status === 401 && !redirected.current) {
                        console.warn("Fetching: Received 401 Unauthorized on user details check. Redirecting.");
                        redirected.current = true; // Prevent multiple redirects
                        router.push('/signin');
                        setIsLoading(false); // Stop loading indicator
                        return; // Stop execution
                    }
                    const errorData = await detailsCheckRes.json().catch(() => ({ message: 'Failed to parse userdetails error' }));
                    throw new Error(`Failed to fetch user details (status ${detailsCheckRes.status}): ${errorData.error || errorData.message || detailsCheckRes.statusText}`);
                }

                 // Check again after parsing
                if (!isMounted.current || redirected.current) return;

                const userDetails = await detailsCheckRes.json();

                if (userDetails.gender === null || userDetails.gender === undefined || userDetails.ageBracket === null || userDetails.ageBracket === undefined) {
                    console.log("Fetching: User details incomplete, redirecting to /details");
                    if (!redirected.current) { // Prevent multiple redirects
                        redirected.current = true;
                        router.push('/details');
                    }
                     setIsLoading(false); // Stop loading indicator
                    return; // Stop execution
                }

                console.log("Fetching: User details complete.");

                // --- Single fetch for all locations ---
                console.log("Fetching: Fetching all locations...");
                // No skip or limit parameters needed now
                const res = await fetch('/api/Loc');

                // Check again after fetch
                if (!isMounted.current || redirected.current) return;

                if (!res.ok) {
                    if (res.status === 401 && !redirected.current) {
                        console.warn("Fetching: Received 401 Unauthorized on location fetch. Redirecting.");
                        redirected.current = true; // Prevent multiple redirects
                        router.push('/signin');
                        setIsLoading(false); // Stop loading indicator
                        return; // Stop execution
                    }
                    const errorData = await res.json().catch(() => ({ message: 'Failed to parse error' }));
                    throw new Error(`Failed to fetch locations (status ${res.status}): ${errorData.error || errorData.message || res.statusText}`);
                }

                 // Check again after parsing
                if (!isMounted.current || redirected.current) return;

                const data = await res.json();

                // Verify the response structure (expecting { locations: [...] })
                if (!data || !Array.isArray(data.locations)) {
                   console.error("Fetching: Received data is not an array or invalid format:", data);
                   throw new Error("Invalid data format received from server.");
                }

                console.log(`Fetching: Successfully fetched ${data.locations.length} locations.`);

                // Update state with all locations in one go
                 if (isMounted.current && !redirected.current) {
                    setAllLocations([...Locs,...data.locations]);
                 }

                 // --- Removed chunking loop and concurrency logic ---

            } catch (err) {
                console.error("Fetching: Error during data fetching process:", err);
                 // Only update error state if component is still mounted and not redirected
                if (isMounted.current && !redirected.current) {
                    // Avoid showing error message if it's just a 401 redirect
                    if (!`${err.message}`.includes("status 401")) {
                         setError(`Error fetching locations: ${err.message}`);
                    }
                }
            } finally {
                 // Always stop loading, but only update state if mounted and not redirected
                if (isMounted.current && !redirected.current) {
                    setIsLoading(false);
                    console.log("Fetching: Loading finished.");
                } else {
                    console.log("Fetching: Loading finished (component unmounted or redirected).");
                }
            }
        }

        fetchData(); // Initiate the single fetch

        // Cleanup function to handle component unmount
        return () => {
            isMounted.current = false;
            console.log("MapComp useEffect cleanup: isMounted set to false");
        };

    }, [router]); // Dependencies: router is needed for push

    // Effect to update the context when allLocations is updated
    useEffect(() => {
        if (setLocs) {
            setLocs(allLocations);
        }
    }, [allLocations, setLocs]);


    const toggleTheme = () => {
        setCurrentTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    // --- Updated Sizes for Toggle Switch (remains the same) ---
    const scaleFactor = 1.5;
    const baseTrackWidth = 56;
    const baseTrackHeight = 30;
    const baseThumbSize = 24;
    const baseIconSize = 16;

    const trackWidth = baseTrackWidth * scaleFactor;
    const trackHeight = baseTrackHeight * scaleFactor;
    const thumbSize = baseThumbSize * scaleFactor;
    const iconSize = baseIconSize * scaleFactor;
    const trackPadding = (trackHeight - thumbSize) / 2;

    const toggleContainerStyle = {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1002,
    };

    const toggleTrackStyle = {
        width: `${trackWidth}px`,
        height: `${trackHeight}px`,
        borderRadius: `${trackHeight / 2}px`,
        backgroundColor: currentTheme === 'dark' ? '#2D3748' : '#E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingLeft: `${trackPadding}px`,
        paddingRight: `${trackPadding}px`,
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out',
        position: 'relative',
        boxSizing: 'border-box',
        border: 'none',
        outline: 'none',
    };

    const thumbStyle = {
        position: 'absolute',
        top: `${trackPadding}px`,
        left: currentTheme === 'light' ? `${trackPadding}px` : `${trackWidth - thumbSize - trackPadding}px`,
        width: `${thumbSize}px`,
        height: `${thumbSize}px`,
        borderRadius: '50%',
        backgroundColor: '#3B82F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'left 0.3s ease-in-out',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    };

    const faintIconColor = currentTheme === 'dark' ? '#718096' : '#A0AEC0';
    const iconContainerStyle = {
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };


    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>

             <div style={toggleContainerStyle} className='md:block hidden'>
                <button
                    onClick={toggleTheme}
                    style={toggleTrackStyle}
                    aria-label={currentTheme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
                    title={currentTheme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
                >
                    <div style={{ ...iconContainerStyle, opacity: currentTheme === 'dark' ? 0.8 : 0.3, transition: 'opacity 0.3s ease' }}>
                        <SunIcon size={iconSize} color={faintIconColor} />
                    </div>

                    <div style={thumbStyle}>
                        {currentTheme === 'light' ? (
                            <SunIcon size={iconSize} color="#FFFFFF" />
                        ) : (
                            <MoonIcon size={iconSize} color="#FFFFFF" />
                        )}
                    </div>

                    <div style={{ ...iconContainerStyle, opacity: currentTheme === 'light' ? 0.8 : 0.3, transition: 'opacity 0.3s ease' }}>
                        <MoonIcon size={iconSize} color={faintIconColor} />
                    </div>
                </button>
            </div>


            {/* Simplified Loading Indicator */}
            {isLoading && (
                 <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '8px', zIndex: 1001, textAlign: 'center' }}>
                    Loading locations...
                    {/* Removed chunk count display */}
                </div>
            )}
            {error && (
                <div style={{ position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', padding: '10px 20px', background: 'rgba(200,0,0,0.9)', color: 'white', borderRadius: '8px', zIndex: 1001, textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                    Error: {error}
                </div>
            )}

            <GoogleMapComponent
                defaultCenter={ZoomLocs} // Assuming ZoomLocs is initialized elsewhere
                defaultZoom={Zoom} // Assuming Zoom is initialized elsewhere
                className='md:h-[77vh] md:w-[57vw] w-[100vw] h-[100vh] z-[-10] '
                gestureHandling={'greedy'}
                styles={currentTheme === 'dark' ? premiumDarkNightThemeStyles : null}
                options={{
                    zoomControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                }}
                
            >
                {/* PoiMarkers component will now receive the full list */}
                <PoiMarkers pois={allLocations} />
            </GoogleMapComponent>
        </APIProvider>
    );
};

export default MapComp;