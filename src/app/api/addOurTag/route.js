// pages/api/addOurTag.js (or app/api/addOurTag/route.js)
import { NextResponse } from "next/server";
import Location from "../../../models/location";
import User from "../../../models/user";
import ServerConfig from "../../../models/serverConfig"; // Import ServerConfig model
import { connectToDatabase } from "../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth.config"; // Adjust path as needed

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const userEmail = session.user.email;
        const userName = session.user.name; // Ensure name is available if needed

        // Connect to DB
        await connectToDatabase();

        // Fetch user and ServerConfig for rate limiting
        const [user, serverConfig] = await Promise.all([
             User.findOne({ email: userEmail }),
             ServerConfig.findOne() // Assuming only one config document
        ]);

        const currentTime = new Date();
        const windowWidthHours = serverConfig?.windowWidth || 24; // Default to 24 if not found

        if (user && user.timestamp) {
            const lastTimestamp = new Date(user.timestamp);
            const timeDiff = (currentTime - lastTimestamp) / (1000 * 60 * 60); // Convert to hours

            if (timeDiff < windowWidthHours) {
                const remainingHours = (windowWidthHours - timeDiff).toFixed(2);
                return NextResponse.json(
                    { message: `Can't add more tags today. Try again in ${remainingHours} hours.` },
                    { status: 429 }
                );
            }
             // If adding is allowed, update the user's timestamp to the current time
             await User.updateOne({ email: userEmail }, { $set: { timestamp: currentTime } });
        } else if (!user) {
            // If user does not exist, create a new user entry with current timestamp
             await User.create({ email: userEmail, name: userName, profilePhoto: session.user.image, timestamp: currentTime });
        } else {
             // User exists but timestamp was somehow null/undefined - update it
             await User.updateOne({ email: userEmail }, { $set: { timestamp: currentTime } });
        }


        // Get request data
        const data = await req.json();
        const values = {
            city: data.city,
            tag: data.tag,
            time: currentTime, // Still store the time, useful for other things, but _id is for undo
            location: {
                lat: data.location.lat,
                lng: data.location.lng,
            },
            email: userEmail,
            name: userName,
            gender: data.gender,
            ageBracket: data.ageBracket,
            socialProfile: data.socialProfile,
            profilePhoto: data.profilePhoto,
        };

        // Save tag to the Location collection and get the created document
        const newLocation = await Location.create(values);

        // --- MODIFICATION: Return the _id of the new document ---
        return NextResponse.json({ message: "Tag added successfully.", tagId: newLocation._id });

    } catch (err) {
        console.error("Error adding tag:", err);
        // Return a more detailed error in development/testing, less in production
        return NextResponse.json({ message: "Server error occurred.", error: err.message }, { status: 500 });
    }
}