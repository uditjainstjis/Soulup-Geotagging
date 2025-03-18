// pages/api/admin/survey-question.js
import { NextResponse } from "next/server";
import { connectToDatabase } from '../../../lib/mongodb';
import SurveyQuestion from '../../../models/surveyQuestion';

export async function GET() {
  try {
    await connectToDatabase();

    const surveyQuestion = await SurveyQuestion.findOne({ display: true });

    if (!surveyQuestion) {
      return NextResponse.json(
        { error: 'No survey question found with display: true' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );
    }

    return NextResponse.json(surveyQuestion, { status: 200 });
  } catch (error) {
    console.error("Error fetching survey question:", error);
    return NextResponse.json(
      { error: 'Failed to fetch survey question from database' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { question, display, possibleTags } = await req.json(); // Get possibleTags

    if (typeof question !== "string" || typeof display !== "boolean" || !Array.isArray(possibleTags)) { // Validate possibleTags
      return NextResponse.json({ success: false, error: "Invalid input: Question must be a string, display must be a boolean, and possibleTags must be an array" }, { status: 400 });
    }


    let existingSurveyQuestion = await SurveyQuestion.findOne({}); // Find the first document

    if (existingSurveyQuestion) {

      existingSurveyQuestion.question = question;
      existingSurveyQuestion.display = display;
      existingSurveyQuestion.possibleTags = possibleTags; // Update possibleTags
      await existingSurveyQuestion.save(); // Save the updated document
      return NextResponse.json({ success: true, message: "Survey question updated in database!" }, { status: 200 });
    } else {
      // If no survey question exists, create a new one
      const newSurveyQuestion = new SurveyQuestion({ question, display, possibleTags }); // Include possibleTags
      await newSurveyQuestion.save();
      return NextResponse.json({ success: true, message: "Survey question created and updated in database!" }, { status: 201 }); // Use 201 for resource creation
    }

  } catch (error) {
    console.error("Error updating survey question:", error);
    return NextResponse.json({ success: false, error: `Server error: Failed to update survey question in database - ${error}` }, { status: 500 });
  }
}