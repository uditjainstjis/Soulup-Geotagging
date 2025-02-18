// src/lib/auth.config.js
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET, // Redundant, but keeping for compatibility
    callbacks: {
        async jwt({ token, account }) { // Added `account` and `profile`
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) { // Added `user` parameter
            session.accessToken = token.accessToken
            return session
        }
    },
    pages: {
        signIn: '/signin',  // Example: Custom sign-in page
        error: '/error', // Example: Custom error page

    },
};