import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profilePhoto: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  gender: { type: String },
  ageBracket: { type: String },
  socialProfile: { type: String }, // Add socialProfile field - String type, optional
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;