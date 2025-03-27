import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/user';
import { getServerSession } from "next-auth/next";

export async function GET(req) {
  try {
    await connectToDatabase();

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

    const userEmail = session.user.email;

    // Fetch user details based on email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user details
    return NextResponse.json(user);

  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}