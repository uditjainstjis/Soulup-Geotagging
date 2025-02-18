"use client"
import React,{useContext, useEffect, useState} from 'react'
import { useUserLocation } from './useLocation';
import TimeDropdown from './TimeDropdown'
import Buttons from './buttons'
import SelectDropdown from './SelectDropdown'
import { MainLocations, ZoomLocations } from './contexts';

const Select = () => {
    var {Locs, setLocs} = useContext(MainLocations)

    const[showButton,setShowButton]=useState(false);
    const[tellButton,setTellButton]=useState('');
    const[show,setShow]=useState(false);
    const [isDisabled, setisDisabled] = useState(false);

    const[optionValue, setOptionValue]=useState('')
    const[timeValue, setTimeValue]=useState('')


    const {location, locationRecieved, city} = useUserLocation();

    function handleTellPeople(){
        const sendingBody = {
            city:city,
            tag:optionValue,
            time:timeValue,
            location:{lat:location.latitude, lng:location.longitude},
        }
        const encodedTag = encodeURIComponent(optionValue)
        console.log("I am sending this", sendingBody)
        if(timeValue.trim()!==''){
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
                    console.log("bheja tag add krne ko", data)
                    searchPeopleWithSameIssue(encodedTag, setLocs)
                })
                  .catch((err)=>{console.log("ni bhejpaya",err)})
            }else{
                alert("Cannot proceed, Allow Location from the setting's of the browser")
            }
        }else{
            alert("Select how much hours ago you faced the issue")
        }
    }


    async function searchPeopleWithSameIssue(encodedTag, setLocs) {
        try {

            const response = await fetch(`api/Search-People-With-Same-Issue?tag=${encodedTag}&city=${city}`, { method: 'GET' });

            if (response.ok) {
                const data = await response.json();
                console.log("log data acc to tag", data);
                setLocs(data);
                return data;
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                return errorData;
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred while searching. Please try again later.");
        }
    }


    function handleFirstButton(){
        setTimeout(()=>{setShow(true)},1000);
        setisDisabled(true);
        setShowButton(false)
        //API Part
        const encodedTag = encodeURIComponent(optionValue)
        if(optionValue.trim()!==''){
            searchPeopleWithSameIssue(encodedTag, setLocs)
        }else{
            alert("Select some option to Search for that")
        }

    }

    useEffect(()=>{
        if(optionValue.trim()!==''){
            setShowButton(true)
        } else {
            setShowButton(false);
        }

    },[optionValue])
    useEffect(()=>{
        if(timeValue.trim()!==''){

            setTimeout(()=>{setTellButton(true)},450)
        } else {
            setTellButton(false);
        }

    },[timeValue])

    return (
        <div className='bg-white rounded-2xl shadow-lg p-6 w-full'> {/* Modernized styling */}
            <h4 className='text-lg font-semibold text-gray-800 mb-4 text-center'> {/* Improved typography */}
                What are you facing currently?
            </h4>

            <div className="flex flex-col gap-4"> {/* Added gap for spacing */}
                <SelectDropdown
                    optionValue={optionValue}
                    setOptionValue={setOptionValue}
                    isDisabled={isDisabled}
                />

                {show && <TimeDropdown timeValue={timeValue} setTimeValue={setTimeValue} />}

                <Buttons
                    showButton={showButton}
                    tellButton={tellButton}
                    handleFirstButton={handleFirstButton}
                    handleTellPeople={handleTellPeople}
                />
            </div>
        </div>
    )
}

export default Select