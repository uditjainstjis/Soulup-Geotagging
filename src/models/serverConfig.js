import mongoose from "mongoose";

const serverConfigSchema = new mongoose.Schema(
  {
    windowWidth: {
      type: Number,
      required: true,
      default: 24, // Default window in hours
    },
  },
  { timestamps: true } // Optional: adds createdAt and updatedAt fields
);

// Export model
export default mongoose.models.ServerConfig || mongoose.model("ServerConfig", serverConfigSchema);
