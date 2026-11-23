import { TelemetryRecord } from "./types";
import { formatWibDate, formatWibTime, normalizeTimestamp } from "./utils";

export const FIREBASE_CONFIG = {
  host:
    process.env.NEXT_PUBLIC_FIREBASE_HOST ||
    "akuisisi-data-sensor-esp32-default-rtdb.asia-southeast1.firebasedatabase.app",
  auth:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH ||
    "Bq9VruxnrWFa1cs9j1m5ivqH4qRXjI3PP8NSv4NU",
  path:
    process.env.NEXT_PUBLIC_FIREBASE_PATH ||
    "historyDataCahaya",
};

/**
 * Seed data matching actual Firebase RTDB records from ESP32 telemetry
 */
export const SEED_TELEMETRY_DATA: TelemetryRecord[] = [
  {
    id: "-P64cdAf-REbQoqxi3sP",
    value: 902,
    condition: "Terang (Terlalu Terang)",
    timestamp: 1794317128427,
    formattedTime: "20:25:28",
    formattedDate: "2026-11-10",
  },
  {
    id: "-P4zCo0gdEA1gV-s3lUZ",
    value: 221,
    condition: "IDEAL (Cahaya Sesuai Standar SNI)",
    timestamp: 1793135689836,
    formattedTime: "14:43:18",
    formattedDate: "2026-10-18",
  },
  {
    id: "-P4zAAMBQ0e0HA94WTx6",
    value: 992,
    condition: "BERLEBIHAN (Terlalu Terang)",
    timestamp: 1793135660000,
    formattedTime: "14:43:00",
    formattedDate: "2026-10-18",
  },
  {
    id: "-P4zA9M9Q3e8HA91WEp2",
    value: 940,
    condition: "BERLEBIHAN (Terlalu Terang)",
    timestamp: 1793135630000,
    formattedTime: "14:42:30",
    formattedDate: "2026-10-18",
  },
  {
    id: "-P4zA7z2P7a1HA88QKa1",
    value: 710,
    condition: "CUKUP TERANG",
    timestamp: 1793135600000,
    formattedTime: "14:42:00",
    formattedDate: "2026-10-18",
  },
  {
    id: "-P4zA5k6D1b2HB67LMq9",
    value: 480,
    condition: "IDEAL (Normal)",
    timestamp: 1793135570000,
    formattedTime: "14:41:30",
    formattedDate: "2026-10-18",
  },
  {
    id: "-P4zA3j8F9c3HB42NPs4",
    value: 350,
    condition: "IDEAL (Normal)",
    timestamp: 1793135540000,
    formattedTime: "14:41:00",
    formattedDate: "2026-10-18",
  },
  {
    id: "-P4zA1h4K5e4HB10KLr7",
    value: 240,
    condition: "IDEAL (Normal)",
    timestamp: 1793135510000,
    formattedTime: "14:40:30",
    formattedDate: "2026-10-18",
  },
  {
    id: "-P4z9zg1N8g5HA98JJq3",
    value: 120,
    condition: "REDUP (Kurang Terang)",
    timestamp: 1793135480000,
    formattedTime: "14:40:00",
    formattedDate: "2026-10-18",
  },
];

/**
 * Transforms Firebase Realtime Database object into sorted array of TelemetryRecords
 */
export function transformFirebaseData(rawObj: Record<string, any>): TelemetryRecord[] {
  if (!rawObj || typeof rawObj !== "object") return [];

  const records: TelemetryRecord[] = [];

  for (const [key, val] of Object.entries(rawObj)) {
    if (!val || typeof val !== "object") continue;

    const rawTs = val.timestamp || Date.now();
    const timestamp = normalizeTimestamp(rawTs);
    const value = typeof val.value === "number" ? val.value : parseFloat(val.value) || 0;
    const condition =
      val.condition ||
      (value > 750
        ? "Terang (Terlalu Terang)"
        : value >= 150
        ? "IDEAL (Cahaya Sesuai Standar SNI)"
        : "REDUP (Kurang Terang)");

    records.push({
      id: key,
      value: Math.round(value),
      condition,
      timestamp,
      formattedTime: formatWibTime(timestamp),
      formattedDate: formatWibDate(timestamp),
    });
  }

  // Sort descending by timestamp (latest first)
  records.sort((a, b) => b.timestamp - a.timestamp);
  return records;
}

/**
 * Fetch telemetry data from Firebase RTDB REST API
 */
export async function fetchTelemetryData(): Promise<TelemetryRecord[]> {
  try {
    const url = `https://${FIREBASE_CONFIG.host}/${FIREBASE_CONFIG.path}.json?auth=${FIREBASE_CONFIG.auth}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Firebase RTDB error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data) return SEED_TELEMETRY_DATA;

    const parsed = transformFirebaseData(data);
    return parsed.length > 0 ? parsed : SEED_TELEMETRY_DATA;
  } catch (error) {
    console.warn("Using fallback telemetry data due to network error:", error);
    return SEED_TELEMETRY_DATA;
  }
}

/**
 * Live streaming subscription using Firebase Realtime Database SSE (Server-Sent Events)
 */
export function subscribeToFirebaseSSE(
  onData: (records: TelemetryRecord[], isConnected: boolean) => void,
  onError?: (err: any) => void
): () => void {
  let eventSource: EventSource | null = null;
  let pollInterval: NodeJS.Timeout | null = null;
  let activeDataMap: Record<string, any> = {};

  const startStream = () => {
    try {
      if (typeof window === "undefined" || !window.EventSource) {
        startPolling();
        return;
      }

      const streamUrl = `https://${FIREBASE_CONFIG.host}/${FIREBASE_CONFIG.path}.json?auth=${FIREBASE_CONFIG.auth}`;
      eventSource = new EventSource(streamUrl);

      eventSource.addEventListener("put", (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.path === "/") {
            // Full initial dump or replace
            activeDataMap = payload.data || {};
          } else if (payload && payload.path) {
            // Single item push: path e.g. "/-P64cdAf-REbQoqxi3sP"
            const itemKey = payload.path.replace(/^\//, "");
            if (itemKey) {
              activeDataMap[itemKey] = payload.data;
            }
          }
          const records = transformFirebaseData(activeDataMap);
          onData(records.length > 0 ? records : SEED_TELEMETRY_DATA, true);
        } catch (e) {
          console.error("Failed to parse SSE put message:", e);
        }
      });

      eventSource.addEventListener("patch", (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.data) {
            // Patch updates
            Object.assign(activeDataMap, payload.data);
            const records = transformFirebaseData(activeDataMap);
            onData(records.length > 0 ? records : SEED_TELEMETRY_DATA, true);
          }
        } catch (e) {
          console.error("Failed to parse SSE patch message:", e);
        }
      });

      eventSource.onerror = (err) => {
        console.warn("Firebase SSE stream connection lost, falling back to polling", err);
        if (onError) onError(err);
        onData(
          transformFirebaseData(activeDataMap).length > 0
            ? transformFirebaseData(activeDataMap)
            : SEED_TELEMETRY_DATA,
          false
        );
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        startPolling();
      };
    } catch (e) {
      console.warn("SSE init error, switching to polling", e);
      startPolling();
    }
  };

  const startPolling = () => {
    if (pollInterval) return;
    const poll = async () => {
      try {
        const records = await fetchTelemetryData();
        onData(records, true);
      } catch (err) {
        onData(SEED_TELEMETRY_DATA, false);
      }
    };

    poll();
    pollInterval = setInterval(poll, 3000);
  };

  startStream();

  return () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  };
}

