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