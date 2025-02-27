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

    // Check if user exists
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      // Set timestamp to 25 hours before (so they can add tags immediately)
      const pastTimestamp = new Date();
      pastTimestamp.setHours(pastTimestamp.getHours() - 25);

      await User.create({
        email: userEmail,
        name: userName,
        profilePhoto,
        timestamp: pastTimestamp
      });
    }

    // Fetch all locations
    const locations = await Location.find();

    return NextResponse.json(locations);
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
