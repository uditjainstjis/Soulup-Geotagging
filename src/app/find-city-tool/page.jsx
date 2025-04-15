"use client";

import { useState } from "react";
import axios from "axios";
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, MapPinIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; // Using outline icons for a lighter feel

export default function FindCityTool() {
  const [coordinateList, setCoordinateList] = useState([
    { id: 1, lat: "", lng: "", result: null, isLoading: false, error: null },
  ]);
  const [nextId, setNextId] = useState(2);

  const handleInputChange = (id, field, value) => {
    setCoordinateList((prevList) =>
      prevList.map((coord) =>
        coord.id === id ? { ...coord, [field]: value, result: null, error: null, isLoading: false } : coord
      )
    );
  };

  const addCoordinateRow = () => {
    setCoordinateList((prevList) => [
      ...prevList,
      { id: nextId, lat: "", lng: "", result: null, isLoading: false, error: null },
    ]);
    setNextId((prevId) => prevId + 1);
  };

  const removeCoordinateRow = (idToRemove) => {
    setCoordinateList((prevList) =>
      prevList.filter((coord) => coord.id !== idToRemove)
    );
  };

  const findCity = async (id) => {
    const coordIndex = coordinateList.findIndex((coord) => coord.id === id);
    if (coordIndex === -1) return;

    const coordToFind = coordinateList[coordIndex];
    const lat = parseFloat(coordToFind.lat);
    const lng = parseFloat(coordToFind.lng);

    // --- Validation ---
    let validationError = null;
    if (coordToFind.lat.trim() === "" || coordToFind.lng.trim() === "") {
      validationError = "Lat & Lng required.";
    } else if (isNaN(lat) || isNaN(lng)) {
      validationError = "Invalid numbers.";
    } else if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      validationError = "Coords out of range.";
    }

    if (validationError) {
      setCoordinateList((prevList) =>
        prevList.map((coord) =>
          coord.id === id
            ? { ...coord, error: validationError, isLoading: false, result: null }
            : coord
        )
      );
      return;
    }
    // --- End Validation ---

    setCoordinateList((prevList) =>
      prevList.map((coord) =>
        coord.id === id ? { ...coord, isLoading: true, error: null, result: null } : coord
      )
    );

    try {
      const response = await axios.post("/api/FindCity", {
        latitude: lat,
        longitude: lng,
      });

      setCoordinateList((prevList) =>
        prevList.map((coord) =>
          coord.id === id
            ? {
                ...coord,
                isLoading: false,
                result: response.data.District || "District not found",
                error: null,
              }
            : coord
        )
      );
    } catch (error) {
      console.error(`Error fetching city for coords (${lat}, ${lng}):`, error);
      setCoordinateList((prevList) =>
        prevList.map((coord) =>
          coord.id === id
            ? {
                ...coord,
                isLoading: false,
                result: null,
                error: error.response?.data?.error || "API request failed",
              }
            : coord
        )
      );
    }
  };

  const findAllCities = () => {
    coordinateList.forEach((coord) => {
      findCity(coord.id);
    });
  };

  const isAnyLoading = coordinateList.some(c => c.isLoading);

  return (
    // --- Light Background and Centering Container ---
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">

      {/* --- Main Content Card (Slightly smaller) --- */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">

        {/* --- Title (Smaller) --- */}
        <h1 className="text-xl font-semibold mb-5 text-center text-gray-700 flex items-center justify-center">
          <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
          Find City by Coordinates
        </h1>

        {/* --- Coordinate Rows Container --- */}
        <div className="space-y-3 mb-5"> {/* Slightly reduced spacing */}
          {coordinateList.map((coord, index) => (
            <div
              key={coord.id}
              // Row container: focus on input/button alignment
              className={`flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 border rounded-md transition duration-150 ease-in-out ${
                coord.error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* --- Inputs (Primary Focus) --- */}
              <div className="flex space-x-2 flex-grow"> {/* Inputs take available space */}
                 <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={coord.lat}
                    onChange={(e) => handleInputChange(coord.id, "lat", e.target.value)}
                    // Input styling: prominent focus
                    className={`p-2 border rounded w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition duration-150 ${coord.error ? 'border-red-400' : 'border-gray-300'}`}
                    disabled={coord.isLoading}
                    aria-label={`Latitude for row ${index + 1}`}
                 />
                 <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={coord.lng}
                    onChange={(e) => handleInputChange(coord.id, "lng", e.target.value)}
                    // Input styling: prominent focus
                    className={`p-2 border rounded w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition duration-150 ${coord.error ? 'border-red-400' : 'border-gray-300'}`}
                    disabled={coord.isLoading}
                    aria-label={`Longitude for row ${index + 1}`}
                 />
              </div>

              {/* --- Find Button (Primary Action) --- */}
              <button
                onClick={() => findCity(coord.id)}
                disabled={coord.isLoading || !coord.lat || !coord.lng}
                // Button styling: clear action, next to inputs
                className="flex-shrink-0 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out text-sm font-medium flex items-center justify-center w-full sm:w-auto"
                aria-label={`Find city for row ${index + 1}`}
              >
                 {coord.isLoading ? (
                   <ArrowPathIcon className="animate-spin h-4 w-4 mr-1" /> // Simple spinner
                 ) : (
                    <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
                 )}
                {coord.isLoading ? "..." : "Find"} {/* Shorter loading text */}
              </button>

              {/* --- Result/Error Display (Secondary Info) --- */}
              <div className="flex-grow p-1.5 min-h-[36px] text-xs text-center sm:text-left rounded bg-gray-50 flex items-center justify-center sm:justify-start"> {/* Smaller text/padding */}
                 {coord.isLoading && <span className="text-gray-500 italic">Checking...</span>}
                 {coord.error && <span className="text-red-600 font-medium">{coord.error}</span>}
                 {coord.result && !coord.isLoading && !coord.error && (
                   <span className="text-green-700 font-medium">{coord.result}</span>
                 )}
                 {!coord.isLoading && !coord.error && !coord.result && <span className="text-gray-400 italic">-</span>} {/* Minimal placeholder */}
              </div>

              {/* --- Remove Button (Less prominent) --- */}
              {coordinateList.length > 1 && ( // Only show if more than one row
                 <button
                   onClick={() => removeCoordinateRow(coord.id)}
                   // Styling: Less prominent than Find, clearly destructive
                   className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out w-full sm:w-auto flex justify-center"
                   disabled={coord.isLoading}
                   aria-label={`Remove row ${index + 1}`}
                 >
                   <TrashIcon className="h-4 w-4" />
                 </button>
              )}

            </div>
          ))}
        </div>

        {/* --- Control Buttons (Less Emphasis) --- */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={addCoordinateRow}
            // Styling: Secondary action button
            className="px-4 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition duration-150 ease-in-out text-sm font-medium flex items-center justify-center shadow-sm hover:shadow w-full sm:w-auto"
            disabled={isAnyLoading}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Row
          </button>
          {coordinateList.length > 0 && ( // Only show if there are rows
            <button
              onClick={findAllCities}
              // Styling: Secondary action button
              className="px-4 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-150 ease-in-out text-sm font-medium flex items-center justify-center shadow-sm hover:shadow w-full sm:w-auto"
              disabled={isAnyLoading || coordinateList.length === 0}
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
              Find All
            </button>
          )}
        </div>

      </div> {/* End Content Card */}
    </div> // End Background Container
  );
}