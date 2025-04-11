import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import ServerConfig from "../../../models/serverConfig";

// GET /api/hourSize - Fetch the current windowWidth
export async function GET() {
  try {
    await connectToDatabase();

    const config = await ServerConfig.findOne();

    if (!config) {
      return NextResponse.json(
        { message: "Server configuration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ windowWidth: config.windowWidth });
  } catch (error) {
    console.error("Error fetching hourSize:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/hourSize - Update the windowWidth
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { windowWidth } = body;

    if (typeof windowWidth !== "number" || windowWidth <= 0) {
      return NextResponse.json(
        { message: "Invalid windowWidth value" },
        { status: 400 }
      );
    }

    // Either update the first document, or create it if not present
    const updated = await ServerConfig.findOneAndUpdate(
      {},
      { windowWidth },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: "windowWidth updated successfully",
      windowWidth: updated.windowWidth,
    });
  } catch (error) {
    console.error("Error updating hourSize:", error);
    return NextResponse.json(
      { message: "Failed to update windowWidth" },
      { status: 500 }
    );
  }
}
