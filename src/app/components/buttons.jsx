import React from "react";

const Buttons = ({ showButton, tellButton, handleFirstButton, handleTellPeople }) => {
    return (
        <>
            {showButton && (
                <div className="flex flex-col  justify-end">
                    <button
                        className="bg-yellow mt-3 rounded-full px-4 text-bold h-[3.25rem] w-full text-white self-end border-1 transition-transform duration-200 active:scale-95" // Added transition and active scale
                        onClick={handleFirstButton}
                    >
                        Locate others like you
                    </button>
                </div>
            )}

            {(!showButton && tellButton )&& (
                <div className="flex flex-col justify-end mt-[-5px]">
                    <button
                        className="animate-fade-in bg-yellow border-2 border-orange-200 mt-3 rounded-full px-4 text-bold h-[3.25rem] w-full text-white self-end border-1 transition-all duration-300 active:scale-105 active:bg-yellow-600 active:border-yellow-600" // Added more pronounced active effect
                        onClick={handleTellPeople}
                    >
                        Mark me too on the map for this!
                    </button>
                </div>
            )}
        </>
    );
};

export default Buttons;