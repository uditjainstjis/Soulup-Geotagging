import { NextResponse } from "next/server";
import { connectToDatabase } from '../../../lib/mongodb'; // Import the connection function
// import Location from '../../../models/location';
import axios from "axios";

export async function POST(req){
    try{
        const body = await req.json();
        console.log("recieved",body);
        await connectToDatabase(); 
        const lat = body.latitude;
        const lng = body.longitude;

        if(!lat || !lng){
            return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 });
        }

        const google_api = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_NO_RESTRICTION;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&region=in&key=${google_api}`;


        const response = await axios.get(url);
        const data = response.data;

        const District = data.results?.flatMap(result => result.address_components || [])
        .find(comp => comp.types?.includes("administrative_area_level_3"))?.long_name;
      

        return NextResponse.json({District});
    }
    catch(error){
        console.error("Error fetching Coordinated to Find City:", error);
        return NextResponse.json({ error: 'Failed to add location' }, { status: 510 })
    }
}