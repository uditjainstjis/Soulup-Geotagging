import React from "react";
import { sampleTags } from "./sampleTags";

const SelectDropdown = ({ optionValue, setOptionValue, isDisabled }) => {
    return (
        <div className="relative"> {/* Removed inline-block, using relative for positioning */}
            <select
                value={optionValue}
                disabled={isDisabled}
                onChange={(e) => setOptionValue(e.target.value)}
                className="block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-blue-500 appearance-none"
            >
                <option value="" disabled>
                    Select an option
                </option>
                {sampleTags.map((val) => (
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