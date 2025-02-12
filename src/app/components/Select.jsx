"use client"
import React,{useContext, useEffect, useState} from 'react'
import { useUserLocation } from './useLocation';
import TimeDropdown from './TimeDropdown'
import Buttons from './buttons'
import SelectDropdown from './SelectDropdown'
import { MainLocations } from './contexts';

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
                  .then(data=>console.log("bheja tag add krne ko", data))
                  .catch((err)=>{console.log("ni bhejpaya",err)})
            }else{
                alert("Cannot proceed, Allow Location from the setting's of the browser")
            }
        }else{
            alert("Select how much hours ago you faced the issue")
        }
    }



    function handleFirstButton(){
        setTimeout(()=>{setShow(true)},3000);
        setisDisabled(true);
        setShowButton(false)
        //API Part
        const encodedTag = encodeURIComponent(optionValue)
        if(optionValue.trim()!==''){
            fetch(`api/Search-People-With-Same-Issue?tag=${encodedTag}`,{method:'GET'})
            .then(response=>{
                if(response.ok){
                    return response.json().then(data =>{console.log("log data acc to tag",data); setLocs(data)})
                }else{
                    return response.json();
                }
            })
            .then(data => {
                console.log('Received data for loc basis of tags:', data);
            })
            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred while searching. Please try again later.");
            });

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
        } else {  
            setShowButton(false);
        }

    },[optionValue])
    useEffect(()=>{
        if(timeValue.trim()!==''){

            setTimeout(()=>{setTellButton(true)},1450)
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