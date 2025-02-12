import React from "react";
import { sampleTags } from "./sampleTags";

const SelectDropdown = ({ optionValue, setOptionValue, isDisabled }) => {
    return (
        <div className="relative inline-block w-[75vw] sm:w-[50vw] md:w-[70vw] lg:w-72 rounded-2xl mt-9 mx-auto">
            <select
                value={optionValue}
                disabled={isDisabled}
                onChange={(e) => setOptionValue(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-2xl leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
        </div>
    );
};

export default SelectDropdown;
