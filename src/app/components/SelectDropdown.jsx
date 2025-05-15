import React from "react";
import { useFetchTags } from "./fetchTags"; // Adjust path to fetchTags.js if necessary

const SelectDropdown = ({ optionValue, setOptionValue, isDisabled }) => {
    const { tags, loading, error } = useFetchTags(); // Use the custom hook

    if (loading) {
        return (
            <div className="relative">
                <select
                    value={optionValue}
                    disabled={isDisabled || true} // Disable during loading
                    className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-blue-500 appearance-none"
                >
                    <option value="" disabled>
                        Loading tags...
                    </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative">
                <select
                    value={optionValue}
                    disabled={isDisabled || true} // Disable during error
                    className="block w-full border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-blue-500 appearance-none"
                >
                    <option value="" disabled>
                        Error fetching tags
                    </option>
                    <option value="" disabled>
                        {error.message}
                    </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <select
                value={optionValue}
                disabled={isDisabled}
                onChange={(e) => setOptionValue(e.target.value)}
                className="block w-[93vw] md:w-full border border-gray-300 h-[3.7rem] shadow-lg  text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-blue-500 appearance-none"
            >
                <option value="" disabled>
                    Select an option
                </option>
                {tags.map((val) => ( // Now map over the fetched 'tags' array
                    <option key={val} value={val}>
                        {val}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
        </div>
    );
};

export default SelectDropdown;