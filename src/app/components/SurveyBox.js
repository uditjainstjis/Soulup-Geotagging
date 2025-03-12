import React, { useEffect, useState } from "react";

const SurveyBox = ({ onClose }) => {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchSurveyQuestion() {
            try {
                console.log("Fetching survey question...");
                const res = await fetch("/api/surveyQuestion");

                if (!res.ok) {
                    if(res.status == 409){
                        console.log("Already Responded")
                    }else{
                    console.error("API call failed with status:", res.status);
                    throw new Error("Failed to fetch survey question");
                    }
                }

                const data = await res.json();
                console.log("Received response:", data);

                if (data && data.display) {
                    console.log("Survey question is displayed:", data.question);
                    setQuestion(data.question);
                } else {
                    console.log("Survey question is not displayed (display is false or no question in DB).");
                }
            } catch (error) {
                console.error("Error fetching survey question:", error);
                setError("Could not load survey question");
            } finally {
                setLoading(false);
            }
        }

        fetchSurveyQuestion();
    }, []);

    const submitResponse = async (answer) => {
        try {
            const res = await fetch("/api/submitResponse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, answer }),
            });

            if (!res.ok) {
                throw new Error("Failed to submit response");
            }

            alert("Response submitted successfully!");
            onClose();
        } catch (error) {
            alert(`Error submitting response ${error}`);
        }
    };

    if (loading) {
        console.log("SurveyBox is loading...");
        return null; // Don't show anything while loading
    }

    if (error) {
        console.log("SurveyBox error:", error);
        return null;
    }

    if (!question) {
        console.log("No survey question found, not rendering SurveyBox.");
        return null;
    }

    return (
        <div className="bg-white border-4 border-pink-400 shadow-lg rounded-2xl p-5 w-full text-center">
            <h4 className="text-blue-950 font-semibold">Hey, we are running a quick poll!</h4>
            <h4 className="text-lg font-semibold text-gray-800 mt-6">{question}</h4>
            <div className="flex justify-center gap-4 mt-4">
                <button
                    className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition"
                    onClick={() => submitResponse("Yes")}
                >
                    Yes
                </button>
                <button
                    className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
                    onClick={() => submitResponse("No")}
                >
                    No
                </button>
            </div>
        </div>
    );
};

export default SurveyBox;
