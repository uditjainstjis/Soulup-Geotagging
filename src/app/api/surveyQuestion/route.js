import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import SurveyQuestion from '../../../models/surveyQuestion';
import SurveyResponse from '../../../models/surveyResponse'; // Import SurveyResponse model
import { getServerSession } from "next-auth/next";

export async function GET(req) {
    try {
        const session = await getServerSession(req);

        if (!session || !session.user) {
            return NextResponse.json(
                { response: "Unauthorized" },
                {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store, no-cache, must-revalidate'
                    }
                }
            );
        }

        await connectToDatabase();

        const userEmail = session.user.email;

        // Get the start and end of the current day in UTC
        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setUTCHours(23, 59, 59, 999);

        // Check if the user has already responded today
        const existingResponse = await SurveyResponse.findOne({
            email: userEmail,
            submittedAt: {
                $gte: todayStart,
                $lte: todayEnd
            }
        });

        if (existingResponse) {
            return NextResponse.json(
                { error: 'Already Responded' },
                {
                    status: 409, // Or 409 Conflict might be more appropriate
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                }
            );
        }

        const surveyQuestion = await SurveyQuestion.findOne({ display: true });

        if (!surveyQuestion) {
            return NextResponse.json(
                { error: 'No survey question found' },
                {
                    status: 404,
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                }
            );
        }
        console.log(surveyQuestion);
        return NextResponse.json(surveyQuestion);
    } catch (error) {
        console.error("Error fetching survey question:", error);
        return NextResponse.json(
            { error: 'Failed to fetch survey question' },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            }
        );
    }
}