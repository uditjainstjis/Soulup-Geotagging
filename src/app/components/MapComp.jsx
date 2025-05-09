// MapComp.js
"use client";
import { useEffect, useState, useContext, useRef } from 'react';
import React from 'react';
import { APIProvider, Map as GoogleMapComponent } from '@vis.gl/react-google-maps';
import { useRouter } from 'next/navigation';
import PoiMarkers from './PoiMarkers';
import { MainLocations, ZoomLocations } from './contexts';
import { useUserLocation } from './useLocation';

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

const MapComp = () => {
    // ... (state, context, refs, and other functions like reconstructLocations, fetchData, runTasksWithConcurrencyLimit remain the same) ...
    var { Locs, setLocs } = useContext(MainLocations);
    var { ZoomLocs, setZoomLocs } = useContext(ZoomLocations);
    var { Zoom, setZoom } = useContext(ZoomLocations);

    const [allLocations, setAllLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const fetchedChunks = useRef(new Map());
    const router = useRouter();
    const isMounted = useRef(true);
    const redirected = useRef(false);
    const [currentTheme, setCurrentTheme] = useState('light'); 

    

    const locationsPerChunk = 1000;
    const concurrentLimit = 10;

    const reconstructLocations = () => {
        const sortedSkips = Array.from(fetchedChunks.current.keys()).sort((a, b) => a - b);
        let combinedLocations = [];
        for (const skip of sortedSkips) {
            const chunk = fetchedChunks.current.get(skip);
            if (chunk) {
                combinedLocations = combinedLocations.concat(chunk);
            } else {
                console.warn(`Chunk for skip=${skip} not found in map during reconstruction.`);
            }
        }
        return combinedLocations;
    };

    useEffect(() => {
        isMounted.current = true;
        redirected.current = false;

        async function runTasksWithConcurrencyLimit(taskFunctions, limit) {
            const pool = new Set();
            let index = 0;

            return new Promise((resolve) => { 
                const enqueueNext = () => {
                    if (!isMounted.current || redirected.current) {
                        if (pool.size === 0) resolve();
                        return;
                    }
                    if (index >= taskFunctions.length) {
                        if (pool.size === 0) {
                            resolve();
                        }
                        return;
                    }

                    const currentTaskIndex = index++;
                    const taskFunction = taskFunctions[currentTaskIndex];
                    const promise = taskFunction();
                    pool.add(promise);

                    promise
                        .catch(error => {
                            console.error(`Concurrency runner: Task ${currentTaskIndex} failed.`, error);
                        })
                        .finally(() => {
                            pool.delete(promise);
                            if (isMounted.current && !redirected.current) {
                                enqueueNext();
                            } else if (pool.size === 0 && index >= taskFunctions.length) {
                                resolve();
                            }
                        });

                    if (pool.size < limit && index < taskFunctions.length && isMounted.current && !redirected.current) {
                        enqueueNext();
                    }
                };

                if (taskFunctions.length === 0) {
                    resolve();
                    return;
                }

                for (let i = 0; i < limit && i < taskFunctions.length; i++) {
                    if (!isMounted.current || redirected.current) break;
                    enqueueNext();
                }
            });
        }

        async function fetchData() {
            if (!isMounted.current || redirected.current) {
                console.log("fetchData: Component not mounted or already redirected. Aborting.");
                return;
            }
            setIsLoading(true);
            setError(null);
            fetchedChunks.current.clear();
            setAllLocations([]);
            setTotalCount(0);
            let currentTotalCount = 0;

            try {
                console.log("Fetching: Checking user details...");
                const detailsCheckRes = await fetch('/api/userdetails');
                if (!isMounted.current) return;
                if (!detailsCheckRes.ok) {
                    if (detailsCheckRes.status === 401 && !redirected.current) {
                        redirected.current = true;
                        router.push('/signin');
                        setIsLoading(false); return;
                    }else{
                if (userDetails.gender === null || userDetails.gender === undefined || userDetails.ageBracket === null || userDetails.ageBracket === undefined) {
                    console.log("Fetching: User details incomplete, redirecting to /details");
                    if (!redirected.current) {
                        redirected.current = true;
                        router.push('/details');
                    }
                    setIsLoading(false); return;
                }
                    }
                    const errorData = await detailsCheckRes.json().catch(() => ({ message: 'Failed to parse userdetails error' }));
                    throw new Error(`Failed to fetch user details (status ${detailsCheckRes.status}): ${errorData.error || errorData.message || detailsCheckRes.statusText}`);
                }
                const userDetails = await detailsCheckRes.json();
                if (!isMounted.current) return;

                console.log("Fetching: User details complete.");

                console.log(`Fetching: Fetching initial chunk: skip=0, limit=${locationsPerChunk}`);
                const initialRes = await fetch(`/api/Loc?skip=0&limit=${locationsPerChunk}`);
                if (!isMounted.current) return;
                if (!initialRes.ok) {
                    if (initialRes.status === 401 && !redirected.current) {
                        console.warn("Fetching: Received 401 Unauthorized on initial location fetch. Redirecting.");
                        redirected.current = true;
                        router.push('/signin');
                        setIsLoading(false); return;
                    }
                    const errorData = await initialRes.json().catch(() => ({ message: 'Failed to parse error' }));
                    throw new Error(`Failed to fetch initial location chunk (status ${initialRes.status}): ${errorData.error || errorData.message || initialRes.statusText}`);
                }
                const initialData = await initialRes.json();
                if (!isMounted.current) return;
                if (!initialData || typeof initialData.totalCount !== 'number' || !Array.isArray(initialData.locations)) {
                    console.error("Fetching: Invalid data format from initial chunk:", initialData);
                    throw new Error("Invalid data format received from server for initial chunk.");
                }
                currentTotalCount = initialData.totalCount;
                setTotalCount(currentTotalCount);
                console.log(`Fetching: Initial chunk received. Total locations reported: ${currentTotalCount}. Fetched ${initialData.locations.length} items.`);
                if (currentTotalCount === 0) {
                    console.log("Fetching: Total count is 0. No locations to fetch.");
                    setAllLocations([]);
                    setIsLoading(false); return;
                }
                if (initialData.locations.length > 0) {
                    fetchedChunks.current.set(0, initialData.locations);
                    if (isMounted.current && !redirected.current) {
                         setAllLocations(reconstructLocations());
                    }
                }
                const totalFetchedAfterInitial = initialData.locations.length;
                const remainingSkips = [];
                if (currentTotalCount > totalFetchedAfterInitial) {
                    for (let skip = totalFetchedAfterInitial; skip < currentTotalCount; skip += locationsPerChunk) {
                        remainingSkips.push(skip);
                    }
                }
                if (remainingSkips.length === 0) {
                    console.log("Fetching: Initial chunk covers all data or no more data to fetch based on totalCount.");
                    setIsLoading(false); return;
                } else {
                    console.log(`Fetching: ${remainingSkips.length} remaining chunks needed. Starting concurrent fetch with limit ${concurrentLimit}.`);
                }
                const taskFunctions = remainingSkips.map(skip =>
                    async () => {
                        if (!isMounted.current || redirected.current) {
                            console.log(`Task for skip=${skip}: Component unmounted/redirected. Aborting.`); return;
                        }
                        console.log(`Task for skip=${skip}: Starting fetch...`);
                        const res = await fetch(`/api/Loc?skip=${skip}&limit=${locationsPerChunk}`);
                        if (!isMounted.current || redirected.current) {
                            console.log(`Task for skip=${skip}: Component unmounted/redirected after fetch. Aborting processing.`); return;
                        }
                        if (!res.ok) {
                            const errorData = await res.json().catch(() => ({ message: 'Failed to parse error' }));
                            console.error(`Task for skip=${skip}: Fetch failed (status ${res.status})`, errorData);
                            if (res.status === 401 && !redirected.current) {
                                redirected.current = true;
                                router.push('/signin');
                            }
                            throw new Error(`Failed to fetch chunk skip=${skip} (status ${res.status}): ${errorData.error || errorData.message || res.statusText}`);
                        }
                        const data = await res.json();
                        if (!isMounted.current || redirected.current) return;
                        if (!data || !Array.isArray(data.locations)) {
                           console.error(`Task for skip=${skip}: Received data is not an array or invalid`, data);
                           throw new Error(`Invalid data format for chunk skip=${skip}`);
                        }
                        console.log(`Task for skip=${skip}: Successfully fetched ${data.locations.length} locations.`);
                        if (data.locations.length > 0) {
                            fetchedChunks.current.set(skip, data.locations);
                            if (isMounted.current && !redirected.current) {
                                setAllLocations(reconstructLocations());
                            }
                        }
                        return data.locations;
                    }
                );
                await runTasksWithConcurrencyLimit(taskFunctions, concurrentLimit);
                console.log("Fetching: All concurrent chunk tasks finished or aborted.");
            } catch (err) {
                console.error("Fetching: Error during data fetching process:", err);
                if (isMounted.current && !redirected.current) {
                    if (!`${err.message}`.includes("status 401")) {
                         setError(`Error fetching locations: ${err.message}`);
                    }
                }
            } finally {
                if (isMounted.current && !redirected.current) {
                    setIsLoading(false);
                    console.log("Fetching: Loading finished. Final reconstructed locations count:", reconstructLocations().length);
                } else {
                    console.log("Fetching: Loading finished (component unmounted or redirected).");
                }
            }
        }
        fetchData();
        return () => {
            isMounted.current = false;
            console.log("MapComp useEffect cleanup: isMounted set to false");
        };
    }, [router, locationsPerChunk, concurrentLimit]);

    useEffect(() => {
        if (setLocs) {
            setLocs(allLocations);
        }
    }, [allLocations, setLocs]);

    const toggleTheme = () => {
        setCurrentTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    // --- Updated Sizes for Toggle Switch ---
    const scaleFactor = 1.5; // Increase size by 50%
    const baseTrackWidth = 56;
    const baseTrackHeight = 30;
    const baseThumbSize = 24;
    const baseIconSize = 16;

    const trackWidth = baseTrackWidth * scaleFactor;    // Approx 84px
    const trackHeight = baseTrackHeight * scaleFactor;   // Approx 45px
    const thumbSize = baseThumbSize * scaleFactor;      // Approx 36px
    const iconSize = baseIconSize * scaleFactor;        // Approx 24px
    // Recalculate padding based on new trackHeight and thumbSize
    const trackPadding = (trackHeight - thumbSize) / 2; // Approx 4.5px

    const toggleContainerStyle = {
        position: 'fixed',
        top: '10px', // You might want to adjust this if it looks too close to the edge
        right: '10px',// You might want to adjust this
        zIndex: 1002,
    };

    const toggleTrackStyle = {
        width: `${trackWidth}px`,
        height: `${trackHeight}px`,
        borderRadius: `${trackHeight / 2}px`, // Maintain pill shape
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
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)', // Can also scale shadow if desired
    };

    const faintIconColor = currentTheme === 'dark' ? '#718096' : '#A0AEC0';
    const iconContainerStyle = {
        width: `${iconSize}px`, // Use the new iconSize
        height: `${iconSize}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <div style={toggleContainerStyle}>
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

            {isLoading && (
                 <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '8px', zIndex: 1001, textAlign: 'center' }}>
                    Loading locations...
                    <br />
                    {allLocations.length > 0 || totalCount > 0 ? `(${allLocations.length} / ${totalCount > 0 ? totalCount : '...'})` : ''}
                </div>
            )}
            {error && (
                <div style={{ position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', padding: '10px 20px', background: 'rgba(200,0,0,0.9)', color: 'white', borderRadius: '8px', zIndex: 1001, textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                    Error: {error}
                </div>
            )}

            <GoogleMapComponent
                defaultCenter={ZoomLocs}
                defaultZoom={Zoom}
                gestureHandling={'greedy'}
                styles={currentTheme === 'dark' ? premiumDarkNightThemeStyles : null}
            >
                <PoiMarkers pois={allLocations} />
            </GoogleMapComponent>
        </APIProvider>
    );
};

export default MapComp;