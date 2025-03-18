// app/api/admin/tags/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Tag from "../../../models/tag"; // Assuming you have a Tag model

export async function POST(req) {
    try {
        // Admin authentication should be added here if needed for tag management
        // For simplicity, I'm skipping authentication in this example, but it's crucial for production

        await connectToDatabase();
        const tagData = await req.json();
        const newTags = tagData.tags; // Expecting an array of tag names in the request body

        if (!Array.isArray(newTags)) {
            return NextResponse.json({ message: "Invalid request body. 'tags' should be an array." }, { status: 400 });
        }

        // Clear existing tags
        await Tag.deleteMany({});

        // Insert new tags
        if (newTags.length > 0) {
            const tagsToInsert = newTags.map(tagName => ({ name: tagName.trim() })); // Trim whitespace
            await Tag.insertMany(tagsToInsert);
        }

        return NextResponse.json({ message: "Tags updated successfully." });

    } catch (error) {
        console.error("Error updating tags:", error);
        return NextResponse.json({ message: "Failed to update tags.", error: error.message }, { status: 500 });
    }
}


export async function GET() {
    try {
        await connectToDatabase();

        const tagsFromDB = await Tag.find({}).select('name -_id');
        const tags = tagsFromDB.map(tagDoc => tagDoc.name);

        return NextResponse.json({ tags: tags });

    } catch (error) {
        console.error("Error fetching tags from MongoDB:", error);
        return NextResponse.json({ message: "Failed to fetch tags from database", error: error }, { status: 500 });
    }
}