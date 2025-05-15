// components/TimeDropdown.jsx
import React, { useContext, useMemo } from 'react';
// Removed import of MainLocations context here, will receive setLocs via props

// Accept originalLocs, setLocs, and current Locs as props
const TimeDropdown = ({ timeValue, setTimeValue, originalLocs, setLocs, Locs }) => {
  // Removed useContext(MainLocations) here

  const timeRanges = useMemo(() => [
    { label: "Last 6 hours", hours: 6 },
    { label: "Last 12 hours", hours: 12 },
    { label: "Last 24 hours", hours: 24 },
    { label: "Last Week", hours: 168 },
  ], []);

  // Use originalLocs prop
  const availableOptions = useMemo(() => {
    if (!originalLocs || originalLocs.length === 0) {
      return []; // No options if no locations were returned by the search
    }

    const now = new Date();

    // Filter originalLocs to see which time ranges have at least 5 points
    const validRanges = timeRanges.filter(({ label, hours }) => {
      const filteredLocs = originalLocs.filter(loc => {
        if (!loc.time) return false; // Skip locations without a time
        const tagTime = new Date(loc.time);
        const diffHours = (now - tagTime) / (1000 * 60 * 60);
        return diffHours <= hours; // Check if within the current range
      });
      // We only count tags within the city from originalLocs
      // The count 'data.count' from the API might include global counts,
      // so using originalLocs.length (city count) for range availability is more relevant.
      // However, the original logic checked against the full count from the API.
      // Let's stick to checking against the count of filtered locations *within this range*
      return filteredLocs.length >= 5; // Show option only if at least 5 points in this range
    }).map(range => range.label);

    // If *any* locations were found in the search (originalLocs.length > 0),
    // always add "Show All" as an option, even if no ranges met the >= 5 threshold.
    if (originalLocs.length > 0) {
         // Ensure "Show All" isn't duplicated if it somehow gets into validRanges (it shouldn't)
         return [...validRanges.filter(label => label !== "Show All"), "Show All"];
    }


    return []; // If originalLocs is empty, no options available
  }, [originalLocs, timeRanges]);


  // Effect to set a default time value if options become available and no value is set
  // This prevents the "Tell People" button from being perpetually disabled after search
  useEffect(() => {
    if (availableOptions.length > 0 && timeValue === "") {
      // Find the shortest range that is available, or default to "Show All"
      const defaultOption = timeRanges.find(range => availableOptions.includes(range.label))?.label || "Show All";
      setTimeValue(defaultOption);
      // Also apply the filter immediately
       handleTimeChange({ target: { value: defaultOption } });
    } else if (availableOptions.length === 0 && timeValue !== "") {
        // If options disappear (e.g., due to new search with no results), clear the time value
        setTimeValue("");
         setLocs([]); // Clear map if no locations are available after filtering/search
    }
  }, [availableOptions, timeValue, timeRanges, setTimeValue, originalLocs, setLocs]);


  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setTimeValue(selectedTime); // Update the state first

    // Use originalLocs prop
    if (selectedTime === "Show All") {
      setLocs(originalLocs); // Update context state with the full search results
      return;
    }

    const now = new Date();

    const filteredLocs = originalLocs.filter(loc => {
      if (!loc.time) return false;

      const tagTime = new Date(loc.time);
      const diffHours = (now - tagTime) / (1000 * 60 * 60);

      const selectedRange = timeRanges.find(range => range.label === selectedTime);
      // Ensure selectedRange is found before accessing .hours
      return selectedRange && diffHours <= selectedRange.hours;
    });

    // Update context state with the filtered list
    setLocs(filteredLocs);
  };

  return (
    <div className="relative"> {/* Removed animate-fade-in, parent handles it */}
       {/* Displaying the dropdown only if there are available options based on search results */}
      {availableOptions.length > 0 ? (
        <select
          value={timeValue}
          onChange={handleTimeChange}
          className="block w-full border border-gray-300 h-[3.7rem] shadow-lg text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-blue-500 appearance-none"
        >
           {/* Add a default/placeholder option only if no timeValue is set initially */}
           {timeValue === "" && <option value="" disabled>Filter by time</option>}
          {availableOptions.map(time => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      ) : (
         // Display "Nobody Found" only if originalLocs is empty after search
         originalLocs && originalLocs.length === 0 && (
              <div className="block w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-xl cursor-not-allowed text-center h-[3.7rem] flex items-center justify-center shadow-lg">
                Nobody Found in your city!
            </div>
         )
         // If originalLocs is null/undefined (e.g., before search), nothing is rendered here
      )}

      {/* Dropdown arrow icon - display only if dropdown is visible */}
      {availableOptions.length > 0 && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 h-[3.7rem]"> {/* Match height */}
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default TimeDropdown;