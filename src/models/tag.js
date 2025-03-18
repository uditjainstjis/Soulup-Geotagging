// app/models/tag.js
import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Optional: if you want to ensure unique tags
    },
    // You can add more fields here if needed, like 'category', 'description', etc.
});

// Check if model is already defined to prevent overwriting during hot reload
const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema);

export default Tag;