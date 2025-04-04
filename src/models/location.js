import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  city: { type: String, required: true },
  tag: { type: String, required: true },
  time: { type: Date, required: true, default: Date.now },
  email: { type: String, required: true },
  name: { type: String },
  gender: { type: String },
  ageBracket: { type: String },
  socialProfile: { type: String },
  profilePhoto: { type: String }, // Add profilePhoto field - String type, optional
});

// Ensure timestamps for sorting & querying
LocationSchema.index({ time: 1 });

const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema);

export default Location;