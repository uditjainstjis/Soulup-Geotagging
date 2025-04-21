import React, { useEffect, useState } from "react";
import { useUserLocation } from "./useLocation"; // Your location hook
import { useSession } from "next-auth/react";

const SurveyBox = ({ onClose }) => {
    const [question, setQuestion] = useState(null);
    const [tags, setTags] = useState([]); // Tags associated with the survey question
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Prevent double clicks

    // --- Hooks ---
    const { data: session } = useSession();
    const { location, locationRecieved, city } = useUserLocation(); // Destructure needed values

    // --- Fetch Survey Question ---
    useEffect(() => {
        async function fetchSurveyQuestion() {
            setLoading(true);
            setError(null);
            try {
                console.log("Fetching survey question...");
                const res = await fetch("/api/surveyQuestion");

                if (!res.ok) {
                    if (res.status === 409) {
                        console.log("Survey already responded or not applicable.");
                        setError("Already Responded"); // Set error state to prevent rendering
                    } else {
                        console.error("Survey API call failed with status:", res.status);
                        throw new Error(`Failed to fetch survey question (Status: ${res.status})`);
                    }
                } else {
                    const data = await res.json();
                    console.log("Received survey data:", data);

                    if (data && data.display && data.question) {
                        console.log("Displaying survey question:", data.question);
                        setQuestion(data.question);
                        setTags(data.possibleTags || []); // Ensure tags is an array
                    } else {
                        console.log("Survey question not displayed.");
                        // Set error or simply don't set question, so box doesn't render
                        setQuestion(null);
                    }
                }
            } catch (err) {
                console.error("Error fetching survey question:", err);
                setError("Could not load survey question");
            } finally {
                setLoading(false);
            }
        }

        fetchSurveyQuestion();
    }, []); // Run only once on mount

    // --- Function to fetch User Details (Gender, AgeBracket etc.) ---
    async function fetchUserDetails() {
        if (!session) return null; // Need session to make authenticated request
        try {
            const response = await fetch('/api/userdetails'); // Your existing endpoint
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched user details:", data);
                return data; // Return details
            } else {
                console.error("Failed to fetch user details, status:", response.status);
                return null;
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    }

    // --- Function to Update User Location (Calls the new backend API) ---
    async function updateUserLocation() {
        // 1. Check prerequisites
        if (!session?.user?.email) {
            console.warn("User email not found in session. Cannot update location.");
            return; // Silently return or alert user if preferred
        }
        if (!locationRecieved || !location?.latitude || !location?.longitude) {
            console.warn("Location not available or not received yet. Cannot update location.");
            alert("Location data is not available. Please ensure location services are enabled and try again.");
            return;
        }
         if (!city) {
            console.warn("City data not available. Cannot update location.");
            // Decide if this is critical - maybe fetch city again or allow proceeding without it?
            // alert("City data is not available.");
            // return;
        }

        // Determine the tag to send - using the first tag from the survey question context
        const tagToSend = tags && tags.length > 0 ? tags[0] : "General"; // Use first tag or a default
        console.log(`Using tag: ${tagToSend} for location update.`);

        // 2. Fetch supplementary user details (optional, but needed for gender etc.)
        const userDetailsData = await fetchUserDetails(); // Returns null on failure

        // 3. Construct the request body
        const body = {
            location: {
                lat: location.latitude,
                lng: location.longitude,
            },
            city: city || "Unknown", // Provide a fallback for city if needed
            tag: tagToSend,
            // User details (use fetched data or fallbacks)
            name: userDetailsData?.name || session.user.name || null,
            gender: userDetailsData?.gender || null,
            ageBracket: userDetailsData?.ageBracket || null,
            socialProfile: userDetailsData?.socialProfile || null,
            profilePhoto: userDetailsData?.profilePhoto || session.user.image || null,
            // Email is handled by the session on the backend
        };

        console.log("Sending data to /api/updateLocation:", body);

        // 4. Make the API call
        try {
            const res = await fetch('/api/updateLocation', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json(); // Always try to parse JSON

            if (res.ok && data.success) {
                console.log("Location update successful:", data.message);
                // Optionally show a success message to the user
                // alert("Location context updated!");
            } else {
                console.error("Failed to update location:", data.error || `Status: ${res.status}`);
                // Optionally alert the user about the failure
                // alert(`Failed to update location context: ${data.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error("Network or other error updating location:", err);
            // alert("An error occurred while updating location context.");
        }
    }


    // --- Function to Handle Survey Response Submission ---
    const submitResponse = async (answer) => {
        if (isSubmitting) return; // Prevent double submission
        setIsSubmitting(true);

        try {
            // Step 1: Submit the survey response
            console.log(`Submitting survey response: ${answer} for question: ${question}`);
            const res = await fetch("/api/submitResponse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, answer, tags }), // Send original tags array
            });

            const submitData = await res.json(); // Try parsing JSON regardless of status

            if (!res.ok || !submitData.success) {
                 console.error("Failed to submit survey response:", submitData.error || `Status: ${res.status}`);
                throw new Error(submitData.error || "Failed to submit response");
            }

            console.log("Survey response submitted successfully!");
            alert("Response submitted successfully!"); // Inform user

            // Step 2: Trigger the location update (fire-and-forget or await)
            console.log("Triggering location update...");
            await updateUserLocation(); // Wait for it to finish if needed, or just call it without await

            onClose(); // Close the survey box

        } catch (error) {
            console.error("Error during submission process:", error);
            alert(`Error submitting response: ${error.message}`);
        } finally {
            setIsSubmitting(false); // Re-enable buttons
        }
    };

    // --- Render Logic ---
    if (loading) {
        console.log("SurveyBox is loading...");
        return null; // Or a loading spinner
    }

    // Don't render if there was an error fetching or no question is set
    if (error || !question) {
        console.log(`Not rendering SurveyBox. Error: ${error}, Question: ${question}`);
        return null;
    }

    // Render the survey box
    return (
        <div className="bg-white border-4 border-pink-400 shadow-lg rounded-2xl p-5 w-full max-w-md mx-auto my-4 text-center"> {/* Added max-width and centering */}
            <h4 className="text-blue-950 font-semibold">Hey, we are running a quick poll!</h4>
            <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-4 break-words">{question}</h4> {/* Added margin and break-words */}
            <div className="flex justify-center gap-4 mt-4">
                <button
                    className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition disabled:opacity-50"
                    onClick={() => submitResponse("Yes")}
                    disabled={isSubmitting} // Disable button while submitting
                >
                    Yes
                </button>
                <button
                    className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition disabled:opacity-50"
                    onClick={() => submitResponse("No")}
                    disabled={isSubmitting} // Disable button while submitting
                >
                    No
                </button>
            </div>
        </div>
    );
};

export default SurveyBox;