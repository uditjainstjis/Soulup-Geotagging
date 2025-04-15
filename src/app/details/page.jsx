"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const DetailsPage = () => {
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
  );
};

export default DetailsPage;