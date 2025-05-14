// components/SuccessPopup.js
import React from "react";

// Accept the onUndo prop
const SuccessPopup = ({ onClose, onUndo }) => {
    return (
        // Backdrop and centering container
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose} // Close when clicking backdrop
        >
            {/* Popup content container */}
            <div
                className="relative bg-white p-6 pt-12 rounded-xl max-w-md w-full shadow-lg text-gray-800" // pt-12 adds space for the NICE pill above
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
            >
                {/* NICE! pill - positioned absolutely at the top */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-white px-6 py-2 rounded-full font-bold text-lg shadow-md">
                    NICE!
                </div>

                {/* Main Content Area */}
                <div className="mt-4"> {/* Add some margin at the top to clear the pill */}
                    <div className="flex items-start mb-3">
                        {/* Check icon (using unicode emoji for simplicity, replace with Image if needed) */}
                        <span className="text-yellow-500 mr-3 text-xl flex-shrink-0">✅</span>
                        <p className="flex-1">
                            Your location has been marked on the map along with your name, age, gender against the label 'Loneliness'
                        </p>
                    </div>
                    <div className="flex items-start">
                         {/* Check icon */}
                        <span className="text-yellow-500 mr-3 text-xl flex-shrink-0">✅</span>
                        <p className="flex-1">
                            Other users will now be able to see a geo-location tag for this label against your information and will be able to connect with you if you have provided relevant details.
                        </p>
                    </div>
                </div>

                {/* Undo action text - Now calls the onUndo prop */}
                <p
                    className="text-center text-gray-500 text-sm mt-6 italic cursor-pointer hover:text-gray-700 transition-colors duration-200" // Added hover effect
                    onClick={onUndo} // Call the passed onUndo function
                >
                    Undo this label for me!
                </p>
            </div>
        </div>
    );
};

export default SuccessPopup;