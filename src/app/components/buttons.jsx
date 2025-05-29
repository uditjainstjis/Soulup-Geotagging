import {React, useState, useEffect} from "react";

const Buttons = ({ showButton, tellButton, handleFirstButton, handleTellPeople }) => {
    const [temp, setTemp] = useState(true);

    function changeTemp(){
        setTemp(!temp);
    }
    useEffect(()=>{
        if(!showButton){
            setTemp(true);
        }
    }, [showButton])
    return (
        <>
            {showButton && (
                <div className="flex flex-col kk md:mt-0 mt-[65vh] justify-end">
                    <button
                        className="bg-[#F4D251] md:mt-3   rounded-full px-4 text-light text-lg sm:text-bold h-[3.25rem] w-full text-black self-end border-1 transition-transform duration-200 active:scale-95" // Added transition and active scale
                        onClick={handleFirstButton}
                    >
                        Find others like you
                    </button>
                </div>
            )}

            {(!showButton && tellButton && temp )&& (
                <div className="flex flex-col but mt-[30vh] justify-end sm:mt-[-5px]">
                    <button
                        className="animate-fade-in bg-yellow  text-light text-lg sm:mt-6 mt-[-60px] text-black sm:text-bold  rounded-full px-4 md:text-bold h-[3.25rem] w-full self-end border-1 transition-all duration-300 active:scale-105 active:bg-yellow active:border-yellow" // Added more pronounced active effect
                        onClick={()=>{handleTellPeople(); changeTemp();}}
                    >
                        Mark me too on the map for this!
                    </button>
                </div>
            )}
        </>
    );
};

export default Buttons;