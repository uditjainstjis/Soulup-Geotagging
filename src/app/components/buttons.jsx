import React from "react";

const Buttons = ({ showButton, tellButton, handleFirstButton, handleTellPeople }) => {
    return (
        <>
            {showButton && (
                <div className="flex flex-col mt-3 justify-end">
                    <button
                        className="bg-yellow-500 mt-3 rounded-full px-4 text-bold h-[3.25rem] text-white self-end border-1 transition-transform duration-200 active:scale-95" // Added transition and active scale
                        onClick={handleFirstButton}
                    >
                        Search for people facing same
                    </button>
                </div>
            )}

            {tellButton && (
                <div className="flex flex-col justify-end mt-2">
                    <button
                        className="animate-fade-in bg-yellow-500 border-2 border-orange-300 mt-3 rounded-full px-4 text-bold h-[3.25rem] text-white self-end border-1 transition-all duration-300 active:scale-105 active:bg-yellow-600 active:border-yellow-600" // Added more pronounced active effect
                        onClick={handleTellPeople}
                    >
                        Tell People
                    </button>
                </div>
            )}
        </>
    );
};

export default Buttons;