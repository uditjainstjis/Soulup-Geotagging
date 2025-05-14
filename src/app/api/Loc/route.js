// /pages/api/Loc.js or /app/api/Loc/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Location from '../../../models/location'; // Make sure this path is correct
import User from '../../../models/user'; // Make sure this path is correct
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

    // Check if user exists (This logic can stay)
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

    // --- Removed Pagination Logic ---
    // const url = new URL(req.url);
    // const skip = parseInt(url.searchParams.get('skip') || '0', 10);
    // const limit = parseInt(url.searchParams.get('limit') || '1000', 10);
    // if (isNaN(skip) || isNaN(limit) || skip < 0 || limit <= 0) { ... }

    // --- Fetch ALL locations in one go ---
    // Removed .skip(skip).limit(limit)
    const locations = await Location.find();

    // --- Removed totalCount as it's not needed for chunking ---
    // const totalCount = await Location.countDocuments();

    // Return all locations directly
    return NextResponse.json({ locations }); // Simply return the array within an object

  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache' // Consider setting appropriate cache headers
        }
      }
    );
  }
}

// POST method remains unchanged
export async function POST(req) {
  try {
    await connectToDatabase();

    const { email, gender, ageBracket } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!gender || !ageBracket) {
      return NextResponse.json({ error: 'Gender and ageBracket are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
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