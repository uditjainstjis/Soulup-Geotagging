import React, { useContext } from 'react';
import { MainLocations } from "./contexts";

export const TimeDropdown = ({ timeValue, setTimeValue, availableOptions = [] , originalLocs}) => { 
  const { Locs, setLocs } = useContext(MainLocations);

  function handleTimeChange(e) {
    const selectedTime = e.target.value;
    setTimeValue(selectedTime);

    if (selectedTime === "Show All") {
        setLocs(originalLocs); // Reset to full dataset
        return;
    }

    // Filter locations based on selected time
    const filteredLocs = originalLocs.filter(loc => {
        if (!loc.time) return false; // Skip if loc.time is missing

        const timeDiff = new Date() - new Date(loc.time);
        const hours = timeDiff / (1000 * 60 * 60); // Convert to hours

        if (selectedTime === "Last 6 hours") return hours <= 6;
        if (selectedTime === "Last 12 hours") return hours <= 12;
        if (selectedTime === "Last 24 hours") return hours <= 24;
        if (selectedTime === "Last Week") return hours <= 168;

        return true;
    });

    setLocs(filteredLocs);
}


  return (
    <div className="relative animate-fade-in">
      <select
        value={timeValue}
        onChange={handleTimeChange}
        className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-blue-500 appearance-none"
      >

        {availableOptions.length > 0 ? (
          availableOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No valid time options available
          </option>
        )}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default TimeDropdown;
