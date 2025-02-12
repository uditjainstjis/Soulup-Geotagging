import { NextResponse } from "next/server";
import { connectToDatabase } from '../../../lib/mongodb'; // Import the connection function
import Location from '../../../models/location'

export async function GET(req){
    try{

        const {searchParams} = new URL(req.url)
        const tag = searchParams.get('tag')

        if(!tag){
            return NextResponse.json({ message: "Missing 'tag' parameter" }, { status: 400 });
        }

        connectToDatabase();
        const locations = await Location.find({tag:tag})
        
        console.log("laoasdfa",locations)
        return NextResponse.json(locations)
    }
    catch(err){
        console.error("Error finding people with the tag", err)
        return NextResponse.json({message:"unable to recieve the locations for the tag "})
    }
}

