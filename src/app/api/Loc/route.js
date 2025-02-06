// src/app/api/location/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb'; // Import the connection function
import Location from '../../../models/location'

export async function GET(request) {
  try {
    const db = await connectToDatabase(); 
    const locations = await Location.find(); 
    
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}           
