import React,{useEffect, useState} from 'react'

const Select = () => {
    const[showButton,setShowButton]=useState(false);

    const[tellButton,setTellButton]=useState('');
    const[show,setShow]=useState(false);

    const [isDisabled, setisDisabled] = useState(false);

    const[optionValue, setOptionValue]=useState('')
    const[timeValue, setTimeValue]=useState('')

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
            // setShow(true);
            setShowButton(true);
        } else {  // Important: Add an else to handle when the option is cleared
            // setShow(false);
            setShowButton(false);
        }

    },[optionValue])
    useEffect(()=>{
        if(timeValue.trim()!==''){
            // setShow(true);
            setTellButton(true);
        } else {  // Important: Add an else to handle when the option is cleared
            // setShow(false);
            setTellButton(false);
        }

    },[timeValue])

    return (
        <div>

            {/* <h4 className='bg-white/70 shadow-xl rounded-full p-3 px-8' >
        What are you feeling today?
        </h4> */}
{/* Title */}

            {!show &&(<h4 className='bg-white text-black rounded-full p-3 px-5 relative' style={{ boxShadow: '0 -4px 8px #ede9c7, -2px -2px 4px #dec5e0, 2px -2px 4px #ede9c7, 0 4px 8px #d1e0c5' }}>
                What are you facing currently?
            </h4>)}
            {show &&(<h4 className='bg-white text-black rounded-full p-3 px-5 relative' style={{ boxShadow: '0 -4px 8px #ede9c7, -2px -2px 4px #dec5e0, 2px -2px 4px #ede9c7, 0 4px 8px #d1e0c5' }}>
                What are you facing currently?
            </h4>)}


{/* Options for selecting and pushing */}

            <div className='flex flex-col '>

            <div className="relative inline-block w-[75vw] sm:w-[50vw] md:w-[70vw] lg:w-72 rounded-2xl mt-9 mx-auto">
                <select value={optionValue} disabled={isDisabled} onChange={handleChange} className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-2xl leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <option value="" disabled>Select an option</option>
                    <option value="Anger">Anger</option>
                    <option value="Bipolar Episode">Bipolar Episode</option>
                    <option value="Anxiety">Anxiety</option>
                    <option value="Depression">Depression</option>
                    <option value="Abuse">Abuse</option>
                    <option value="Divorce">Divorce</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L17.5 8 10 1.5 2.5 8z" /></svg>
                </div>
            </div>

            
            {/* <div className='flex flex-row justify-around mt-6 items-center '> */}
            {show && (<div className="relative inline-block w-[75vw] sm:w-[50vw] md:w-[70vw] mt-9 lg:w-72 rounded-2xl  mx-auto">
                <select value = {timeValue} onChange={handleTimeChange} className=" block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 sm:pr-8 pr-4 lg:pr-4 rounded-2xl leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <option value="" disabled>When did you face this?</option>
                    <option value="6 hours ago">6 hours ago</option>
                    <option value="24 hours ago">24 hours ago</option>
                    <option value="3 days ago">3 days ago</option>
                    <option value="This week">This week</option>
                </select>

            </div>)
            }

            {/* {showButton&&(<div className='flex flex-col  mt-[-10px] justify-end'>
                <button className='bg-yellow-500 mt-3 rounded-full w-32 h-11 text-white self-end border-1 '
                onClick={()=>{setButtonText('tell people');setShow(true)}}
                >{buttonText}</button>
            </div>)} */}
            {showButton&&(<div className='flex flex-col  mt-3 justify-end'>
                <button className='bg-yellow-500 mt-3 rounded-full px-4 text-bold h-[3.25rem]  text-white self-end border-1 '
                onClick={()=>{setShow(true);setisDisabled(true);setShowButton(false)}}
                >Search for people facing same</button>
            </div>)}

            {tellButton&&(<div className='flex flex-col  justify-end mt-2'>
                <button className='bg-yellow-500 border-2 border-orange-300 mt-3 rounded-full px-4 text-bold h-[3.25rem]  text-white self-end border-1 '
                onClick={()=>{}}
                >Tell People</button>
            </div>)}




            
            {/* </div> */}


            </div>

            





    {/* <button type="button" class="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2">
<svg class="w-5 h-5 me-2 -ms-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg>
Sign in with Apple
</button> */}






        </div>
    )
}

export default Select