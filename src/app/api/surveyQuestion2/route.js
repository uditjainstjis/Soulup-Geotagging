import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import SurveyQuestion from '../../../models/surveyQuestion';
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
        console.log("Database connection successful.");

        const query = { display: true };
        console.log("Query:", query);  // Log the actual query being executed

        const surveyQuestion = await SurveyQuestion.findOne(query);
        console.log("Survey Question from DB:", surveyQuestion); // Log what the query returns

        if (surveyQuestion === null) {
            console.log("No survey question found with display: true");
            return NextResponse.json(
                { question: 'No survey question found', display: false }
            );
        }
        console.log("Survey Question found:", surveyQuestion);
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