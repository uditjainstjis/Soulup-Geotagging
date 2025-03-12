import mongoose from 'mongoose';

const surveyQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    display: {type: Boolean, required: true},
    });

const SurveyQuestion = mongoose.models.surveyQuestion || mongoose.model('surveyQuestion', surveyQuestionSchema);

export default SurveyQuestion;