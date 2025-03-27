"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use useRouter for app directory
import { useSession } from 'next-auth/react';

const DetailsPage = () => {
  const [gender, setGender] = useState('');
  const [ageBracket, setAgeBracket] = useState('');
  const router = useRouter();
  const {data: session} = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/updateuserdetails', { // <-- Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user?.email || "noemail@example.com", // Get email from session
          gender: gender,
          ageBracket: ageBracket,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user details: ${response.status}`);
      }

      // After successful submission, redirect to the main app
      router.push('/');
    } catch (error) {
      console.error("Error updating user details:", error);
      alert('Failed to update details. Please try again.');
    }
  };

  return (
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Optional close button */}
        {/* <button
          onClick={() => router.push('/')}
          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
        >
          X
        </button> */}
      </div>
    </div>
  );
};

export default DetailsPage;