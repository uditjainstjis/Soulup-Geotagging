"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState, useEffect } from "react"; // Import useState and useEffect

export default function SignInPage() {
  const { data: session, status } = useSession();
  const [agreed, setAgreed] = useState(false); // State for checkbox
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (session) {
      router.push('/'); // Use router.push for redirection
    }
  }, [session, router]); // Dependency array includes session and router

  const handleSignIn = (e) => {
        e.preventDefault(); // Prevent default form submission

        if (agreed) {
          signIn('google'); // Specify the provider ('google')
        } else {
          alert("Please agree to the Privacy Policy to continue."); // Or a better message
        }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="relative max-w-md w-full shadow-xl rounded-lg bg-white border border-gray-300 p-6 text-center font-serif">
        <h2 className="text-2xl font-bold font-sans tracking-wide mb-4">
          GeoTagging site by -{">"} <span className="text-blue-950">Soul</span><span className="text-yellow-400">Up</span>
        </h2>
        <p className="mb-4 text-gray-600 italic">
          {session ? `Signed in as ${session.user.email}` : "Sign in to see people facing issues like you nearby."}
        </p>

        {!session && ( // Only show sign-in related elements when not signed in
          <form onSubmit={handleSignIn}> {/* Wrap the form with onSubmit */}
            <button
              type="submit" // Use type="submit" for form submission
              disabled={!agreed}
              className={`w-full py-2 hover:cursor-pointer rounded ${agreed ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-400 text-gray-600 cursor-not-allowed"}`}
            >
              Sign In with Google
            </button>

            <div className="mt-4 flex items-center justify-center">
              <input
                type="checkbox"
                id="privacyCheckbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="privacyCheckbox" className="text-sm">
                By signing in, you agree to our{" "}
                <a href="/privacy-policy" target="_blank" className="text-blue-500 underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>
          </form>
        )}

        {session && (
          <button onClick={() => signOut()} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}