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

  const verifyPassword = async () => {
    const res = await fetch("/api/verify-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.success) {
      setAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    async function fetchSurveyQuestion() {
      try {
        const res = await fetch("/api/surveyQuestion2");
        const data = await res.json();
        if (res.ok) {
          setQuestion(data.question);
          setDisplay(data.display);
          setPrevQuestion(data.question);
          setPrevDisplay(data.display);
        }
      } catch (error) {
        setError(`Failed to fetch survey question ${error}`);
      } finally {
        setLoading(false);
      }
    }
    fetchSurveyQuestion();
  }, [authenticated]);

  async function saveSurveyQuestion() {
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, display })
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Survey question updated!");
      setPrevQuestion(question);
      setPrevDisplay(display);
    } catch (error) {
      alert(`Error saving survey question ${error}`);
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin Survey Panel</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md text-left">
              <h3 className="text-lg font-semibold text-gray-700">Previously Used Question:</h3>
              <p className="text-gray-800">{prevQuestion || "No previous question available"}</p>
              <p className={`mt-2 font-medium ${prevDisplay ? "text-green-600" : "text-red-600"}`}>
                {prevDisplay ? "Displayed to users ✅" : "Not displayed ❌"}
              </p>
            </div>

            <textarea
              className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter new survey question"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-gray-700">Display Question:</span>
              <button
                className={`w-16 h-8 flex items-center rounded-full p-1 transition duration-300 ${display ? "bg-green-500" : "bg-red-300"}`}
                onClick={() => setDisplay(!display)}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${display ? "translate-x-8" : "translate-x-0"}`}
                ></div>
              </button>
            </div>
            <button
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              onClick={saveSurveyQuestion}
            >
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSurveyPanel;
