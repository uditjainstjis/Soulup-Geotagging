'use client'
import React, { useEffect, useState } from "react";

const AdminSurveyPanel = () => {
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [question, setQuestion] = useState("");
    const [display, setDisplay] = useState(false);
    const [prevQuestion, setPrevQuestion] = useState("");
    const [prevDisplay, setPrevDisplay] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [possibleTagsInput, setPossibleTagsInput] = useState("");
    const [prevPossibleTags, setPrevPossibleTags] = useState([]);
    // New states for hourSize window
    const [hourSizeWindow, setHourSizeWindow] = useState("");
    const [prevHourSizeWindow, setPrevHourSizeWindow] = useState("");


    const verifyPassword = async () => {
        try {
            const res = await fetch("/api/verify-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();
            if (data.success) {
                setAuthenticated(true);
                // Use a more Tailwind-friendly success style
                alert("Login Successful");

            } else {
                alert("Invalid password");
            }
        } catch (error) {
            console.error("Error during password verification:", error);
            alert("Error during password verification.");
        }
    };

    useEffect(() => {
        if (!authenticated) return;

        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                // Fetch survey question
                const questionRes = await fetch("/api/surveyQuestion2");
                if (!questionRes.ok) throw new Error(`Failed to fetch survey question: ${questionRes.status}`);
                const questionData = await questionRes.json();
                setQuestion(questionData.question);
                setDisplay(questionData.display);
                setPrevQuestion(questionData.question);
                setPrevDisplay(questionData.display);
                setPossibleTagsInput(questionData.possibleTags ? questionData.possibleTags.join('\n') : ""); // Populate with existing tags
                setPrevPossibleTags(questionData.possibleTags || []);


                // Fetch tags
                const tagsRes = await fetch("/api/tags");
                if (!tagsRes.ok) throw new Error(`Failed to fetch tags: ${tagsRes.status}`);
                const tagsData = await tagsRes.json();
                setTags(tagsData.tags);
                setTagInput(tagsData.tags.join('\n'));

                // Fetch hourSizeWindow
                const hourSizeRes = await fetch("/api/hourSize");
                if (!hourSizeRes.ok) throw new Error(`Failed to fetch hourSize: ${hourSizeRes.status}`);
                const hourSizeData = await hourSizeRes.json();
                setHourSizeWindow(String(hourSizeData.windowWidth)); // Convert to string for input
                setPrevHourSizeWindow(String(hourSizeData.windowWidth)); // Set prev value too

            } catch (err) {
                setError(`Error fetching data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [authenticated]);

    async function saveSurveyQuestion() {
        try {
            const possibleTagsArray = possibleTagsInput.split('\n').map(tag => tag.trim()).filter(tag => tag);
            const res = await fetch("/api/survey", { // Replace with your API endpoint
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, display, possibleTags: possibleTagsArray })
            });
            if (!res.ok) {
                throw new Error(`Failed to save survey question: ${res.status}`);
            }
            const data = await res.json();
            if (data.success) {
                alert("Survey question saved successfully!");
                setPrevQuestion(question);
                setPrevDisplay(display);
                setPrevPossibleTags(possibleTagsArray);
            } else {
                alert("Failed to save survey question.");
            }

        } catch (error) {
            console.error("Error saving survey question:", error);
            alert("Error saving survey question.");
        }
    }


    async function saveTags() {
        try {
            const tagsArray = tagInput.split('\n').map(tag => tag.trim()).filter(tag => tag);
            const res = await fetch("/api/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tags: tagsArray })
            });
            if (!res.ok) throw new Error("Failed to save tags");
            alert("Tags updated successfully!");
            setTags(tagsArray);
        } catch (error) {
            alert(`Error saving tags: ${error}`);
        }
    }

    async function saveHourSizeWindow() {
        try {
            const res = await fetch("/api/hourSize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ windowWidth: Number(hourSizeWindow) }) // Send as number
            });
            if (!res.ok) throw new Error("Failed to save Hour Size Window");
            alert("Hour Size Window updated successfully!");
            setPrevHourSizeWindow(hourSizeWindow); // Update prev value on success
        } catch (error) {
            alert(`Error saving Hour Size Window: ${error}`);
        }
    }


    if (!authenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-6">
                <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin Login</h2>
                    <input
                        type="password"
                        className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                    />
                    <button
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                        onClick={verifyPassword}
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md py-4">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
                </div>
            </header>

            <main className="container mx-auto p-6">
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Updated to lg:grid-cols-3 */}

                        {/* Survey Question Section */}
                        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 transition-shadow hover:shadow-xl">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Survey Question</h2>

                            {/* Previously Used Question */}
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md text-left border border-gray-200">
                                <h3 className="text-md font-semibold text-gray-700">Previously Used:</h3>
                                <p className="text-gray-800">{prevQuestion || "No previous question"}</p>
                                <p className={`mt-2 font-medium ${prevDisplay ? "text-green-600" : "text-red-600"}`}>
                                    {prevDisplay ? "Displayed ✅" : "Not displayed ❌"}
                                </p>
                                {prevPossibleTags.length > 0 && (
                                    <div className="mt-2">
                                        <h4 className="font-medium">Possible Tags:</h4>
                                        <ul className="list-disc list-inside text-gray-700">
                                            {prevPossibleTags.map((tag, index) => (
                                                <li key={index}>{tag}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* New Survey Question */}
                            <div className="mb-4">
                                <label htmlFor="question" className="block text-sm font-medium text-gray-700">New Question</label>
                                <textarea
                                    id="question"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Enter new survey question"
                                    rows="3"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="possibleTags" className="block text-sm font-medium text-gray-700">Possible Tags (one per line)</label>
                                <textarea
                                    id="possibleTags"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-24"
                                    value={possibleTagsInput}
                                    onChange={(e) => setPossibleTagsInput(e.target.value)}
                                    placeholder="Enter possible tags, each on a new line"
                                    rows="3"
                                />
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <label htmlFor="display" className="text-gray-700">Display Question:</label>
                                <button
                                    id="display"
                                    className={`w-16 h-8 flex items-center rounded-full p-1 transition duration-300 ${display ? "bg-green-500" : "bg-red-300"}`}
                                    onClick={() => setDisplay(!display)}
                                >
                                    <div
                                        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${display ? "translate-x-8" : "translate-x-0"}`}
                                    ></div>
                                </button>
                            </div>

                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                                onClick={saveSurveyQuestion}
                            >
                                Save Survey Question
                            </button>
                        </div>

                        {/* Hour Size Window Section - MOVED TO MIDDLE */}
                        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 transition-shadow hover:shadow-xl">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Rate Limit Window (Hours)</h2>

                            {/* Previously Used Hour Size Window */}
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md text-left border border-gray-200">
                                <h3 className="text-md font-semibold text-gray-700">Current Window Size:</h3>
                                <p className="text-gray-800">{prevHourSizeWindow || "Not set"}</p>
                            </div>

                            {/* New Hour Size Window Input */}
                            <div className="mb-4">
                                <label htmlFor="hourSizeWindow" className="block text-sm font-medium text-gray-700">New Window Size (Hours)</label>
                                <input
                                    type="number"
                                    id="hourSizeWindow"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={hourSizeWindow}
                                    onChange={(e) => setHourSizeWindow(e.target.value)}
                                    placeholder="Enter hour size window"
                                    min="1" // Ensure minimum 1 hour
                                />
                            </div>

                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                                onClick={saveHourSizeWindow}
                            >
                                Save Hour Size Window
                            </button>
                        </div>

                        {/* Tags Section */}
                        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 transition-shadow hover:shadow-xl">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Tags</h2>

                            <div className="mb-4">
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Enter Tags (one per line)</label>
                                <textarea
                                    id="tags"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-40"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Enter tags, each on a new line"
                                />
                            </div>

                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                                onClick={saveTags}
                            >
                                Save Tags
                            </button>

                            {/* Display Existing Tags (Optional) */}
                            {tags.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-gray-700">Current Tags:</h3>
                                    <ul className="mt-1 text-gray-700">
                                        {tags.map((tag, index) => (
                                            <li key={index}>{tag}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>


                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminSurveyPanel;