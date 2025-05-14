// components/RateLimitPopup.js (or wherever you placed it)
import React from "react";

const RateLimitPopup = ({ message, onClose }) => {
    return (
        // Backdrop and centering container
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose} // Close when clicking backdrop
        >
            {/* Popup content */}
            <div
                className="bg-white p-6 rounded-xl border border-blue-400 flex items-center max-w-md w-full shadow-lg"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
            >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold mr-4 flex-shrink-0">
                    !
                </div>
                {/* Message */}
                <div className="text-lg font-semibold text-gray-800 flex-1">
                    {message}
                </div>
            </div>
        </div>
    );
};

export default RateLimitPopup; // Make sure it's exported correctly