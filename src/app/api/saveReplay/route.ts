import { NextRequest, NextResponse } from "next/server";
import { ReplayData } from "@/osuMania/systems/replay";
import fs from "fs";
import path from "path";

function generateUniqueFilename(): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `replay_${timestamp}_${randomString}.womr`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { replaydata: ReplayData };

    if (!body) {
      return NextResponse.json({ error: "No replay data provided" }, { status: 400 });
    }

    const uniqueReplayName = generateUniqueFilename();

    const tempFilePath = path.resolve(process.cwd(), "public/replays", uniqueReplayName);
    if (!fs.existsSync(path.dirname(tempFilePath))) {
      fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
    }

    fs.writeFileSync(tempFilePath, JSON.stringify(body, null, 2));

    setTimeout(() => {
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath); // Delete the file
          console.log(`File ${uniqueReplayName} deleted after 1 minute`);
        }
      } catch (err) {
        console.error(`Error deleting file ${uniqueReplayName}:`, err);
      }
    }, 60000);

    return new NextResponse(
      fs.readFileSync(tempFilePath), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename=${uniqueReplayName}`,
        },
      }
    );
  } catch (error) {
    console.error("Error saving replay:", error);
    return NextResponse.json({ error: "Failed to save replay" }, { status: 500 });
  }
}
