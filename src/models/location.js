import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  lat: {
    type: mongoose.Decimal128,
    required: true,
  },
  lng: {
    type: mongoose.Decimal128,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  tag:{
    type: String, 
    required: true,
  },
  time:{
    type: String,
    required: true,
  } 
});

const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema);
// const Locat = new Location({"latitude":1234123.123412341,"longitude":1234123.123412341,"city":"Delhi","country":"India"});
// await Locat.save();
export default Location;