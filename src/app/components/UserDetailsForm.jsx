"use client";
import React, { useState } from 'react';

const UserDetailsForm = ({ onClose, onSubmit }) => {
  const [gender, setGender] = useState('');
  const [ageBracket, setAgeBracket] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ gender, ageBracket }); // Pass the data to the parent component
    onClose(); // Close the form after submission
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Tell us more about you!</h2>
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
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsForm;