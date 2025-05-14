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

    const { email, name, image } = session.user;

    // Check if user already exists in DB
    let user = await User.findOne({ email });

    if (!user) {
      // Calculate timestamp as 2 days before now
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      // Create user with session data and adjusted timestamp
      user = await User.create({
        email,
        name: name || "Unnamed User",
        profilePhoto: image || "",
        timestamp: twoDaysAgo,
      });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error("Error handling user GET:", error);
    return NextResponse.json({ error: 'Failed to fetch or create user' }, { status: 500 });
  }
}
