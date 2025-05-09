'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from '../components/navbar'
export default function SoulUpMaps() {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [agreed, setAgreed] = useState(false);


  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation bar */}
    <Navbar/>
      
      {/* Main content with responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Map preview section */}
        <div className="py-4 mt-24">
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
          <div className="mb-8 md:mb-12 bg-white" id="about">
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
          </div>
        </div>
      </div>
    </div>
  );
}