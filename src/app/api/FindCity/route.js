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


    // Iterate over results and address_components to find the district


        const response = await axios.get(url);
        const data = response.data;
        console.log("lele")
        console.log("lele")
        console.log("lele")
        console.log("lele")
        console.log("lele")
        console.log("lele")
        console.log("lele")
        console.log("lele")
        console.log("lele")
        console.log(data.results[2]);

        const District = data.results[0].address_components[3].long_name
        // const District = data
        console.log(District)

        return NextResponse.json({District});
    }
    catch(error){
        console.error("Error fetching Coordinated to Find City:", error);
        return NextResponse.json({ error: 'Failed to add location' }, { status: 510 })
    }
}