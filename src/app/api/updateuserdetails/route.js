import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/user';
import { getServerSession } from "next-auth/next";


export async function POST(req) {
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

      const { email, gender, ageBracket, socialProfile } = await req.json(); // Destructure socialProfile

      // Check if email is valid
      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
      }

      // Check if gender and ageBracket are provided
      if (!gender || !ageBracket) {
        return NextResponse.json({ error: 'Gender and ageBracket are required' }, { status: 400 });
      }

      // Update the User model with gender, ageBracket, and socialProfile
      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        // Update existing user
        existingUser.gender = gender;
        existingUser.ageBracket = ageBracket;
        existingUser.socialProfile = socialProfile; // Update socialProfile
        await existingUser.save();
        return NextResponse.json({ message: 'User details updated successfully' });
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }


    } catch (error) {
      console.error("Error processing user details:", error);
      return NextResponse.json({ error: 'Failed to process user details' }, { status: 500 });
    }
  }