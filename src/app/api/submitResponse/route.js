// pages/api/submitResponse.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import SurveyResponse from '../../../models/surveyResponse';
import { getServerSession } from "next-auth/next";

export async function POST(req) {
    try {
        const session = await getServerSession(req);

        console.log("Session object:", session); // ADD THIS LINE

        if (!session || !session.user) {
            return NextResponse.json(
                { response: "Unauthorized, session required to submit response" },
                {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store, no-cache, must-revalidate'
                    }
                }
            );
        }

        const userEmail = session.user.email; // Extract email from session
        console.log("User email from session:", userEmail); // ADD THIS LINE

        if (!userEmail) { // ADD THIS CHECK
            console.log("Email is missing in session.user.email!"); // ADD THIS LINE
            return NextResponse.json({ success: false, error: "Email not found in session." }, { status: 400 }); // Return error if email is missing
        }


        await connectToDatabase();

        const { question, answer } = await req.json();


        if (!question || !answer) {
            return NextResponse.json({ success: false, error: "Question and answer are required." }, { status: 400 });
        }

        const newSurveyResponse = new SurveyResponse({
            email: userEmail,
            question: question,
            response: answer,
        });

        console.log("SurveyResponse object before save:", newSurveyResponse); // ADD THIS LINE


        await newSurveyResponse.save();

        return NextResponse.json({ success: true, message: "Response submitted successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Error submitting survey response:", error);
        return NextResponse.json({ success: false, error: `Server error: Failed to submit response - ${error}` }, { status: 500 });
    }
}