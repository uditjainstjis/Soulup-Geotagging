'use client'
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SoulUpMaps() {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [gender, setGender] = useState('');
  const [ageBracket, setAgeBracket] = useState('');
  const [socialProfile, setSocialProfile] = useState('');
  const [socialProfileError, setSocialProfileError] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  const validateSocialProfile = (profileLink) => {
    if (!profileLink) {
      return ''; // Optional, so empty is valid
    }

    let urlToValidate = profileLink;

    // Prepend https:// if no protocol is present to help URL parsing
    if (!profileLink.startsWith('http://') && !profileLink.startsWith('https://')) {
      urlToValidate = `https://${profileLink}`;
    }

    try {
      const url = new URL(urlToValidate);
      const hostname = url.hostname.toLowerCase(); // Get hostname and lowercase it
      const commonDomains = [
        'linkedin.com',
        'instagram.com',
        'facebook.com',
        'twitter.com',
        'x.com',
        'tiktok.com',
        'youtube.com',
        'pinterest.com',
        'threads.net',
        'bsky.app',
        'whatsapp.com',
        'snapchat.com',
        'soulup.in'
      ];

      let domainFound = false;
      for (const domain of commonDomains) {
        if (hostname.endsWith(domain)) { // Use endsWith for more accurate domain matching
          domainFound = true;
          break;
        }
      }

      if (!domainFound) {
        return "Please enter a link from a common social media platform (e.g., LinkedIn, Instagram).";
      }
      return ''; // Valid if it has a common domain and is a valid URL format

    } catch (error) {
      if (profileLink.length < 5) {
        return "Please enter a valid social profile link or ID."; // Gibberish length check
      }
      return "Invalid social profile link format. Please enter a valid URL."; // General invalid format
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileError = validateSocialProfile(socialProfile);
    setSocialProfileError(profileError);

    if (profileError) {
      return;
    }

    try {
      const response = await fetch('/api/updateuserdetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user?.email || "noemail@example.com",
          gender: gender,
          ageBracket: ageBracket,
          socialProfile: socialProfile,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user details: ${response.status}`);
      }
      router.push('/');
    } catch (error) {
      console.error("Error updating user details:", error);
      alert('Failed to update details. Please try again.');
    }
  };

  const handleSocialProfileChange = (e) => {
    setSocialProfile(e.target.value);
    setSocialProfileError('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation bar */}
      <nav className="bg-gray-800 p-4">
      <Image width={45} height={32} alt='logo' src='/soulup.jpeg' className='rounded-full'/>

        <div className="container mx-auto flex items-center">

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
              <button 
                className={`px-4 py-3 md:px-6 md:py-4 text-lg md:text-xl font-bold rounded-full ${!showWalkthrough ? "bg-gray-800 text-white" : "bg-transparent border border-gray-300"}`}
                onClick={() => setShowWalkthrough(false)}>
                About
              </button>
              <button 
                className={`px-4 py-3 md:px-6 md:py-4 text-lg md:text-xl font-bold rounded-full bg-yellow-300`}
                onClick={() => setShowWalkthrough(true)}>
                Walkthrough
              </button>
            </div>
          </div>
          
          {/* Right side - Google OAuth login */}

          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <h2 className="text-2xl font-bold mb-4">Tell us a bit about yourself!</h2>

        <form onSubmit={handleSubmit}>
          {/* Gender Selection */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
              Gender:
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Age Bracket Selection */}
          <div className="mb-4">
            <label htmlFor="ageBracket" className="block text-gray-700 text-sm font-bold mb-2">
              Age Bracket:
            </label>
            <select
              id="ageBracket"
              value={ageBracket}
              onChange={(e) => setAgeBracket(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Age Bracket</option>
              <option value="below18">Below 18</option>
              <option value="18-26">18-26</option>
              <option value="26-36">26-36</option>
              <option value="36-45">36-45</option>
              <option value="45-65">45-65</option>
              <option value="65+">65+</option>
            </select>
          </div>

          {/* Social Profile ID */}
          <div className="mb-4">
            <label htmlFor="socialProfile" className="block text-gray-700 text-sm font-bold mb-2">
              Social Profile ID (LinkedIn, Instagram, etc.): <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="socialProfile"
              value={socialProfile}
              onChange={handleSocialProfileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your profile URL or ID"
            />
            {socialProfileError && (
              <p className="text-red-500 text-xs italic">{socialProfileError}</p>
            )}
          </div>

          
          <div>
            <h3 className='text-sm font-sans text-red-400 italic'>This is the link others can use to contact you if they have a
common challenge.</h3>
<h3 className='text-sm font-sans text-red-400 italic mb-3'>
You can give your LinkedIn/Instagram link. <span className="text-red-500 font-sans font-bold">If you are a SoulUp Peer</span>, please give your SoulUp Peer Profile link</h3>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
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
                  style={{objectFit: 'contain'}} 
                  alt="Maps Image"
                  priority
                /> */}
              </div>
            </div>
          </div>
          
          {/* About section */}
          <div className="mb-8 md:mb-12 bg-white">
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
            <button className="bg-yellow-300 hover:bg-yellow-400 px-6 md:px-8 py-3 rounded-full font-medium">
              <a href="#login">Login/SignUp</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}