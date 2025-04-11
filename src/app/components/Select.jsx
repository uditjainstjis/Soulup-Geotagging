import React, { useContext, useEffect, useState } from "react";
import { useUserLocation } from "./useLocation";
import TimeDropdown from "./TimeDropdown";
import Buttons from "./buttons";
import SelectDropdown from "./SelectDropdown";
import { MainLocations } from "./contexts";
import SurveyBox from "./SurveyBox"; // Import the new component
import { useSession } from "next-auth/react"; // Import useSession

const Select = () => {
    var { Locs, setLocs } = useContext(MainLocations);

    const [showButton, setShowButton] = useState(false);
    const [tellButton, setTellButton] = useState(false);
    const [show, setShow] = useState(false);
    const [isDisabled, setisDisabled] = useState(false);
    const [optionValue, setOptionValue] = useState("");
    const [timeValue, setTimeValue] = useState("");
    const [showSurvey, setShowSurvey] = useState(false); // Track survey visibility
    const [userDetails, setUserDetails] = useState(null); // State to store user details
    const { data: session } = useSession(); // Get session for email

    const { location, locationRecieved, city } = useUserLocation();
    const [originalLocs, setOriginalLocs] = useState([]); // Store unfiltered locations

    async function searchPeopleWithSameIssue(encodedTag, setLocs) {
        try {
            const response = await fetch(
                `api/Search-People-With-Same-Issue?tag=${encodedTag}&city=${city}`,
                { method: "GET" }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched Data:", data);

                setLocs(data);
                setOriginalLocs(data); // Store the original full list for resetting
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
            const response = await fetch('/api/userdetails'); // Assuming /api/userdetails fetches user details
            if (response.ok) {
                const data = await response.json();
                setUserDetails(data);
                return data; // Return user details for use in handleTellPeople
            } else {
                console.error("Failed to fetch user details");
                return null; // Return null if fetch fails
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null; // Return null if error occurs
        }
    }

    function handleFirstButton() {
        setShow(true);
        setisDisabled(true);
        setShowButton(false);
        setTellButton(true);

        const encodedTag = encodeURIComponent(optionValue);
        if (optionValue.trim() !== "") {
            searchPeopleWithSameIssue(encodedTag, setLocs);

            // Show the survey box after 2 seconds
            setTimeout(() => {
                setShowSurvey(true);
            }, 2000);
        } else {
            alert("Select some option to search for that");
        }
    }

    async function handleTellPeople() {
        if (!session?.user?.email) {
            alert("User email not found in session. Please ensure you are logged in.");
            return;
        }

        const userDetailsData = await fetchUserDetails(); // Fetch user details here

        if (!userDetailsData) {
            alert("Failed to fetch user details. Please try again.");
            return; // Stop if user details fetch fails
        }

        const sendingBody = {
            city: city,
            tag: optionValue,
            location: { lat: location.latitude, lng: location.longitude },
            email: session.user.email, // Include email for backend identification
            gender: userDetailsData?.gender || null, // Include gender from fetched details
            ageBracket: userDetailsData?.ageBracket || null, // Include ageBracket from fetched details
            socialProfile: userDetailsData?.socialProfile || null, // Include socialProfile from fetched details
            profilePhoto: session?.user?.image || null, // Include profilePhoto from session
        };
        const encodedTag = encodeURIComponent(optionValue);
        console.log("I am sending this", sendingBody);

        if (locationRecieved) {
            fetch('/api/addOurTag', {
                method: "POST",
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify(sendingBody)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                searchPeopleWithSameIssue(encodedTag, setLocs);
            })
            .catch(err => { console.log("Failed to send data", err); });
        } else {
            alert("Cannot proceed, Allow Location from the settings of the browser");
        }
    }

    useEffect(() => {
        setShowButton(optionValue.trim() !== "");
    }, [optionValue]);

    useEffect(() => {
        if (timeValue.trim() !== "") {
            setTimeout(() => {
                setTellButton(true);
            }, 450);
        } else {
            setTellButton(false);
        }
    }, [timeValue]);

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 w-full mt-16">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            What key challenge are you facing currently
            </h4>

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
                        originalLocs={originalLocs} // Pass the original data
                    />
                )}

                <Buttons
                    showButton={showButton}
                    tellButton={tellButton}
                    handleFirstButton={handleFirstButton}
                    handleTellPeople={handleTellPeople}
                />
            </div>

        <div className="bg-white rounded-2xl shadow-lg w-full mt-6 ">
            {showSurvey && <SurveyBox onClose={() => setShowSurvey(false)} />}
        </div>
            {/* Show Survey Box separately when triggered */}
        </div>


    );
};

export default Select;