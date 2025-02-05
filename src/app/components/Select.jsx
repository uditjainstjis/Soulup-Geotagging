import React from 'react'

const Select = () => {
    return (
        <div>

            {/* <h4 className='bg-white/70 shadow-xl rounded-full p-3 px-8' >
        What are you feeling today?
        </h4> */}
{/* Title */}
            <h4 className='bg-white/70 rounded-full p-3 px-5 relative' style={{ boxShadow: '0 -4px 8px #ede9c7, -2px -2px 4px #dec5e0, 2px -2px 4px #ede9c7, 0 4px 8px #d1e0c5' }}>
                What are you facing currently?
            </h4>


{/* Options for selecting and pushing */}

            <div className='flex flex-col'>

            <div className="relative inline-block w-[75vw] sm:w-[50vw] md:w-[70vw] lg:w-72 rounded-2xl mt-10">
                <select className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-2xl leading-tight focus:outline-none focus:bg-white focus:border-gray-500" defaultValue="">
                    <option value="" disabled>Select an option</option>
                    <option value="option1">Anger</option>
                    <option value="option3">Bipolar Episode</option>
                    <option value="option3">Anxiety</option>
                    <option value="custom1">Depression</option>
                    <option value="custom2">Abuse</option>
                    <option value="custom2">Divorce</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L17.5 8 10 1.5 2.5 8z" /></svg>
                </div>
            </div>

            <div className='flex flex-row justify-around mt-6 items-center'>
            <div className="w-[40vw] sm:w-[29vw]  md:w-[50vw] lg:w-32 rounded-2xl md:ml-[-10px]">
                <select className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 lg:pr-4 rounded-2xl leading-tight focus:outline-none focus:bg-white focus:border-gray-500" defaultValue="">
                    <option value="" disabled>When?</option>
                    <option value="option1">6 hours ago</option>
                    <option value="option3">24 hours ago</option>
                    <option value="custom1">This week</option>
                </select>

            </div>
            <div className='flex flex-col  mt-[-10px] justify-end'>
                <button className='bg-yellow-500 mt-3 rounded-full w-32 h-11 text-white self-end border-1 '>tell people</button>
            </div>
            </div>


            </div>

            





    {/* <button type="button" class="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2">
<svg class="w-5 h-5 me-2 -ms-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg>
Sign in with Apple
</button> */}






        </div>
    )
}

export default Select