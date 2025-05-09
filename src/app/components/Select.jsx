// ./Select.js (Modified)
import React, { useContext, useEffect, useState } from "react";
import { useUserLocation } from "./useLocation";
import TimeDropdown from "./TimeDropdown";
// import Buttons from "./buttons"; // No longer directly imported here
import SelectDropdown from "./SelectDropdown";
import { MainLocations } from "./contexts";
import SurveyBox from "./SurveyBox";
import { useSession } from "next-auth/react";
import ActionButtonsController from "./ActionButtonsController"; // Import the new component

const Select = () => {
    const { Locs, setLocs } = useContext(MainLocations); // 'Locs' is declared but not used. Consider removing if not needed.

    const [show, setShow] = useState(false);
    const [count, setCount] = useState(null);
    const [isDisabled, setisDisabled] = useState(false);
    const [optionValue, setOptionValue] = useState("");
    const [timeValue, setTimeValue] = useState("");
    const [showSurvey, setShowSurvey] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const { data: session } = useSession();

    const [windowPeriod, setWindowPeriod] = useState(24); // Renamed from 'window' to avoid conflict

    useEffect(() => {
        async function call() {
            const response = await fetch('/api/hourSize');
            const data = await response.json();
            setWindowPeriod(data.windowWidth);
        }
        call();
    }, []);

    const { location, locationRecieved, city } = useUserLocation();
    const [originalLocs, setOriginalLocs] = useState([]);

    async function searchPeopleWithSameIssue(encodedTag) { // setLocs is already available from context
        try {
            const response = await fetch(
                `/api/Search-People-With-Same-Issue?tag=${encodedTag}&city=${city}`,
                { method: "GET" }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched Data:", data);
                setLocs(data.locations);
                setCount(data.count);
                setOriginalLocs(data.locations);
            } else {
                const errorData = await response.json();
                console.error("Error response:", errorData);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while searching. Please try again later.");
        }
    }

    async function fetchUserDetails() {
        try {
            const response = await fetch('/api/userdetails');
            if (response.ok) {
                const data = await response.json();
                setUserDetails(data); // Store for potential reuse
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

    // Renamed for clarity when passing as prop
    function handleSearchAction() {
        setShow(true);
        setisDisabled(true);
        // setShowButton(false); // This logic is now in ActionButtonsController
        // setTellButton(true);  // This logic is now in ActionButtonsController (based on timeValue)

        const encodedTag = encodeURIComponent(optionValue);
        if (optionValue.trim() !== "") {
            searchPeopleWithSameIssue(encodedTag);

            setTimeout(() => {
                setShowSurvey(true);
            }, 2000);
        } else {
            alert("Select some option to search for that");
        }
    }

    // Renamed for clarity when passing as prop
    async function handleTellPeopleAction() {
        if (!session?.user?.email) {
            alert("User email not found in session. Please ensure you are logged in.");
            return;
        }

        // Attempt to use already fetched details, or fetch them if not available
        const details = userDetails || await fetchUserDetails();

        if (!details) {
            alert("Failed to fetch user details. Please try again.");
            return;
        }
        
        if (!locationRecieved || !location || !city) {
            alert("Location data is not available. Please enable location services or wait for it to be determined.");
            return;
        }

        const sendingBody = {
            city: city,
            tag: optionValue,
            location: { lat: location.latitude, lng: location.longitude },
            email: session.user.email,
            gender: details?.gender || null,
            ageBracket: details?.ageBracket || null,
            socialProfile: details?.socialProfile || null,
            profilePhoto: session?.user?.image || null,
        };
        const encodedTag = encodeURIComponent(optionValue);
        console.log("I am sending this", sendingBody);

        // No need for another locationRecieved check here as it's checked above
        fetch('/api/addOurTag', {
            method: "POST",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(sendingBody)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            searchPeopleWithSameIssue(encodedTag); // Re-fetch to update list
        })
        .catch(err => { console.log("Failed to send data", err); });
    }

    // The useEffects that set showButton and tellButton are now in ActionButtonsController

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full mt-16">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                What key challenge are you facing currently?
            </h4>

            <h6 className="text-xs text-gray-600 mb-2">
                SoulUp currently allows you to only add only 1 challenge in {windowPeriod} hours to prevent misuse of the geotagging feature.
            </h6>

            <div className="flex flex-col gap-4">
                <SelectDropdown
                    optionValue={optionValue}
                    setOptionValue={setOptionValue}
                    isDisabled={isDisabled}
                />

                {show && (
                    <TimeDropdown
                        timeValue={timeValue}
                        setTimeValue={setTimeValue}
                        originalLocs={originalLocs}
                    />
                )}
                {show && <p className="text-sm">Found {count} other's like you, {originalLocs.length} within your city</p>}

                <ActionButtonsController
                    optionValue={optionValue}
                    timeValue={timeValue}
                    onSearchClick={handleSearchAction}
                    onTellPeopleClick={handleTellPeopleAction}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-lg w-full mt-6">
                {showSurvey && <SurveyBox onClose={() => setShowSurvey(false)} />}
            </div>
            <div className="flex flex-row items-center mt-4"> {/* Added items-center for vertical alignment */}
                <img src="cluster.png" className="w-16 h-16 mr-3" alt="Map cluster icon"></img> {/* Added alt text & ensure fixed size */}
                <p className="text-xs text-start">
                    These blue and red circles show there are that no. of people in that area
                </p>
            </div>
        </div>
    );
};

export default Select;