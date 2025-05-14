import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-8 w-8 bg-slate-300 rounded-full"></div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            <a href="/" className="text-gray-300 hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">Map</a>
            <a href="/walkthrough#about" className="text-gray-300 hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">About</a>
            <a href="/walkthrough" className="text-gray-300 hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">Walkthrough</a>
            <a href="https://soulup.in" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">SoulUp Website</a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden space-y-1 px-2 pt-2 pb-3">
            <a href="/" className="block text-gray-300 hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium">Map</a>
            <a href="/walkthrough#about" className="block text-gray-300 hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium">About</a>
            <a href="/walkthrough" className="block text-gray-300 hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium">Walkthrough</a>
            <a href="https://soulup.in" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium">SoulUp Website</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
