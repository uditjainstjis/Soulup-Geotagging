'use client'
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SoulUpMaps() {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleSignIn = (e) => {
    e.preventDefault();

    if (agreed) {
      signIn('google');
    } else {
      alert("Please agree to the Privacy Policy to continue.");
    }
  };

  // Optional: Add smooth scrolling CSS to your global CSS file (e.g., globals.css or styles.css)
  // html {
  //   scroll-behavior: smooth;
  // }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation bar */}
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex items-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        </div>
      </nav>
      {/* Main content with responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 py-8" id="login">
          {/* Left side content */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-wide font-sans font-bold mb-2">SoulUp Maps</h1>
            <p className="text-xl md:text-2xl lg:text-3xl tracking-wide font-sans font-light py-3 md:py-5 mb-4 md:mb-6">Find others around you living with the same challenges as you.</p>

            {/* Navigation buttons */}
            <div className="flex flex-col w-full sm:w-80 gap-4 mb-8 md:mb-12">
              {/* MODIFIED "About" button */}
              <a
                href="#about"
                onClick={() => setShowWalkthrough(false)} // This will run, then the href will navigate
                className={`block text-center px-4 py-3 md:px-6 md:py-4 text-lg md:text-xl font-bold rounded-full ${!showWalkthrough ? "bg-gray-800 text-white" : "bg-transparent border border-gray-300 text-gray-800"}`} // Added text-gray-800 for transparent case
              >
                About
              </a>

              {/* MODIFIED "Walkthrough" button - removed unnecessary inner <a> */}
              <button
                className={`px-4 py-3 md:px-6 md:py-4 text-lg md:text-xl font-bold rounded-full bg-yellow-300`}
                onClick={() => setShowWalkthrough(true)}>
                Walkthrough
              </button>

            </div>
          </div>

          {/* Right side - Google OAuth login */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md max-w-md mx-auto">
              <div className="mb-5 text-center">
                <h3 className="text-xl font-medium mb-2 mt-2">Sign in to SoulUp Maps</h3>
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

        {/* Map preview section */}
        <div className="py-4">
          <div className="relative mb-8">
            <h2 className="text-2xl md:text-3xl font-light font-sans mb-4">Start exploring meaningful connects in your area!</h2>
            <div className="bg-gray-100 h-[50vh] md:h-[60vh] lg:h-[75vh] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
              <iframe className='w-full h-full' src="https://www.youtube.com/embed/npWFKa9hYl4?si=FRdp-xDK1RH1owxp" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

                {/* <Image
                  src='/image.png'
                  fill
                  style={{ objectFit: 'contain' }}
                  alt="Maps Image"
                  priority
                /> */}
              </div>
            </div>
          </div>

          {/* About section */}
          <div className="mb-8 md:mb-12 bg-white" id="about"> {/* Ensure this ID matches the href */}
            <h2 className="py-4 md:py-6 text-3xl md:text-4xl tracking-wider font-light font-sans mb-4">About <span className="font-bold">SoulUp Maps</span></h2>
            <div className="space-y-4 bg-white shadow-xl rounded-lg border-2 border-neutral-50 font-light p-4 md:p-7 text-base md:text-lg lg:text-xl leading-6 tracking-wider md:tracking-widest font-sans">
              <p>Introducing <strong className="font-bold">SoulUp Maps</strong> – a first-of-its-kind way to see and connect with people in real time who are navigating the same life challenge as you.</p>
              <p>Whether you're going through a breakup, grieving a loss, living with a health condition, or facing any other tough life moment – you're no longer alone.</p>
              <p>With just a quick login using Google, you can select the challenge you're facing and instantly access a live map that shows others around you who have experienced the same.</p>
              <p>You can zoom in and out, toggle across timeframes (from the last hour to back in time!), and even add yourself to the map with a simple tap.</p>
              <p>If you're a SoulUp Peer, your booking link appears right on your profile, making it easy for others to reach out. You decide what's visible – only your first name, age, and gender show (if you choose to appear on a map).</p>
              <p>The app also includes fun, lightweight polls that let you weigh in and find even more people like you. SoulUp Maps makes the invisible visible – showing you just how many people are in the same boat, right now. Tap in and feel the power of shared experience.</p>
            </div>
          </div>

          {/* Login button */}
          <div className="mb-8 text-center md:text-left">
            <a // Changed to an <a> tag for consistency with hash link navigation
              href="#login"
              className="inline-block bg-yellow-300 hover:bg-yellow-400 px-6 md:px-8 py-3 rounded-full font-medium"
            >
              Login/SignUp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}