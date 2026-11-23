import { NextResponse } from "next/server";
import { FIREBASE_CONFIG, fetchTelemetryData, SEED_TELEMETRY_DATA } from "@/lib/firebase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const records = await fetchTelemetryData();
    return NextResponse.json({
      success: true,
      count: records.length,
      host: FIREBASE_CONFIG.host,
      path: FIREBASE_CONFIG.path,
      data: records,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch telemetry data",
        data: SEED_TELEMETRY_DATA,
      },
      { status: 500 }
    );
  }
}

