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

// --- Helper function for running functions that return promises with concurrency limit ---
// Defined outside the component to avoid recreation on every render,
// but it needs access to the component's refs (isMounted, redirected).
// We will pass these refs to the function.
async function runTasksWithConcurrencyLimitWithRefs(taskFunctions, limit, isMountedRef, redirectedRef) {
    const pool = new Set();
    let index = 0;

    return new Promise((resolve, reject) => {
        const enqueueNext = () => {
            // Stop enqueuing if component unmounted/redirected or no more tasks
            if (!isMountedRef.current || redirectedRef.current || index >= taskFunctions.length) {
                 // If all tasks enqueued AND the pool is currently empty, we are done
                 if (pool.size === 0 && index >= taskFunctions.length) {
                     resolve();
                 }
                 return; // No more tasks to enqueue or invalid state
            }

            const currentTaskIndex = index++;
            const taskFunction = taskFunctions[currentTaskIndex];

            // Call the function to get the promise and add it to the pool
            // The taskFunction itself handles fetching, error checking, and state updates
            const promise = taskFunction();
            pool.add(promise);

            promise
                .then(() => {}) // Success handler (optional, taskFunction handles its own success actions)
                .catch(error => {
                     // Task failed - log it. The taskFunction itself should handle 401 redirects.
                     console.error(`Concurrency runner: Task at index ${currentTaskIndex} failed.`, error);
                     // The error is re-thrown by the taskFunction itself, which will be caught
                     // by the main fetchData catch block due to the `await runTasksWithConcurrencyLimitWithRefs`.
                 })
                .finally(() => {
                    // Remove from pool regardless of success or failure
                    pool.delete(promise);
                    // Try to enqueue the next task from the queue, keeping concurrency up to limit
                    // Only continue if component is still mounted and no redirection has occurred
                    if (isMountedRef.current && !redirectedRef.current) {
                         enqueueNext();
                    }
                });

            // If the pool has space, or if we just added the first task, try to enqueue the next
            // immediately to keep the pipeline full up to the limit.
            // Ensure we don't go beyond the total number of tasks available (`index < taskFunctions.length`).
            if (pool.size < limit && index < taskFunctions.length) {
                 enqueueNext();
            } else if (index >= taskFunctions.length && pool.size === 0) {
                 // Edge case: If we just added the *very last* task and the pool is now empty
                 // (because limit was >= remaining tasks), then all tasks are done, resolve immediately.
                  resolve();
            }
             // If pool is full, the `finally` callback of completed tasks will call `enqueueNext`.
        };

        // Start the process by enqueuing the initial set of tasks up to the limit
        for(let i = 0; i < limit && i < taskFunctions.length; i++) {
             // Initial check before starting tasks
             if (!isMountedRef.current || redirectedRef.current) {
                 console.log("Concurrency runner: Component unmounted/redirected before starting initial tasks.");
                 return; // Stop starting tasks
             }
             enqueueNext();
        }
         // Handle empty task list edge case (e.g., total count was 0 or less than initial fetch size)
         if (taskFunctions.length === 0) {
            resolve();
         }
    });
}


