// pages/api/undoTag.js (for Pages Router)
// or app/api/undoTag/route.js (for App Router, adjust structure slightly)

import { NextResponse } from "next/server";
import Location from "../../../models/location"; // Adjust path as needed
import User from "../../../models/user"; // Import User model to potentially reset timestamp
import mongoose from "mongoose"; // Import mongoose to use ObjectId
import { connectToDatabase } from "../../../lib/mongodb"; // Adjust path as needed
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth.config"; // Adjust path as needed

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const userEmail = session.user.email;

        await connectToDatabase();

        // Get data from request body (the ID of the entry to delete)
        const { tagId } = await req.json(); // Expecting the tagId here

        if (!tagId) {
             return NextResponse.json({ message: "Missing tag ID for undo." }, { status: 400 });
        }

        // Validate the tagId format (optional but recommended)
        if (!mongoose.Types.ObjectId.isValid(tagId)) {
             return NextResponse.json({ message: "Invalid tag ID format." }, { status: 400 });
        }

        // Find and delete the specific location document by _id AND email
        // The email check is CRUCIAL FOR SECURITY to ensure a user can only delete their own records.
        const result = await Location.deleteOne({
            _id: new mongoose.Types.ObjectId(tagId), // Use the ID
            email: userEmail, // Crucial security check
        });

        if (result.deletedCount === 0) {
             // If deletedCount is 0, it means no document matched the _id AND email
             // This could be because the ID was wrong, or the email didn't match (user didn't own it),
             // or it was already deleted.
             return NextResponse.json({ message: "Tag not found or you do not have permission to undo it." }, { status: 404 });
        }

        // --- OPTIONAL: Reset User's Rate Limit Timestamp ---
        // If undoing the tag should immediately give the user their rate limit slot back,
        // you would update the User model here.
        // Example: Resetting the timestamp field to null or an old date.
        // await User.updateOne({ email: userEmail }, { $set: { timestamp: null } });
        // Decide if this is the desired behavior based on your app's logic.
        // For this example, we'll leave it commented out.

        return NextResponse.json({ message: "Tag undone successfully." });

    } catch (err) {
        console.error("Error undoing tag:", err);
         // Return a more detailed error in development/testing
        return NextResponse.json({ message: "Server error occurred during undo.", error: err.message }, { status: 500 });
    }
}