import mongoose from 'mongoose';

// Define the structure for the location object
const locationSchema = new mongoose.Schema({
    lat: { type: Number },
    lng: { type: Number },
}, { _id: false }); // _id: false prevents Mongoose from creating an _id for this subdocument

const surveyResponseSchema = new mongoose.Schema({
    // Core survey fields
    question: {
        type: String,
        required: true,
        trim: true // Automatically remove leading/trailing whitespace
    },
    response: {
        type: String,
        required: true,
        trim: true
    },
    possibleTags: { // Tags associated with the question/response context
        type: [String],
        default: []
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },

    // --- User information snapshot at the time of submission ---
    email: { // Email of the user who submitted
        type: String,
        required: true,
        trim: true,
        lowercase: true // Store emails consistently
        // Consider adding an index if you query by email often:
        // index: true
    },
    name: { // User's name
        type: String,
        trim: true
        // required: false, as you have fallbacks
    },
    profilePhoto: { // URL to user's profile photo
        type: String,
        trim: true
    },
    gender: { // User's gender
        type: String,
        trim: true
    },
    ageBracket: { // User's age bracket
        type: String,
        trim: true
    },
    socialProfile: { // Link/handle for user's social profile
        type: String,
        trim: true
    },
    city: { // User's city
        type: String,
        trim: true
    },
    location: locationSchema, // Embed the location subdocument

    // Note: 'tag' seems to duplicate 'possibleTags' based on your API logic (`tag: tags`).
    // If this is intended, it's included here. If it was a mistake, you can remove this field.
    tag: {
        type: [String],
        default: []
     },


}, {
    // Add Mongoose timestamps (createdAt, updatedAt) automatically
    timestamps: true
});

// Optional: Add an index on email and submittedAt for potentially faster queries
// surveyResponseSchema.index({ email: 1, submittedAt: -1 });

const SurveyResponse = mongoose.models.SurveyResponse || mongoose.model('SurveyResponse', surveyResponseSchema);

export default SurveyResponse;