// MapComp.js
"use client";

import { useEffect, useState, useContext, useRef } from 'react';
import React from 'react';
import { APIProvider, Map as GoogleMapComponent } from '@vis.gl/react-google-maps'; // Renamed Map import
import { useRouter } from 'next/navigation';
import PoiMarkers from './PoiMarkers';
import { MainLocations, ZoomLocations } from './contexts'; // Re-evaluate MainLocations context usage
import { useUserLocation } from './useLocation'; // Keep if used elsewhere

const MapComp = () => {
  var { Locs, setLocs } = useContext(MainLocations); // Keeping for now, but consider if needed
  var { ZoomLocs, setZoomLocs } = useContext(ZoomLocations);
  var { Zoom, setZoom } = useContext(ZoomLocations);

  const [allLocations, setAllLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchedChunks = useRef(new Map()); // Use Map for storing chunks by skip key

  const router = useRouter();

  const isMounted = useRef(true);
  const redirected = useRef(false);

  const locationsPerChunk = 1000;
  const concurrentLimit = 10; // Or adjust based on testing

  // Helper function to reconstruct the full sorted list from fetchedChunks Map
  const reconstructLocations = () => {
    const sortedSkips = Array.from(fetchedChunks.current.keys()).sort((a, b) => a - b);
    let combinedLocations = [];
    for (const skip of sortedSkips) {
        const chunk = fetchedChunks.current.get(skip);
        if (chunk) { // Ensure the chunk exists before concatenating
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

    async function fetchData() {
      if (!isMounted.current || redirected.current) {
           console.log("fetchData: Component not mounted or already redirected. Aborting.");
           return;
      }

      setIsLoading(true);
      setError(null);
      fetchedChunks.current.clear(); // Clear previous data
      setAllLocations([]); // Clear state

      let total = 0;

      try {
        // --- Step 1: Check user details (Sequential) ---
        
        // --- Step 2: Fetch the first chunk to get total count (Sequential) ---
        console.log(`Fetching: Fetching initial chunk: skip=0, limit=${locationsPerChunk}`);
        const initialRes = await fetch(`/api/Loc?skip=0&limit=${locationsPerChunk}`);
        if (!isMounted.current) return;
        
        if (!initialRes.ok) {
          if (initialRes.status === 401) {
            console.warn("Fetching: Received 401 Unauthorized on initial fetch. Redirecting.");
            if (!redirected.current) {
              redirected.current = true;
              router.push('/signin');
            }
            setIsLoading(false);
            return;
          } else {
            const errorData = await initialRes.json().catch(() => ({ message: 'Failed to parse error' }));
            console.error("Fetching: Initial fetch failed:", errorData);
            throw new Error(`Failed to fetch initial location chunk (status ${initialRes.status}): ${errorData.error || errorData.message || initialRes.statusText}`);
          }
        }
        
        console.log("Fetching: Checking user details...");
        const detailsCheckRes = await fetch('/api/userdetails');
        if (!isMounted.current) return;

        const userDetails = await detailsCheckRes.json();
        if (!isMounted.current) return;

        if (userDetails.gender === null || userDetails.gender === undefined || userDetails.ageBracket === null || userDetails.ageBracket === undefined) {
            console.log("Fetching: User details incomplete, redirecting to /details");
            if (!redirected.current) {
                redirected.current = true;
                router.push('/details');
            }
            setIsLoading(false);
            return;
        }
        console.log("Fetching: User details complete.");

        const initialData = await initialRes.json();
        if (!isMounted.current) return;

        if (!Array.isArray(initialData.locations)) {
             console.error("Fetching: Initial data is not an array:", initialData);
             throw new Error("Invalid data format received from server for initial chunk.");
        }

        total = initialData.totalCount;
        setTotalCount(total);
        console.log(`Fetching: Initial chunk received. Total locations reported: ${total}. Fetched ${initialData.locations.length} items.`);


        if (total === 0) {
            console.log("Fetching: Total count is 0. No locations to fetch.");
            setIsLoading(false);
            return;
        }

        // Store the first chunk
        if (initialData.locations.length > 0) {
           fetchedChunks.current.set(0, initialData.locations);
        }

        // Determine remaining skips
        const totalFetchedAfterInitial = initialData.locations.length;
        const remainingSkips = [];
        for (let skip = totalFetchedAfterInitial; skip < total; skip += locationsPerChunk) {
            remainingSkips.push(skip);
        }

        if (remainingSkips.length === 0 && totalFetchedAfterInitial >= total) { // Check if initial fetch was enough
            console.log("Fetching: Initial chunk covers all data.");
             // Update state with initial data if not already done
            if (initialData.locations.length > 0) {
               setAllLocations(reconstructLocations());
            }
            setIsLoading(false);
            return;
        } else if (remainingSkips.length > 0) {
             // Update state with initial data before starting concurrent fetches
             if (initialData.locations.length > 0) {
                setAllLocations(reconstructLocations());
             }
             console.log(`Fetching: ${remainingSkips.length} remaining chunks needed. Starting concurrent fetch with limit ${concurrentLimit}.`);
        } else {
             // This case handles total > 0 but initial fetch returned 0 and remainingSkips is 0 (e.g., total < locationsPerChunk but initial fetch failed somehow)
             console.warn("Fetching: Total count > 0 but initial fetch returned 0 items and no remaining skips calculated.");
             setIsLoading(false);
             return;
        }


        // --- Step 3: Create an array of *functions* for the remaining chunks ---
        // This is the crucial fix: each element must be a function that returns the promise
        const taskFunctions = remainingSkips.map(skip =>
            // Return an async function that will perform the fetch when called
            async () => {
                if (!isMounted.current || redirected.current) {
                     console.log(`Task function for skip=${skip}: Component unmounted or redirected. Aborting.`);
                     return; // Return early if component is no longer valid
                }
                console.log(`Task function for skip=${skip}: Starting fetch...`);
                const res = await fetch(`/api/Loc?skip=${skip}&limit=${locationsPerChunk}`);

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
                          setIsLoading(false); // Stop loading state on redirect
                     }
                     // Throw an error so the concurrency runner can handle the failure
                     throw new Error(`Failed to fetch chunk skip=${skip} (status ${res.status}): ${errorData.error || errorData.message || res.statusText}`);
                }

                const data = await res.json();
                if (!isMounted.current || redirected.current) return; // Check again after json parse

                if (!Array.isArray(data.locations)) {
                   console.error(`Task function for skip=${skip}: Received data is not an array`, data);
                   throw new Error(`Invalid data format for chunk skip=${skip}`);
                }

                console.log(`Task function for skip=${skip}: Successfully fetched ${data.locations.length} locations.`);

                // Store the fetched chunk data
                fetchedChunks.current.set(skip, data.locations);

                // Update the state with the combined data from all chunks received so far
                // This triggers re-render as data arrives.
                if (isMounted.current && !redirected.current) {
                    setAllLocations(reconstructLocations());
                     // console.log(`Task function for skip=${skip}: State updated. Current total in state: ${reconstructLocations().length}`); // Avoid logging every state update
                }

                return data.locations; // Resolve the promise for this task
           }
        );


        // --- Step 4: Run the task functions concurrently with a limit ---
        await runTasksWithConcurrencyLimit(taskFunctions, concurrentLimit);

        console.log("Fetching: All concurrent chunk tasks finished.");


      } catch (err) {
        console.error("Fetching: Error during fetching process:", err);
        if (isMounted.current && !redirected.current) {
           setError(`Error fetching locations: ${err.message}`);
        }
      } finally {
        if (isMounted.current && !redirected.current) {
           setIsLoading(false);
           console.log("Fetching: Loading finished.");
        }
      }
    }


    // --- Helper function for running functions that return promises with concurrency limit ---
    async function runTasksWithConcurrencyLimit(taskFunctions, limit) {
        const pool = new Set();
        let index = 0; // Index for the next task function to enqueue
        // We don't need to collect results here unless the caller needed the results array

        return new Promise((resolve, reject) => {
            const enqueueNext = () => {
                // Stop enqueuing if component unmounted/redirected or no more tasks
                if (!isMounted.current || redirected.current || index >= taskFunctions.length) {
                    // If no more tasks to enqueue AND the pool is empty, we are done
                    if (pool.size === 0 && index >= taskFunctions.length) {
                         console.log("Concurrency runner: All tasks enqueued and pool empty. Resolving.");
                        resolve();
                    }
                    return;
                }

                const currentTaskIndex = index++; // Get the index for the task function
                const taskFunction = taskFunctions[currentTaskIndex]; // Get the function

                // Call the function to get the promise and add it to the pool
                const promise = taskFunction();
                pool.add(promise);

                // When the promise settles ( سواء fulfilled or rejected)
                promise
                    .then(() => {
                         // console.log(`Concurrency runner: Task ${currentTaskIndex} finished.`);
                     }) // Log success if needed
                    .catch(error => {
                         console.error(`Concurrency runner: Task ${currentTaskIndex} failed.`, error);
                         // Decide error handling: Reject all immediately? Or continue?
                         // If any promise rejects, remove it from the pool BUT we might still continue
                         // other tasks unless we explicitly reject the main promise.
                         // If you throw inside the taskFunction, it will be caught here.
                         // If you want any failure to stop everything, you can call reject(error) here.
                         // Let's allow other tasks to finish but the main fetchData catch will see the first error re-thrown by the taskFunction.
                     })
                    .finally(() => {
                        // Remove from pool
                        pool.delete(promise);
                        // Try to enqueue the next task from the queue
                        if (isMounted.current && !redirected.current) { // Check mount status before recursing
                             enqueueNext();
                        }
                    });

                // If the pool is not full, try to enqueue the next task immediately
                if (pool.size < limit && index < taskFunctions.length) {
                    enqueueNext();
                }
                 // If pool is full or no more tasks, the `finally` or the `index >= taskFunctions.length` check will handle the next step.
            };

            // Start the process by enqueuing the initial set of tasks up to the limit
            for(let i = 0; i < limit && i < taskFunctions.length; i++) {
                enqueueNext();
            }
             // If total tasks < limit, the `finally` in the first set will eventually call `enqueueNext`
             // which will hit the base case `index >= taskFunctions.length` and eventually resolve
             // when `pool.size === 0`.
        });
    }


    // Start the combined async process when the component mounts
    fetchData();


    // Cleanup function: Set the ref to false when the component unmounts
    return () => {
      isMounted.current = false;
      console.log("MapComp useEffect cleanup: isMounted set to false");
    };

  }, [router, locationsPerChunk, concurrentLimit]); // Dependencies

  // Use the allLocations state for the markers. This array grows over time.
  const locationsForMarkers = allLocations;

   // Optional: Update context if needed elsewhere
   useEffect(() => {
      if (setLocs) { // Check if context is provided
          setLocs(allLocations);
      }
   }, [allLocations, setLocs]);


  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      {/* Show loading if still fetching or total count isn't reached */}
      {isLoading && (allLocations.length < totalCount || totalCount === 0) && ( // Show loading if still fetching chunks
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '10px', background: 'rgba(255,255,255,0.8)', zIndex: 100, textAlign: 'center' }}>
          Loading locations... ({allLocations.length}{totalCount > 0 ? ` / ${totalCount}` : ''})
        </div>
      )}
      {error && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '10px', background: 'rgba(255,0,0,0.8)', color: 'white', zIndex: 100, textAlign: 'center' }}>Error: {error}</div>}

      {/* Use the renamed Map component */}
      <GoogleMapComponent
        defaultCenter={ZoomLocs}
        defaultZoom={Zoom}
        gestureHandling={'greedy'}
        mapId={'6d4a78bd07042b18'}
      >
        {/* Pass the fetched locations to PoiMarkers */}
        <PoiMarkers pois={locationsForMarkers} />
      </GoogleMapComponent>
    </APIProvider>
  );
};