const MapComp = ({Locs, setLocs, ZoomLocs, setZoomLocs, Zoom, setZoom}) => {
    // Contexts for locations and zoom.
    // Note: We are now managing allLocations internally and updating the context from it.
    // const { Locs, setLocs } = useContext(MainLocations); // Redundant if passed as props? Use props.
    // const { ZoomLocs, setZoomLocs } = useContext(ZoomLocations); // Redundant if passed as props? Use props.
    // const { Zoom, setZoom } = useContext(ZoomLocations); // Redundant if passed as props? Use props.
    // Assuming props are used based on the function signature, comment out useContext for these.

    // State for the final combined list of locations
    const [allLocations, setAllLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0); // State to store the total count

    // Ref to store fetched chunks by their skip value
    const fetchedChunks = useRef(new Map());

    // Constants for chunking
    const locationsPerChunk = 1000;
    const concurrentLimit = 10; // Adjust based on desired concurrency

    const router = useRouter();
    const isMounted = useRef(true);
    const redirected = useRef(false);
    const [currentTheme, setCurrentTheme] = useState('light');


    // Helper function to reconstruct the full sorted list from fetchedChunks Map
    const reconstructLocations = () => {
        const sortedSkips = Array.from(fetchedChunks.current.keys()).sort((a, b) => a - b);
        let combinedLocations = [];
        for (const skip of sortedSkips) {
            const chunk = fetchedChunks.current.get(skip);
            if (chunk) { // Ensure the chunk exists before concatenating
                 combinedLocations = combinedLocations.concat(chunk);
            } else {
                console.warn(`reconstructLocations: Chunk for skip=${skip} not found in map.`);
            }
        }
        return combinedLocations;
    };


    useEffect(() => {
        isMounted.current = true;
        redirected.current = false;

        async function fetchData() {
            // Check if component is still mounted and no redirection has occurred at the start
            if (!isMounted.current || redirected.current) {
                console.log("fetchData: Component not mounted or already redirected. Aborting.");
                return;
            }

            setIsLoading(true);
            setError(null);
            fetchedChunks.current.clear(); // Clear previous data
            setAllLocations([]); // Clear state

            let total = 0; // Variable to hold total count during fetching

            try {
                // --- Step 1: Check user details (Sequential) ---
                console.log("Fetching: Checking user details...");
                const detailsCheckRes = await fetch('/api/userdetails');

                // Check again after fetch
                if (!isMounted.current || redirected.current) return;

                if (!detailsCheckRes.ok) {
                    if (detailsCheckRes.status === 401 && !redirected.current) {
                        console.warn("Fetching: Received 401 Unauthorized on user details check. Redirecting.");
                        redirected.current = true; // Prevent multiple redirects
                        router.push('/signin');
                         // Do NOT set isLoading(false) or setError here, redirect takes over
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
                    // Do NOT set isLoading(false) or setError here, redirect takes over
                    return; // Stop execution
                }

                console.log("Fetching: User details complete.");

                // --- Step 2: Fetch the first chunk to get total count (Sequential) ---
                console.log(`Fetching: Fetching initial chunk: skip=0, limit=${locationsPerChunk}`);
                const initialRes = await fetch(`/api/Loc?skip=0&limit=${locationsPerChunk}`);

                // Check again after fetch
                if (!isMounted.current || redirected.current) return;

                if (!initialRes.ok) {
                    if (initialRes.status === 401 && !redirected.current) {
                        console.warn("Fetching: Received 401 Unauthorized on initial fetch. Redirecting.");
                        redirected.current = true;
                        router.push('/signin');
                        return;
                    }
                    const errorData = await initialRes.json().catch(() => ({ message: 'Failed to parse error' }));
                    console.error("Fetching: Initial fetch failed:", errorData);
                    throw new Error(`Failed to fetch initial location chunk (status ${initialRes.status}): ${errorData.error || errorData.message || initialRes.statusText}`);
                }

                // Check again after parsing
                if (!isMounted.current || redirected.current) return;

                const initialData = await initialRes.json();

                if (!Array.isArray(initialData.locations)) {
                   console.error("Fetching: Initial data is not an array or invalid format:", initialData);
                   throw new Error("Invalid data format received from server for initial chunk.");
                }
                 // Check if totalCount is available and is a number
                 if (typeof initialData.totalCount !== 'number') {
                      console.warn("Fetching: totalCount not provided or is not a number in initial response. Proceeding with fetched items only.");
                      total = initialData.locations.length; // Assume fetched count is total if totalCount is missing
                 } else {
                     total = initialData.totalCount;
                 }
                setTotalCount(total);
                console.log(`Fetching: Initial chunk received. Total locations reported: ${total}. Fetched ${initialData.locations.length} items.`);

                // Store the first chunk if it has data
                if (initialData.locations.length > 0) {
                   fetchedChunks.current.set(0, initialData.locations);
                }

                // Determine remaining skips needed based on the total count
                const totalFetchedAfterInitial = initialData.locations.length;
                const remainingSkips = [];
                // Only calculate remaining skips if total > totalFetchedAfterInitial
                for (let skip = totalFetchedAfterInitial; skip < total; skip += locationsPerChunk) {
                    remainingSkips.push(skip);
                }

                // Update state with initial data if valid and mounted/not redirected
                if (isMounted.current && !redirected.current && initialData.locations.length > 0) {
                   setAllLocations(reconstructLocations());
                }


                if (remainingSkips.length === 0 && totalFetchedAfterInitial >= total) {
                    console.log("Fetching: Initial chunk covers all data or total is 0.");
                    // Loading will be set to false in the finally block
                    return; // Stop execution if no more chunks are needed
                } else if (remainingSkips.length > 0) {
                     console.log(`Fetching: ${remainingSkips.length} remaining chunks needed. Starting concurrent fetch with limit ${concurrentLimit}.`);
                } else if (total > 0 && totalFetchedAfterInitial === 0 && remainingSkips.length === 0) {
                     // This case is problematic: total > 0 but initial fetch returned 0 and no more skips calculated.
                     console.warn("Fetching: Total count > 0 but initial fetch returned 0 items and no remaining skips calculated. Potential issue with API or logic.");
                     // We will proceed to finally block, isLoading will be false, error state is null unless caught earlier.
                     return; // Stop execution
                }


                // --- Step 3: Create an array of *functions* for the remaining chunks ---
                // Each function fetches a specific chunk and updates shared state/ref
                const taskFunctions = remainingSkips.map(skip =>
                    // Return an async function that will perform the fetch when called
                    async () => {
                        // Check component state BEFORE fetch
                        if (!isMounted.current || redirected.current) {
                             console.log(`Task function for skip=${skip}: Component unmounted or redirected before fetch. Aborting.`);
                             // Do not return anything or throw an error here, just stop
                             // The main promise will resolve when other tasks complete or when pool is empty
                             return;
                        }
                        console.log(`Task function for skip=${skip}: Starting fetch...`);
                        const res = await fetch(`/api/Loc?skip=${skip}&limit=${locationsPerChunk}`);

                        // Check component state AFTER fetch but BEFORE processing response
                        if (!isMounted.current || redirected.current) {
                             console.log(`Task function for skip=${skip}: Component unmounted or redirected after fetch. Aborting processing.`);
                              return;
                        }

                        if (!res.ok) {
                             const errorData = await res.json().catch(() => ({ message: 'Failed to parse error' }));
                             console.error(`Task function for skip=${skip}: Fetch failed (status ${res.status})`, errorData);
                             if (res.status === 401 && !redirected.current) {
                                  redirected.current = true;
                                  router.push('/signin');
                                  // Do NOT set isLoading(false) or setError here
                             }
                             // Throw an error so the concurrency runner can log it,
                             // but we rely on the main catch block to potentially set the overall error state
                             throw new Error(`Failed to fetch chunk skip=${skip} (status ${res.status})`);
                        }

                        const data = await res.json();
                        // Check component state AFTER parsing response
                        if (!isMounted.current || redirected.current) return;

                        if (!Array.isArray(data.locations)) {
                           console.error(`Task function for skip=${skip}: Received data is not an array`, data);
                           throw new Error(`Invalid data format for chunk skip=${skip}`);
                        }

                        console.log(`Task function for skip=${skip}: Successfully fetched ${data.locations.length} locations.`);

                        // Store the fetched chunk data ONLY if component is still mounted and not redirected
                        if (isMounted.current && !redirected.current) {
                            fetchedChunks.current.set(skip, data.locations);

                            // Update the state with the combined data from all chunks received so far
                            // This triggers re-render as data arrives.
                            setAllLocations(reconstructLocations());
                        }

                        // No explicit return needed, the promise resolves implicitly
                   }
                );


                // --- Step 4: Run the task functions concurrently with a limit ---
                // Pass the refs to the helper function
                await runTasksWithConcurrencyLimitWithRefs(taskFunctions, concurrentLimit, isMounted, redirected);

                console.log("Fetching: All concurrent chunk tasks finished.");

                // Final state update after all chunks are processed (optional, but good practice)
                // The state is already being updated progressively, but this ensures the final state is set.
                if (isMounted.current && !redirected.current) {
                     setAllLocations(reconstructLocations());
                }


            } catch (err) {
                console.error("Fetching: Error during data fetching process:", err);
                 // Only update error state if component is still mounted and not redirected
                 // Avoid showing error message if it's a handled 401 redirect that initiated router.push
                if (isMounted.current && !redirected.current && !(`${err.message}`.includes("status 401"))) {
                    setError(`Error fetching locations: ${err.message}`);
                }
            } finally {
                 // Always stop loading, but only update state if mounted and not redirected
                 // and only if a redirect hasn't occurred.
                if (isMounted.current && !redirected.current) {
                    setIsLoading(false);
                    console.log("Fetching: Loading finished.");
                } else {
                    console.log("Fetching: Loading finished (component unmounted or redirected).");
                }
            }
        }

        fetchData(); // Initiate the async fetching process

        // Cleanup function to handle component unmount
        return () => {
            isMounted.current = false;
            console.log("MapComp useEffect cleanup: isMounted set to false");
        };

    // Dependencies: router for navigation, and chunking constants if they were variables
    }, [router, locationsPerChunk, concurrentLimit]);

    // Effect to update the context when allLocations is updated
    // Keep this if MainLocations context needs to reflect the cumulatively loaded data
    useEffect(() => {
        if (setLocs) {
            setLocs(allLocations);
        }
    }, [allLocations, setLocs]);


    // --- Theme Toggle Logic (remains the same) ---
    const toggleTheme = () => {
        setCurrentTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

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
    // --- End Theme Toggle Logic ---


    // Use the allLocations state (which gets updated as chunks arrive) for markers
    const locationsForMarkers = allLocations;

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>

             {/* Theme Toggle Button */}
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

            {/* Loading Indicator (Updated to show progress) */}
            {isLoading && (allLocations.length < totalCount || totalCount === 0) && (
                 <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '8px', zIndex: 1001, textAlign: 'center' }}>
                    Loading locations... ({allLocations.length}{totalCount > 0 ? ` / ${totalCount}` : ''})
                </div>
            )}
            {error && (
                <div style={{ position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', padding: '10px 20px', background: 'rgba(200,0,0,0.9)', color: 'white', borderRadius: '8px', zIndex: 1001, textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                    Error: {error}
                </div>
            )}

            <GoogleMapComponent
                // Using props for center/zoom as indicated by function signature
                defaultCenter={ZoomLocs}
                defaultZoom={Zoom}
                className='md:h-[77vh] md:w-[57vw] w-[100vw] h-[100vh] z-[-10] '
                gestureHandling={'greedy'}
                // Apply dark theme styles based on state
                styles={currentTheme === 'dark' ? premiumDarkNightThemeStyles : null}
                options={{
                    zoomControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                }}
            >
                {/* PoiMarkers component receives the list of locations (growing as chunks load) */}
                <PoiMarkers pois={locationsForMarkers} />
            </GoogleMapComponent>
        </APIProvider>
    );
};

export default MapComp;