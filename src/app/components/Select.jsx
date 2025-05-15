import React, { use, useContext, useEffect, useState } from "react";
import { useUserLocation } from "./useLocation";
import TimeDropdown from "./TimeDropdown";
import Buttons from "./buttons"; // Make sure this path is correct
import SelectDropdown from "./SelectDropdown"; // Make sure this path is correct
import { MainLocations } from "./contexts"; // Make sure this path is correct
import SurveyBox from "./SurveyBox"; // Make sure this path is correct
import { useSession } from "next-auth/react"; // Make sure this path is correct
import Image from "next/image";
import SuccessPopup from "./SuccessPopup"; // Make sure this path is correct
import RateLimitPopup from "./RateLimitPopup"; // Make sure this path is correct


const Select = () => {
    var { Locs, setLocs } = useContext(MainLocations);

    const [showButton, setShowButton] = useState(false); // Controls visibility of the first button ("Search")
    const [tellButton, setTellButton] = useState(false); // Controls visibility of the second button ("Tell People")
    const [show, setShow] = useState(false); // Controls visibility of search results & TimeDropdown
    const [count, setCount] = useState(null)
    const [isDisabled, setisDisabled] = useState(false); // Disables the dropdown after clicking Search
    const [optionValue, setOptionValue] = useState(""); // Selected challenge tag
    const [timeValue, setTimeValue] = useState(""); // Selected time for visibility

    const [showSurvey, setShowSurvey] = useState(false); // Track survey visibility
    const [userDetails, setUserDetails] = useState(null); // State to store user details
    const { data: session } = useSession(); // Get session for email

    const [window, setWindow] = useState(24)

    // State for the custom popups
    const [showRateLimitPopup, setShowRateLimitPopup] = useState(false);
    const [rateLimitMessage, setRateLimitMessage] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showCard, setShowCard] = useState(true);

    // State to store the details of the tag that was just added for undo functionality
    const [lastAddedTagDetails, setLastAddedTagDetails] = useState(null); // Store { tagId, tag }


    // Log initial state on mount
    useEffect(() => {
        console.log("--- Component Initialized ---");
        console.log("Initial State: { showButton:", showButton, ", tellButton:", tellButton, ", show:", show, ", isDisabled:", isDisabled, ", optionValue:", optionValue, ", timeValue:", timeValue, "}");
    }, []); // Runs only once on mount


    // Fetch window width on mount
    useEffect(()=>{
        async function call(){
            try {
                const response = await fetch('/api/hourSize');
                if(response.ok) {
                    const data = await response.json();
                    console.log("Fetched hour size:", data.windowWidth);
                    setWindow(data.windowWidth);
                } else {
                    console.error("Failed to fetch hour size");
                    setWindow(24); // Default fallback
                }
            } catch (error) {
                console.error("Error fetching hour size:", error);
                setWindow(24); // Default fallback
            }
        }
        call();
    }, []);

    const { location, locationRecieved, city } = useUserLocation();
    const [originalLocs, setOriginalLocs] = useState([]); // Store unfiltered locations

    // Function to search for people with the same issue
    async function searchPeopleWithSameIssue(encodedTag, setLocs) {
       console.log("--- Calling searchPeopleWithSameIssue ---");
       console.log("Searching for tag:", decodeURIComponent(encodedTag), "in city:", city);
       try {
           const response = await fetch(
               `api/Search-People-With-Same-Issue?tag=${encodedTag}&city=${city}`,
               { method: "GET" }
           );

           if (response.ok) {
               const data = await response.json();
               console.log("Fetched Search Data:", data);

               setLocs(data.locations);
               setCount(data.count);
               setOriginalLocs(data.locations); // Store the original full list for resetting
           } else {
               const errorData = await response.json();
               console.error("Error response from search:", errorData);
                setLocs([]);
                setCount(0);
                setOriginalLocs([]);
                console.warn(errorData.message || "Failed to search for people.");
           }
       } catch (error) {
           console.error("Error during search:", error);
            setLocs([]);
            setCount(0);
            setOriginalLocs([]);
            console.error("An error occurred while searching.", error);
       }
    }

    // Function to fetch user details
    async function fetchUserDetails() {
        console.log("--- Fetching user details ---");
        try {
            const response = await fetch('/api/userdetails');
            if (response.ok) {
                const data = await response.json();
                setUserDetails(data);
                 console.log("User details fetched.");
                return data;
            } else {
                console.error("Failed to fetch user details");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    }

    // Handler for the first button ("Search")
    function handleFirstButton() {
        console.log("--- handleFirstButton clicked ---");
        console.log("State before handleFirstButton:", { show, isDisabled, showButton, tellButton });

        const encodedTag = encodeURIComponent(optionValue);
        if (optionValue.trim() === "") {
            alert("Select a challenge before searching."); // Keep this alert for validation
            return; // Stop execution if validation fails
        }

        // State updates after successful validation
        setShow(true); // Show search results and time dropdown
        setisDisabled(true); // Disable the challenge dropdown
        setShowButton(false); // Hide the "Search" button
        setTellButton(true)

        console.log("State updates initiated by handleFirstButton:", { show: true, isDisabled: true, showButton: false });


        searchPeopleWithSameIssue(encodedTag, setLocs);

        // Show the survey box after 2 seconds (Keep this if needed)
        setTimeout(() => {
            setShowSurvey(true); console.log("Showing survey");
        }, 2000);

    }

    // --- Function to handle the undo action ---
    async function handleUndoClick() {
        console.log("--- handleUndoClick clicked ---");
        // Check if we have the details (specifically the tagId) of the last added tag
        if (!lastAddedTagDetails || !lastAddedTagDetails.tagId) {
            console.error("No tag ID available to undo. State:", lastAddedTagDetails);
             setShowSuccessPopup(false); // Close popup anyway if state is missing/invalid
            alert("Cannot undo: Information about the last added tag is missing.");
            return;
        }

        // Get the tag ID and name from the stored state
        const { tagId, tag: tagName } = lastAddedTagDetails;
        console.log("Attempting undo for tagId:", tagId, "tag:", tagName);

        try {
            const response = await fetch('/api/undoTag', {
                method: 'DELETE', // Use DELETE method for deletion
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify({
                    tagId: tagId, // Send the tag ID to the backend
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Undo success:", data.message);

                // Refresh the map/search results after successful undo
                // Use the stored tag name to refresh the search for that tag
                const encodedTag = encodeURIComponent(tagName || optionValue); // Fallback to current optionValue
                searchPeopleWithSameIssue(encodedTag, setLocs);

                // Clear the stored tag details as it's now undone
                setLastAddedTagDetails(null);
                console.log("Cleared lastAddedTagDetails after successful undo.");


            } else {
                const errorData = await response.json();
                console.error("Undo failed:", errorData.message);
                alert(errorData.message || "Failed to undo the tag.");
            }
        } catch (err) {
            console.error("Error during undo fetch:", err);
            alert("An error occurred while trying to undo. Please try again.");
        } finally {
             // Always close the success popup after the undo attempt (success or fail)
             console.log("Closing success popup after undo attempt.");
             setShowSuccessPopup(false);
        }
    }
    // --- End Undo function ---


    // Handler for the second button ("Tell People")
    async function handleTellPeople() {
        console.log("--- handleTellPeople clicked ---");
        // Basic validation
        if (!session?.user?.email) {
            alert("User email not found in session. Please ensure you are logged in.");
            return;
        }
        if (!locationRecieved || !location?.latitude || !location?.longitude) {
            alert("Cannot proceed, please allow Location access in your browser settings.");
            return;
        }
         if (optionValue.trim() === "") {
            alert("Please select a challenge first.");
            return;
        }

        console.log("Validation passed for handleTellPeople. Proceeding with fetch.");
        const userDetailsData = await fetchUserDetails(); // Fetch user details here


        const sendingBody = {
            city: city,
            tag: optionValue, // Use the currently selected tag
            location: { lat: location.latitude, lng: location.longitude },
            email: session.user.email, // Include email for backend identification
            name: session.user.name, // Include name if your backend uses it
            gender: userDetailsData?.gender || null,
            ageBracket: userDetailsData?.ageBracket || null,
            socialProfile: userDetailsData?.socialProfile || null,
            profilePhoto: session?.user?.image || null,
        };

        console.log("Attempting to send tag:", sendingBody);


        fetch('/api/addOurTag', {
            method: "POST",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(sendingBody)
        })
        .then(response => {
            // Handle non-OK responses (rate limit, other errors)
            if (!response.ok) {
                 return response.json().then(data => {
                     const error = new Error(data.message || `API error: ${response.status}`);
                     error.status = response.status; // Attach status
                     error.messageContent = data.message; // Store message content
                     error.isRateLimit = (response.status === 429); // Flag rate limit specifically
                     throw error; // Throw the error to the catch block
                 });
            }
             // If response is OK, parse JSON
            return response.json();
        })
        .then(data => {
            // This block is only reached if the response was OK (status 2xx)
            console.log("Add tag success:", data);

            // Store the received tagId and tag name for undo
            if (data.tagId) {
                 setLastAddedTagDetails({ tagId: data.tagId, tag: optionValue }); // Store received ID and the tag name
                 console.log("Stored for undo:", { tagId: data.tagId, tag: optionValue });
            } else {
                 console.warn("API did not return tagId. Undo functionality might not work.");
                 setLastAddedTagDetails(null); // Clear state if ID is missing
            }

            // Show the success popup
            setShowSuccessPopup(true);
            console.log("Showing success popup");


            // Since the tag was added, refresh the search results
            const encodedTag = encodeURIComponent(optionValue);
            searchPeopleWithSameIssue(encodedTag, setLocs);
        })
        .catch(err => {
            console.error("Failed to send data", err);
            // Handle errors caught from the promise chain
            if (err.isRateLimit) {
                setRateLimitMessage(err.messageContent || "Sorry, you are doing this too often.");
                setShowRateLimitPopup(true);
                console.log("Showing rate limit popup.");
            } else {
                 // Show a generic error for other failures
                alert(err.messageContent || err.message || "An error occurred while adding your challenge. Please try again.");
            }
             // Clear lastAddedTagDetails on failure, as no tag was successfully added
             setLastAddedTagDetails(null); // IMPORTANT: Clear state on failure
             console.log("Cleared lastAddedTagDetails on failure.");
        });
    }

    // Effect to control the visibility of the first button ("Search")
    // It shows when a challenge option is selected and the dropdown is not disabled
    useEffect(() => {
        const shouldShow = optionValue.trim() !== "" && !isDisabled;
        console.log(`Effect [optionValue, isDisabled]: optionValue='${optionValue}', isDisabled=${isDisabled} -> Setting showButton=${shouldShow}`);
        setShowButton(shouldShow);
    }, [optionValue, isDisabled]);


    // Effect to control the visibility of the second button ("Tell People")
    // This shows when time is selected AND the first button has been clicked (show is true)
    useEffect(() => {
        const shouldShow = show && timeValue.trim() !== "";
        console.log(`Effect [timeValue, show]: timeValue='${timeValue}', show=${show} -> Setting tellButton=${shouldShow}`);
        // setTellButton(shouldShow);
    }, [timeValue, show]);


    // Effect to log state changes relevant to rendering for debugging
    useEffect(() => {
         console.log(`RENDER STATE: showButton=${showButton}, tellButton=${tellButton}, show=${show}, isDisabled=${isDisabled}`);
    }, [showButton, tellButton, show, isDisabled]);


    return (
        <div className=" w-full ">
            {/* Main form/selection area */}
            <div className="flex flex-col gap-4 text-xl font-bold rounded-xl p-4"> {/* Added padding */}
                <SelectDropdown
                    optionValue={optionValue}
                    setOptionValue={setOptionValue}
                    isDisabled={isDisabled}
                />

                {/* Show TimeDropdown and search results only if 'show' is true */}
                {show && (
                    <>
                        <TimeDropdown
                            timeValue={timeValue}
                            setTimeValue={setTimeValue}
                            originalLocs={originalLocs} // Pass the original data
                            setLocs={setLocs}
                            Locs={Locs}
                        />
                        {/* Search results display block */}
                        {showCard && (
  <div className="relative">
    <div className="absolute top-2 right-2 z-20 cursor-pointer" onClick={() => setShowCard(false)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-500 hover:text-gray-700"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414
          1.414L11.414 10l4.293 4.293a1 1 0 01-1.414
          1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586
          10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>

    {/* Your Card Starts Here */}
    <div className="relative flex justify-center items-center text-center mt-8">
      <div className="bg-yellow-500 rounded-full text-center flex items-center justify-center text-white w-32 h-10 mx-auto absolute -bottom-5 z-10">
        YAY
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-around pt-12 relative z-0">
      <h2 className="text-[1.30rem] text-center tracking-widest font-sans w-full max-w-md mx-auto break-words px-4">
        We found <span className="underline">{count}</span> people solving the same challenge as you!
      </h2>
      <br />
      <div className="flex flex-row gap-4 ml-2 items-center">
        <Image src='/avatar.png' className="ml-4 mb-6" width={35} height={35} alt="avatar" />
        <span className="tracking-wider text-center font-sans font-light mb-6">
          {originalLocs.length} people found in your own city
        </span>
      </div>
    </div>
  </div>
)}


                    </>
                )}

                {/* Buttons component - Pass visibility flags and handlers */}
                {/* The Buttons component's internal logic determines which button to show based on showButton and tellButton */}
                <Buttons
                    showButton={showButton} // true when option selected & not disabled
                    tellButton={tellButton} // true when time selected AND show is true
                    handleFirstButton={handleFirstButton} // Search button handler
                    handleTellPeople={handleTellPeople} // Tell People button handler
                />

            </div>

            {/* Survey Box */}
             <div className="w-full mt-6 ">
                 {showSurvey && <SurveyBox onClose={() => setShowSurvey(false)} />}
             </div>


            {/* Render the custom rate limit popup */}
            {showRateLimitPopup && (
                <RateLimitPopup
                    message={rateLimitMessage}
                    onClose={() => setShowRateLimitPopup(false)}
                />
            )}

            {/* Render the new custom success popup */}
            {showSuccessPopup && (
                <SuccessPopup
                    onClose={() => setShowSuccessPopup(false)} // Close button/backdrop handler
                    onUndo={handleUndoClick} // Pass the undo handler
                />
            )}
        </div>
    );
};

export default Select;