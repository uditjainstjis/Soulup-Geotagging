// pages/api/submitResponse.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import SurveyResponse from '../../../models/surveyResponse'; // Your SurveyResponse model
import { getServerSession } from "next-auth/next";

export async function POST(req) {
    let session;
    try {
        // 1. Get Session
        session = await getServerSession(req);
        console.log("SubmitResponse - Session object:", session);

        if (!session || !session.user) {
            return NextResponse.json(
                { response: "Unauthorized, session required" },
                { status: 401, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
            );
        }

        const userEmail = session.user.email;
        const sessionUserName = session.user.name;
        const sessionUserImage = session.user.image;
        console.log("SubmitResponse - User email from session:", userEmail);

        if (!userEmail) {
            console.log("SubmitResponse - Email is missing in session.user!");
            return NextResponse.json({ success: false, error: "Email not found in session." }, { status: 400 });
        }

        // Connect to DB
        await connectToDatabase();

        // Get survey data from request body
        const { question, answer, tags } = await req.json();

        if (!question || !answer) {
            return NextResponse.json({ success: false, error: "Question and answer are required." }, { status: 400 });
        }

        // Prepare Data for SurveyResponse Model
        const surveyData = {
            email: userEmail,
            question: question,
            response: answer,
            possibleTags: tags || [], // Ensure tags is an array
            submittedAt: new Date(), // Submission time for the survey

            // Basic user snapshot from session (optional but often useful)
            name: sessionUserName || 'anonymous', // Use session name
            profilePhoto: sessionUserImage || null, // Use session image
            // --- No longer fetching or including city, location, gender etc. here ---
        };

        // --- Save ONLY to SurveyResponse Collection ---
        const newSurveyResponse = new SurveyResponse(surveyData);
        console.log("SubmitResponse - SurveyResponse object before save:", newSurveyResponse);
        await newSurveyResponse.save();
        // --- End Save Operation ---

        // Don't trigger location update from here anymore

        return NextResponse.json({ success: true, message: "Survey response submitted successfully!" }, { status: 201 });

    } catch (error) {
        console.error("Error in /api/submitResponse:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (error.name === 'ValidationError') {
             const errors = Object.values(error.errors).map(el => el.message);
             return NextResponse.json({ success: false, error: `Validation Failed: ${errors.join(', ')}` }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: `Server error: ${errorMessage}` }, { status: 500 });
    }
}