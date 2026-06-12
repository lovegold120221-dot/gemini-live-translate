import { NextRequest, NextResponse } from "next/server";
import { EgressClient, EncodedFileOutput, EncodedFileType } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  try {
    const { action, roomName } = await req.json();

    if (!roomName) {
      return NextResponse.json({ error: "Missing roomName parameter" }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !serverUrl) {
      return NextResponse.json({ error: "LiveKit credentials not configured" }, { status: 500 });
    }

    const egressClient = new EgressClient(serverUrl, apiKey, apiSecret);

    if (action === "start") {
      const fileOutput = new EncodedFileOutput({
        fileType: EncodedFileType.MP4,
      });
      const egress = await egressClient.startRoomCompositeEgress(roomName, fileOutput);

      return NextResponse.json({ success: true, egressId: egress.egressId });
    } else if (action === "stop") {
      const list = await egressClient.listEgress({ roomName });
      let stoppedCount = 0;
      
      for (const e of list) {
        // Status 1 (STARTING) or 2 (ACTIVE) indicates an ongoing egress
        if (e.status === 1 || e.status === 2) {
          await egressClient.stopEgress(e.egressId);
          stoppedCount++;
        }
      }
      return NextResponse.json({ success: true, stoppedCount });
    } else {
      return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Recording API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process recording request. Ensure Egress is configured." },
      { status: 500 }
    );
  }
}
