'use client'
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SoulUpMaps() {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { data: session, status } = useSession();

  const router = useRouter(); // Initialize useRouter
  


  useEffect(() => {
    if (session) {
      router.push('/'); // Use router.push for redirection
    }
  }, [session, router]); 
  
  const handleSignIn = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (agreed) {
      signIn('google'); // Specify the provider ('google')
    } else {
      alert("Please agree to the Privacy Policy to continue."); // Or a better message
    }
};
  return (
    <div className="flex flex-col min-h-screen bg-white" >
      {/* Navigation bar */}
      <nav className="bg-gray-800 p-4">
        <div className="mx-auto flex items-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        </div>
      </nav>
      
      <div className="flex flex-col md:flex-row flex-grow p-4 gap-8 mx-32" id="login">
        {/* Left side content */}
        <div className="flex-1 px-4">
          <div className="py-8">
            <h1 className="text-5xl tracking-wide font-sans font-bold mb-2">SoulUp Maps</h1>
            <p className="text-3xl tracking-wide font-sans font-light py-5 mb-6">Find others around you living with the same challenges as you.</p>
            
            {/* Navigation buttons */}
            <div className="flex flex-col w-80 gap-5 mb-12">
              <button className={`px-6 py-4 text-xl font-bold rounded-full ${!showWalkthrough ? "bg-gray-800 text-white" : "bg-transparent border border-gray-300"}`}
                      onClick={() => setShowWalkthrough(false)}>
                About
              </button>
              <button className={`px-6 py-4 text-xl font-bold rounded-full ${showWalkthrough ? "bg-yellow-300" : "bg-yellow-300"}`}
                      onClick={() => setShowWalkthrough(true)}>
                Walkthrough
              </button>
            </div>
            

          </div>
        </div>
        
        {/* Right side - Google OAuth login */}
        <div className="md:w-[32vw] p-4" >
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md">
            <div className="mb-5 text-center">
              <h3 className="text-xl font-medium mb-2 mt-2" >Sign in to SoulUp Maps</h3>
              <p className="text-sm text-gray-600">Connect with others facing similar challenges</p>
            </div>
            
            <button 
              onClick={handleSignIn}
              disabled={!agreed}
              className={`w-full py-3 px-4 mb-4 flex items-center justify-center rounded ${agreed ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              <div className="flex items-center">
                <span className="mr-2">G</span> 
                <span>Sign in with Google</span>
              </div>
            </button>
            
            <div className="flex items-start mb-4">
              <div className="flex items-center h-5">
                <input
                  id="privacy"
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="w-4 h-4 border border-gray-300 rounded"
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="privacy" className="font-medium text-gray-700">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
              
            </div>
            
          </div>
          
        </div>
        
      </div>



      

      <div className="">
      <div className=" p-4 mx-32 ">
                  {/* Map preview with avatar */}
                  <div className="relative mb-8">
              <div className="absolute right-16 top-4 z-10">
              </div>
              <h2 className="text-3xl font-light font-sans mb-4">Start exploring meaningful connects in your area!</h2>
              <div className="bg-gray-100 h-[75vh] flex items-center justify-center">
                {/* <div className="h-8 w-8 text-gray-500"> */}
                  <Image src='/image.png' width={1300} height={100} alt="Maps Image"/>
                {/* </div> */}
              </div>
              <div className="absolute right-24 top-56">
              </div>
            </div>
            
            {/* About section */}
            <div className="mb-12 bg-white ">
              <h2 className="py-6 text-4xl tracking-wider  font-light font-sans mb-4">About <span className="font-bold">SoulUp Maps</span></h2>
              <div className="space-y-4 bg-white shadow-xl rounded-lg border-2 border-neutral-50 font-light p-7 text-xl leading-6 tracking-widest font-sans">
                <p>Introducing <strong className="font-bold">SoulUp Maps</strong> – a first-of-its-kind way to see and connect with people in real time who are navigating the same life challenge as you.</p>
                
                <p>Whether you're going through a breakup, grieving a loss, living with a health condition, or facing any other tough life moment – you're no longer alone.</p>
                
                <p>With just a quick login using Google, you can select the challenge you're facing and instantly access a live map that shows others around you who have experienced the same.</p>
                
                <p>You can zoom in and out, toggle across timeframes (from the last hour to back in time!), and even add yourself to the map with a simple tap.</p>
                
                <p>If you're a SoulUp Peer, your booking link appears right on your profile, making it easy for others to reach out. You decide what's visible – only your first name, age, and gender show (if you choose to appear on a map).</p>
                
                <p>The app also includes fun, lightweight polls that let you weigh in and find even more people like you. SoulUp Maps makes the invisible visible – showing you just how many people are in the same boat, right now. Tap in and feel the power of shared experience.</p>
              </div>
            </div>
            
            {/* Login button */}
            <div className="mb-8">
              <button className="bg-yellow-300 hover:bg-yellow-400 px-8 py-3 rounded-full font-medium">
                <a href="#login">Login/SignUp</a>
              </button>
            </div>
            </div>
            </div>
    </div>
  );
}