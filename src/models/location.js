import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  city: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Location", LocationSchema);

const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema);
// const Locat = new Location({"latitude":1234123.123412341,"longitude":1234123.123412341,"city":"Delhi","country":"India"});
// await Locat.save();
export default Location;