import { NextResponse } from "next/server";
import Location from '../../../models/location'
import {connectToDatabase} from '../../../lib/mongodb'

export async function POST(req){

    try{
        const data = await req.json()
        console.log("999999999999999999999999")
        console.log(data)
        const values = {
            city:data.city,
            tag:data.tag,
            time:data.time,
            location:{
                lat:data.location.lat,
                lng:data.location.lng
            }
        }

        connectToDatabase()
        const newTag = new Location(values)
        console.log(8888888888888888)
        console.log(newTag)
        await newTag.save()
        .then(()=>{console.log("meow")})
        // .catch((err)=>{console.log("We got error adding the tag to DB",err)})

        return NextResponse.json({message:"request for adding tag recieved"})
    }
    catch(err){
        console.log("tag lane mein errror", err)
        return NextResponse.json({message:"we got some error at server",error:err}, {status:501})
    }
}

