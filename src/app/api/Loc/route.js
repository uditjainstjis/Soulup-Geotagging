// /pages/api/Loc.js or /app/api/Loc/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Location from '../../../models/location';
import User from '../../../models/user';
import { getServerSession } from "next-auth/next";

export async function GET(req) {
  try {
    const session = await getServerSession(req);

    if (!session || !session.user) {
      return NextResponse.json(
        { response: "Unauthorized" },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          }
        }
      );
    }

    await connectToDatabase();

    const userEmail = session.user.email;
    const userName = session.user.name;
    const profilePhoto = session.user.image;

    // Check if user exists (This logic can stay as it's separate from data fetching)
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      const pastTimestamp = new Date();
      pastTimestamp.setHours(pastTimestamp.getHours() - 25);

      await User.create({
        email: userEmail,
        name: userName,
        profilePhoto,
        timestamp: pastTimestamp
      });
    }

    // --- Pagination Logic Starts Here ---

    const url = new URL(req.url);
    const skip = parseInt(url.searchParams.get('skip') || '0', 10); // Default skip to 0
    const limit = parseInt(url.searchParams.get('limit') || '1000', 10); // Default limit to 1000

    if (isNaN(skip) || isNaN(limit) || skip < 0 || limit <= 0) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Fetch a chunk of locations
    const locations = await Location.find().skip(skip).limit(limit);

    // Get the total count of locations (needed for frontend to know when to stop)
    // This count query should ideally be fast as it might use an index
    const totalCount = await Location.countDocuments(); // Or count based on your query if you add filters later

    return NextResponse.json({
        locations,
        totalCount,
        skip, // Return skip and limit for potential debugging or client-side checks
        limit,
        // Optional: Indicate if there's a next page - useful if totalCount is very large or estimated
        hasNextPage: (skip + locations.length) < totalCount
    });

  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// POST method remains unchanged unless you need to adapt it
export async function POST(req) {
  try {
    await connectToDatabase();  // Connect to MongoDB

    const { email, gender, ageBracket } = await req.json();  // Extract data

    // Check if email is valid
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Check if gender and ageBracket are provided
    if (!gender || !ageBracket) {
      return NextResponse.json({ error: 'Gender and ageBracket are required' }, { status: 400 });
    }

    // Update the User model with gender and ageBracket
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      // Update existing user
      existingUser.gender = gender;
      existingUser.ageBracket = ageBracket;
      await existingUser.save();
      return NextResponse.json({ message: 'User details updated successfully' });
    } else {
      return NextResponse.json({ error: 'User not found' }, {status: 404});
    }


  } catch (error) {
    console.error("Error processing user details:", error);
    return NextResponse.json({ error: 'Failed to process user details' }, { status: 500 });
  }
}