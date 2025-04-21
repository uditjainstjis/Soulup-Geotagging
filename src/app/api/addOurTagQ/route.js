import { NextResponse } from "next/server";
import Location from "../../../models/location";
import User from "../../../models/user";
import { connectToDatabase } from "../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth.config";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const userEmail = session.user.email;
        const userName = session.user.name;

        // Connect to DB
        await connectToDatabase();

        // Fetch user timestamp
        const user = await User.findOne({ email: userEmail });

        const currentTime = new Date();

        if (user && user.timestamp) {

            // Update user timestamp
            await User.updateOne({ email: userEmail }, { $set: { timestamp: currentTime } });
        } else {
            // If user does not exist, create a new entry with current timestamp
            await User.create({ email: userEmail, name: userName, profilePhoto: session.user.image, timestamp: currentTime });
        }

        // Get request data
        const data = await req.json();
        const values = {
            city: data.city,
            tag: data.tag,
            time: currentTime, // Store current timestamp as Date
            location: {
                lat: data.location.lat,
                lng: data.location.lng,
            },
            email: userEmail,
            name: userName,
            gender: data.gender,
            ageBracket: data.ageBracket,
            socialProfile: data.socialProfile,
            profilePhoto: data.profilePhoto, // Include profilePhoto from request
        };

        // Save tag to the Location collection
        await Location.create(values);

        return NextResponse.json({ message: "Tag added successfully." });
    } catch (err) {
        console.error("Error adding tag:", err);
        return NextResponse.json({ message: "Server error occurred.", error: err }, { status: 500 });
    }
}