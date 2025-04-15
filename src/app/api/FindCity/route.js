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
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${42.3636},${71.08521}&region=in&key=${google_api}`;


    // Iterate over results and address_components to find the district


        const response = await axios.get(url);
        const data = response.data;
        console.log("lele")
        console.log("lele")
        console.log("lele")
        console.log("lele")
        console.log("lele")
        // console.log(data.results[2]);

        const getCityOrRegion = (addressComponents, formattedAddress) => {
            // First, try to get administrative_area_level_3 (your primary target)
            const adminLevel3 = addressComponents.find(comp =>
              comp.types?.includes("administrative_area_level_3")
            );
            if (adminLevel3?.long_name) {
              return adminLevel3.long_name;
            }
          
            // If not found, try fallback types
            const fallbackTypes = [
              "locality",
              "postal_town",
              "sublocality",
              "neighborhood",
              "administrative_area_level_2",
              "administrative_area_level_1",
              "country"
            ];
          
            for (const type of fallbackTypes) {
              const component = addressComponents.find(comp =>
                comp.types?.includes(type)
              );
              if (component?.long_name) {
                return component.long_name;
              }
            }
          
            // If none of the above work, return the formatted_address
            return formattedAddress || "Unknown Location";
          };
          
          // Usage
          const formattedAddress = data.results?.[0]?.formatted_address;
          const District = getCityOrRegion(data.results?.[0]?.address_components || [], formattedAddress);
          
          
        // const District = data
        console.log(District)
        console.log(District)
        console.log(data)

        return NextResponse.json({District});
    }
    catch(error){
        console.error("Error fetching Coordinated to Find City:", error);
        return NextResponse.json({ error: 'Failed to add location' }, { status: 510 })
    }
}