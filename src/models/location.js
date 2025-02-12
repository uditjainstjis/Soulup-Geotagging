import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  city: { type: String, required: true },
  tag: { type: String, required: true },
  time: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String},
});

const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema);

export default Location; 