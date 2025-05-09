import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-slate-800 text-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {/* Placeholder for Logo */}
                    <div className="h-8 w-8 bg-slate-300 rounded-full"></div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      <a href="/" className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Map</a>
                      <a href="/walkthrough#about" className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
                      <a href="/walkthrough" className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Walkthrough</a>
                      <a href="https://soulup.in" target='_blank_' className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">SoulUp Website</a>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">

                </div>
                {/* Mobile menu button (optional) */}
                <div className="-mr-2 flex md:hidden">
                  <button type="button" className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    {/* Icon when menu is closed. */}
                    {/* Heroicon name: outline/menu */}
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    {/* Icon when menu is open. */}
                    {/* Heroicon name: outline/x */}
                    <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Mobile menu, show/hide based on menu state (optional) */}
            <div className="md:hidden" id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#" className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Map</a>
                <a href="#" className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</a>
                {/* ... more links ... */}
              </div>
              <div className="pt-4 pb-3 border-t border-slate-700">
              </div>
            </div>
          </nav>
  )
}

export default Navbar