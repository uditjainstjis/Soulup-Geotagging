import mongoose from "mongoose";
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

/**
 * Update locations based on `time` field transitions.
 * @param {String} fromTime - The current `time` value (e.g., "6 hours ago").
 * @param {String} toTime - The new `time` value (e.g., "12 hours ago" or "archived").
 */

export async function updateLocations(fromTime, toTime) {
  try {
    // Find records with the specified `time` value

    const locations = await Location.find({ time: fromTime });

    if (!locations.length) {
      console.log(`⚠️ No records found for '${fromTime}'.`);
      return;
    }

    console.log(`🔄 Updating ${locations.length} records from '${fromTime}' → '${toTime}'`);

    // Update matching records
    await Location.updateMany(
      { time: fromTime },
      { $set: { time: toTime } }
    );

    console.log(`✅ Successfully updated ${locations.length} records from '${fromTime}' → '${toTime}'`);
  } catch (error) {
    console.error("❌ Error updating locations:", error);
  }
}