// --- Helper function for running functions that return promises with concurrency limit ---
async function runTasksWithConcurrencyLimit(taskFunctions, limit) {
    const pool = new Set();
    let index = 0; // Index for the next task function to enqueue

    return new Promise((resolve, reject) => {
        const enqueueNext = () => {
            // Stop enqueuing if no more tasks or component unmounted/redirected
            if (!isMounted.current || redirected.current || index >= taskFunctions.length) {
                 // If all tasks enqueued AND the pool is currently empty, we are done
                 if (pool.size === 0 && index >= taskFunctions.length) {
                      // console.log("Concurrency runner: All tasks enqueued and pool empty. Resolving.");
                     resolve(); // Resolve the main promise
                 }
                 return; // No more tasks to enqueue or invalid state
            }

            const currentTaskIndex = index++; // Get the index for the task function to run NOW
            const taskFunction = taskFunctions[currentTaskIndex]; // Get the function reference

            // Call the function to get the promise and add it to the pool
            const promise = taskFunction(); // <-- Execute the function here to get the promise
            pool.add(promise);

            // When the promise settles ( سواء fulfilled or rejected)
            promise
                .then(() => {
                    // Task completed successfully
                 })
                .catch(error => {
                     // Task failed - log it
                     console.error(`Concurrency runner: Task at index ${currentTaskIndex} failed.`, error);
                     // The error is re-thrown by the taskFunction itself, which will be caught
                     // by the main fetchData catch block due to the `await runTasksWithConcurrencyLimit`.
                     // We don't necessarily need to call `reject(error)` here unless you want
                     // the *entire* runTasksWithConcurrencyLimit promise to reject immediately on *any* error,
                     // even if other tasks are still running. The current setup allows other tasks to finish.
                 })
                .finally(() => {
                    // Remove from pool
                    pool.delete(promise);
                    // Try to enqueue the next task from the queue, keeping concurrency up to limit
                    if (isMounted.current && !redirected.current) { // Check mount status before recursing
                         enqueueNext();
                    }
                });

            // If the pool has space, or if we just added the first task, try to enqueue the next
            // immediately to keep the pipeline full up to the limit.
            // Ensure we don't go beyond the total number of tasks available (`index < taskFunctions.length`).
            if (pool.size < limit && index < taskFunctions.length) {
                 enqueueNext();
            } else if (index >= taskFunctions.length && pool.size === 0) {
                 // Edge case: If we just added the *very last* task and the pool is now empty (because limit was >= remaining tasks)
                 // then all tasks are done, resolve immediately.
                  resolve();
            }
             // If pool is full, the `finally` callback of completed tasks will call `enqueueNext`.
        };

        // Start the process by enqueuing the initial set of tasks up to the limit
        for(let i = 0; i < limit && i < taskFunctions.length; i++) {
             if (!isMounted.current || redirected.current) { // Check mount status before initial enqueue
                 console.log("Concurrency runner: Component unmounted/redirected before starting initial tasks.");
                 return; // Stop starting tasks
             }
             enqueueNext();
        }

         // Handle case where taskFunctions is empty (total count was 0 or less than initial fetch size)
         if (taskFunctions.length === 0) {
            resolve();
         }
    });
}


