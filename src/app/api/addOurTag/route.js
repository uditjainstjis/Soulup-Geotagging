import { NextResponse } from "next/server";
import location from '../../../models/location'
import {connectToDatabase} from '../../../lib/mongodb'

export async function POST(req){

    try{
        const data = await req.json()

        const values = {
            location:{
            lat:Number(data.location.latitude),
            lng:Number(data.location.longitude)},
            city:data.city,
            tag:data.tag,
            time:data.time
        }

        connectToDatabase()
        const newTag = new location(values)
        newTag.save().then(()=>{console.log("meow")})

        return NextResponse.json({message:"request for adding tag recieved"})
    }
    catch(err){
        console.log("tag lane mein errror", err)
        return NextResponse.json({message:"we got some error at server",error:err}, {status:501})
    }
}

