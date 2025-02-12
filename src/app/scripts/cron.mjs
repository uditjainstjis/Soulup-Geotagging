import cron from "node-cron";
import { updateLocations } from "./tasks.js";


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

console.log("✅ Cron job service started!");

// Every 6 hours → "6 hours ago" → "12 hours ago"
cron.schedule("0 */6 * * *", async () => {
  console.log("🔄 Running 6-hour update...");
  await updateLocations("6 hours ago", "12 hours ago");
});

// Every 12 hours → "12 hours ago" → "24 hours ago"
cron.schedule("0 */12 * * *", async () => {
  console.log("🔄 Running 12-hour update...");
  await updateLocations("12 hours ago", "24 hours ago");
});

// Every 24 hours → "24 hours ago" → "This week"
cron.schedule("0 0 * * *", async () => {
  console.log("🌙 Running daily update...");
  await updateLocations("24 hours ago", "This week");
});

// Once a week → "This week" → "archived"
cron.schedule("0 0 * * 0", async () => {
  console.log("🗑️ Running weekly cleanup...");
  await updateLocations("This week", "archived");
});
