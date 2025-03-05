import React from "react";

const SurveyBox = ({ onClose }) => {
    return (
        <div className="bg-white border-4 border-pink-400 shadow-lg  rounded-2xl p-5 w-full text-center">
            <h4 className="text-blue-950 font-semibold">
            Hey we are running a quick poll!

            </h4>
            <h4 className="text-lg font-semibold text-gray-800 mt-6">
                Is their salt in your toothpaste?
            </h4>
            <div className="flex justify-center gap-4 mt-4">
                <button
                    className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition"
                    onClick={() =>{ alert("You clicked Yes!"); onClose()}} // Modify this action
                >
                    Yes
                </button>
                <button
                    className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
                    onClick={onClose}
                >
                    No
                </button>
            </div>
        </div>
    );
};

export default SurveyBox;
