// pages/api/updateLocation.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb'; // Adjust path if needed
import Location from '../../../models/location'; // Import Location model (adjust path)
import { getServerSession } from "next-auth/next";

export async function POST(req) {
    let session;
    try {
        // 1. Get Session to authenticate the request
        session = await getServerSession(req);
        console.log("UpdateLocation - Session object:", session);

        if (!session || !session.user) {
            return NextResponse.json(
                { response: "Unauthorized, session required" },
                { status: 401, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
            );
        }

        const sessionUserEmail = session.user.email;
        console.log("UpdateLocation - User email from session:", sessionUserEmail);

        if (!sessionUserEmail) {
            console.log("UpdateLocation - Email is missing in session.user!");
            return NextResponse.json({ success: false, error: "Email not found in session." }, { status: 400 });
        }

        // 2. Get data from frontend request body
        const body = await req.json();
        const {
            location, // Expecting { lat: number, lng: number }
            city,
            tag,      // Expecting a single string tag
            // email, // No need to trust email from body, use session email
            name,
            gender,
            ageBracket,
            socialProfile,
            profilePhoto
        } = body;

        console.log("UpdateLocation - Received body:", body);


        // 3. Validate required fields for the Location model
        if (!location?.lat || !location?.lng) {
             return NextResponse.json({ success: false, error: "Missing required location coordinates (lat/lng)." }, { status: 400 });
        }
        if (!city || typeof city !== 'string' || city.trim() === '') {
             return NextResponse.json({ success: false, error: "Missing or invalid required city." }, { status: 400 });
        }
        if (!tag || typeof tag !== 'string' || tag.trim() === '') {
             return NextResponse.json({ success: false, error: "Missing or invalid required tag." }, { status: 400 });
        }

        // Connect to DB
        await connectToDatabase();

        // 4. Prepare data for Location Model using validated session email
        const locationData = {
            location: {
                lat: location.lat,
                lng: location.lng,
            },
            city: city.trim(),
            tag: tag.trim(),
            time: new Date(),         // Current time for this entry
            email: sessionUserEmail,  // Use authenticated email from session
            // Optional fields from body
            name: name || session.user.name || null, // Use body name, fallback to session
            gender: gender || null,
            ageBracket: ageBracket || null,
            socialProfile: socialProfile || null,
            profilePhoto: profilePhoto || session.user.image || null, // Use body photo, fallback to session
        };

        // 5. Save to Location Collection
        const newLocationEntry = new Location(locationData);
        console.log("UpdateLocation - Location object before save:", newLocationEntry);
        await newLocationEntry.save();
        // --- End Save Operation ---

        return NextResponse.json({ success: true, message: "Location entry created successfully!" }, { status: 201 });

    } catch (error) {
        console.error("Error in /api/updateLocation:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (error.name === 'ValidationError') {
             const errors = Object.values(error.errors).map(el => el.message);
             return NextResponse.json({ success: false, error: `Validation Failed: ${errors.join(', ')}` }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: `Server error: ${errorMessage}` }, { status: 500 });
    }
}