"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
export default function Component() {
  const { data: session } = useSession();
  // useEffect(() => {

  // }, [session, router]); 
  if (session) {
    // redirect("/"); // This works in the App Router
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="relative max-w-md w-full shadow-xl rounded-lg bg-white border border-gray-300 p-6 text-center font-serif">
        <h2 className="text-2xl font-bold font-sans tracking-wide mb-4">GeoTagging site by -{'>'} <span className="text-blue-950">Soul</span><span className="text-yellow-400">Up</span></h2>
        <p className="mb-4 text-gray-600 italic">
          {session ? `Signed in as ${session.user.email}` : "Sign in to see people facing issues like you nearby."}
          
        </p>
        {session ? (
          <button 
            onClick={() => signOut()} 
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        ) : (
          <button 
            onClick={() => signIn()} 
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}
