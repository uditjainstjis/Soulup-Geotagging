import React, { useContext, useEffect, useState } from "react";
import { useUserLocation } from "./useLocation";
import TimeDropdown from "./TimeDropdown";
import Buttons from "./buttons";
import SelectDropdown from "./SelectDropdown";
import { MainLocations } from "./contexts";

const Select = () => {
    var { Locs, setLocs } = useContext(MainLocations);

    const [showButton, setShowButton] = useState(false);
    const [tellButton, setTellButton] = useState(false);
    const [show, setShow] = useState(false);
    const [isDisabled, setisDisabled] = useState(false);
    const [optionValue, setOptionValue] = useState("");
    const [timeValue, setTimeValue] = useState("");

    const { location, locationRecieved, city } = useUserLocation();

    const [originalLocs, setOriginalLocs] = useState([]); // Store unfiltered locations

    async function searchPeopleWithSameIssue(encodedTag, setLocs) {
        try {
            const response = await fetch(
                `api/Search-People-With-Same-Issue?tag=${encodedTag}&city=${city}`,
                { method: "GET" }
            );
    
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched Data:", data);
    
                setLocs(data);
                setOriginalLocs(data); // Store the original full list for resetting
                //categorizeTagsByTime(data);
            } else {
                const errorData = await response.json();
                console.error("Error response:", errorData);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while searching. Please try again later.");
        }
    }
    
    

    function handleFirstButton() {
        // setTimeout(() => {
            setShow(true);
        // }, 1000);
        setisDisabled(true);
        setShowButton(false);
        setTellButton(true)

        const encodedTag = encodeURIComponent(optionValue);
        if (optionValue.trim() !== "") {
            searchPeopleWithSameIssue(encodedTag, setLocs);
        } else {
            alert("Select some option to search for that");
        }
    }


    function handleTellPeople(){
        const sendingBody = {
            city:city,
            tag:optionValue,
            location:{lat:location.latitude, lng:location.longitude},
        }
        const encodedTag = encodeURIComponent(optionValue)
        console.log("I am sending this", sendingBody)

            if(locationRecieved){
                fetch('/api/addOurTag',{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/JSON"
                    }
                    ,
                    body:JSON.stringify(sendingBody)
                }).then(response=>response.json())
                  .then(data=>{
                    alert(data.message)
                    searchPeopleWithSameIssue(encodedTag, setLocs)
                })
                  .catch((err)=>{console.log("ni bhejpaya",err)})
            }else{
                alert("Cannot proceed, Allow Location from the setting's of the browser")
            }

    }

    useEffect(() => {
        setShowButton(optionValue.trim() !== "");
    }, [optionValue]);

    useEffect(() => {
        if (timeValue.trim() !== "") {
            setTimeout(() => {
                setTellButton(true);
            }, 450);
        } else {
            setTellButton(false);
        }
    }, [timeValue]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                What are you facing currently?
            </h4>

            <div className="flex flex-col gap-4">
                <SelectDropdown
                    optionValue={optionValue}
                    setOptionValue={setOptionValue}
                    isDisabled={isDisabled}
                />

                {show && (
                    <TimeDropdown
                        timeValue={timeValue}
                        setTimeValue={setTimeValue}
                        originalLocs={originalLocs} // Pass the original data
                    />

                )}

                <Buttons
                    showButton={showButton}
                    tellButton={tellButton}
                    handleFirstButton={handleFirstButton}
                    handleTellPeople={handleTellPeople}
                />
            </div>
        </div>
    );
};

export default Select;