// Make the refs available to the helper function scope (or pass them)
// A simpler way is to define the helper *inside* the component or use context,
// but passing them explicitly is cleaner for standalone functions.
// Let's pass the refs explicitly to the helper.

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

            const promise = taskFunction(); // Execute the function to get the promise
            pool.add(promise);

            promise
                .then(() => {}) // Success handler (optional, taskFunction handles its own success actions)
                .catch(error => {
                     console.error(`Concurrency runner: Task at index ${currentTaskIndex} failed.`, error);
                     // Error is re-thrown by taskFunction and caught by main fetchData catch
                 })
                .finally(() => {
                    pool.delete(promise);
                    // Try to enqueue the next task, keeping concurrency up to limit
                    if (isMountedRef.current && !redirectedRef.current) { // Use refs
                         enqueueNext();
                    }
                });

            // If pool has space, try to enqueue next immediately
            if (pool.size < limit && index < taskFunctions.length) {
                 enqueueNext();
            } else if (index >= taskFunctions.length && pool.size === 0) {
                 // All tasks submitted, and pool is empty -> done immediately
                  resolve();
            }
        };

        // Start initial tasks
        for(let i = 0; i < limit && i < taskFunctions.length; i++) {
             if (!isMountedRef.current || redirectedRef.current) {
                 console.log("Concurrency runner: Component unmounted/redirected before starting initial tasks.");
                 return;
             }
             enqueueNext();
        }
         // Handle empty task list edge case
         if (taskFunctions.length === 0) {
            resolve();
         }
    });
}


export default MapComp;