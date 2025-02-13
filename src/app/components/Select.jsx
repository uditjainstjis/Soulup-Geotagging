"use client"
import React,{useContext, useEffect, useState} from 'react'
import { useUserLocation } from './useLocation';
import TimeDropdown from './TimeDropdown'
import Buttons from './buttons'
import SelectDropdown from './SelectDropdown'
import { MainLocations, ZoomLocations } from './contexts';



// Usage example:
// searchPeopleWithSameIssue(encodedTag, setLocs);

const Select = () => {
    var {Locs, setLocs} = useContext(MainLocations)

    const[showButton,setShowButton]=useState(false);

    const[tellButton,setTellButton]=useState('');
    // const[showAgeGender, setShowAgeGender] = useState(false);
    const[show,setShow]=useState(false);

    const [isDisabled, setisDisabled] = useState(false);

    const[optionValue, setOptionValue]=useState('')
    const[timeValue, setTimeValue]=useState('')
    const[ageValue, setAgeValue]=useState('')
    const[genderValue, setGenderValue]=useState('')

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

            const response = await fetch(`api/Search-People-With-Same-Issue?tag=${encodedTag}&city=${city}&age=${ageValue}&gender=${genderValue}`, { method: 'GET' });
            
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
        // setShowAgeGender(true);
        //API Part
        const encodedTag = encodeURIComponent(optionValue)
        if(optionValue.trim()!==''){
        // if(optionValue.trim()!=='' && genderValue.trim()!=='' && ageValue.trim()!==''){

            searchPeopleWithSameIssue(encodedTag, setLocs)

        }else{
            alert("Select some option to Search for that")
        }

    }

    function handleChange(event){    
        setOptionValue(event.target.value);
        console.log("Selected value:", event.target.value);
    }
    function handleTimeChange(event){    
        setTimeValue(event.target.value);
        console.log("Selected value:", event.target.value);
    }


    useEffect(()=>{
        if(optionValue.trim()!==''){
            setShowButton(true)
            // setShowAgeGender(true)
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
        <div className='bg-white border-2 border-gray-400 rounded-lg py-8 px-5 min-h-56'>

            {(<h4 className='bg-white text-black rounded-full p-3 px-5 relative' style={{ boxShadow: '0 -4px 8px #ede9c7, -2px -2px 4px #dec5e0, 2px -2px 4px #ede9c7, 0 4px 8px #d1e0c5' }}>
                What are you facing currently?
            </h4>)}


            <div className="flex flex-col">
                <SelectDropdown
                    optionValue={optionValue}
                    setOptionValue={setOptionValue}
                    isDisabled={isDisabled}
                />

            
            {show && <TimeDropdown timeValue={timeValue} setTimeValue={setTimeValue} />}

            {/* {showAgeGender &&

            <div className='flex justify-around'>

            <select
                    value={ageValue}
                    onChange={(e) => setAgeValue(e.target.value)}
                    className="appearance-none w-fit  px-2  mt-6 bg-white border border-gray-300 text-gray-700 py-3 rounded-2xl leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                    <option value="" disabled>
                        What's your age?
                    </option>
                    <option value="less than 18">less than 18</option>
                    <option value="between 18 to 30">between 18-30</option>
                    <option value="between 30-45">between 30-45</option>
                    <option value="between 45-60">between 45-60</option>
                    <option value="more than 60">more than 60</option>
                </select>
            <select
                    value={genderValue}
                    onChange={(e) => setGenderValue(e.target.value)}
                    className="appearance-none w-fit  px-2  mt-6 bg-white border border-gray-300 text-gray-700 py-3 rounded-2xl leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                    <option value="" disabled>
                        Gender ?
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                </div>
            } */}


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