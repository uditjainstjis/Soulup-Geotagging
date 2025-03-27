import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profilePhoto: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  gender: { type: String }, // Add gender field
  ageBracket: { type: String }, // Add ageBracket field
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;

