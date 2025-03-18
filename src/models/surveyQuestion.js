// models/surveyQuestion.js
import mongoose from 'mongoose';

const surveyQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    display: {type: Boolean, required: true},
    possibleTags: { type: [String], default: [] }, // Array of tags
});

const SurveyQuestion = mongoose.models.surveyQuestion || mongoose.model('surveyQuestion', surveyQuestionSchema);

export default SurveyQuestion;