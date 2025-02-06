import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  latitude: {
    type: mongoose.Decimal128,
    required: true,
  },
  longitude: {
    type: mongoose.Decimal128,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: false,
  },
});

const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema);
// const Locat = new Location({"latitude":1234123.123412341,"longitude":1234123.123412341,"city":"Delhi","country":"India"});
// await Locat.save();
export default Location;