import React from 'react'

export const TimeDropdown = ({timeValue, setTimeValue}) => {
  return (
    <div className="animate-fade-in relative inline-block w-[75vw] sm:w-[50vw] md:w-[70vw] mt-9 lg:w-72 rounded-2xl mx-auto">
    <select
        value={timeValue}
        onChange={(e) => setTimeValue(e.target.value)}
        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 sm:pr-8 pr-4 lg:pr-4 rounded-2xl leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    >
        <option value="" disabled>
            When did you face this?
        </option>
        <option value="6 hours ago">6 hours ago</option>
        <option value="24 hours ago">24 hours ago</option>
        <option value="3 days ago">3 days ago</option>
        <option value="This week">This week</option>
    </select>
    </div>
  )
}

export default TimeDropdown;