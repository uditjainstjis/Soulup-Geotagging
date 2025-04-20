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
    
    // const numberOfSamples = 100;
    const locations = await Location.find();
    // const locations = await Location.aggregate([
    //   { $sample: { size: numberOfSamples } }
    // ]);

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