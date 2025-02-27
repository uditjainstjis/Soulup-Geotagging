import React, { useContext, useMemo } from 'react';
import { MainLocations } from "./contexts";

const TimeDropdown = ({ timeValue, setTimeValue, originalLocs }) => {
  const { setLocs } = useContext(MainLocations);

  const timeRanges = useMemo(() => [
    { label: "Last 6 hours", hours: 6 },
    { label: "Last 12 hours", hours: 12 },
    { label: "Last 24 hours", hours: 24 },
    { label: "Last Week", hours: 168 },
  ], []);

  const availableOptions = useMemo(() => {
    if (!originalLocs || originalLocs.length === 0) {
      return []; // No options if no locations
    }

    const now = new Date();

    const validRanges = timeRanges.filter(({ label, hours }) => {
      // Count tags *exclusively* within this time range
      const filteredLocs = originalLocs.filter(loc => {
        if (!loc.time) return false;
        const tagTime = new Date(loc.time);
        const diffHours = (now - tagTime) / (1000 * 60 * 60);

        // Check if within the current range *and* not in a shorter range
        let isExclusive = true;
        for (const shorterRange of timeRanges) {
          if (shorterRange.hours < hours && diffHours <= shorterRange.hours) {
            isExclusive = false;
            break; // Tag is in a shorter range, so not exclusive
          }
        }

        return diffHours <= hours && isExclusive;
      });
      return filteredLocs.length >= 5;
    }).map(range => range.label);

    if (validRanges.length === 0 && originalLocs.length > 0) {
      return ["Show All"];  // Only "Show All" if *some* data exists
    }

    return [...validRanges, "Show All"]; // Add "Show All" if any ranges are valid
  }, [originalLocs, timeRanges]);

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setTimeValue(selectedTime);

    if (selectedTime === "Show All") {
      setLocs(originalLocs);
      return;
    }

    const now = new Date();

    const filteredLocs = originalLocs.filter(loc => {
      if (!loc.time) return false;

      const tagTime = new Date(loc.time);
      const diffHours = (now - tagTime) / (1000 * 60 * 60);

      const selectedRange = timeRanges.find(range => range.label === selectedTime);
      return selectedRange && diffHours <= selectedRange.hours;
    });

    setLocs(filteredLocs);
  };

  return (
    <div className="relative animate-fade-in">
      {availableOptions.length > 0 ? (
        <select
          value={timeValue}
          onChange={handleTimeChange}
          className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-blue-500 appearance-none"
        >
          {availableOptions.map(time => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      ) : (
        <button
          className="block w-full bg-gray-300 text-gray-600 py-3 px-4 rounded-xl cursor-not-allowed"
          disabled
        >
          Nobody Found
        </button>
      )}

      {availableOptions.length > 0 && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default TimeDropdown;