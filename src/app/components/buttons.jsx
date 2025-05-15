import React from "react";

const Buttons = ({ showButton, tellButton, handleFirstButton, handleTellPeople }) => {
    return (
        <>
            {showButton && (
                <div className="flex flex-col md:mt-0 mt-[70vh] justify-end">
                    <button
                        className="bg-yellow md:mt-3  rounded-full px-4 text-bold h-[3.25rem] w-full text-white self-end border-1 transition-transform duration-200 active:scale-95" // Added transition and active scale
                        onClick={handleFirstButton}
                    >
                        Find others like you
                    </button>
                </div>
            )}

            {(!showButton && tellButton )&& (
                <div className="flex flex-col  mt-[35vh] justify-end md:mt-[-5px]">
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