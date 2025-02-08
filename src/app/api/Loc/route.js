// src/app/api/location/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb'; // Import the connection function
import Location from '../../../models/location'
import { getServerSession } from "next-auth/next";

export async function GET(req) {

  try {

    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json({response:"Unauthorized"}, { status: 401, statusText: 'Unauthorized' ,    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate' // Disable caching
    }}); // Or redirect if it's a page request
    }else{

    await connectToDatabase(); 
    const locations = await Location.find(); 
    
    return NextResponse.json(locations);
    }
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 ,headers: {

      'Cache-Control': 'no-cache'
      
      }});
  }
}           
