// models/surveyResponse.js (Create this file in your models directory)
import mongoose from 'mongoose';

const surveyResponseSchema = new mongoose.Schema({
    email: { type: String, required:true }, // Optional: Add email if you want to track user email - you'd need to pass this from frontend and handle it in API
    question: { type: String, required: true },
    response: { type: String, required: true }, // e.g., "Yes" or "No"
    submittedAt: { type: Date, default: Date.now }
});

const SurveyResponse = mongoose.models.SurveyResponse || mongoose.model('SurveyResponse', surveyResponseSchema);

export default SurveyResponse;