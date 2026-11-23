import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ConditionInfo, TelemetryRecord, TelemetryStats } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes timestamp from Firebase (handles both 10-digit seconds and 13-digit milliseconds)
 */
export function normalizeTimestamp(raw: number | string | undefined): number {
  if (!raw) return Date.now();
  const num = typeof raw === "string" ? parseInt(raw, 10) : raw;
  if (isNaN(num)) return Date.now();
  // If 10 digits (epoch seconds), convert to ms
  return num < 10000000000 ? num * 1000 : num;
}

/**
 * Format timestamp into WIB (UTC+7) time string: HH:mm:ss
 */
export function formatWibTime(timestamp: number): string {
  const date = new Date(normalizeTimestamp(timestamp));
  return date.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).replace(/\./g, ":");
}

/**
 * Format timestamp into WIB date string: YYYY-MM-DD
 */
export function formatWibDate(timestamp: number): string {
  const date = new Date(normalizeTimestamp(timestamp));
  const year = date.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", year: "numeric" });
  const month = date.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", month: "2-digit" });
  const day = date.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", day: "2-digit" });
  return `${year}-${month}-${day}`;
}

/**
 * Evaluates ambient lighting condition based on SNI 03-6197 guidelines
 */
export function getConditionInfo(conditionStr: string | undefined, lux: number): ConditionInfo {
  const cleanCond = (conditionStr || "").toUpperCase();

  // Glare / Over threshold (e.g. "Terang (Terlalu Terang)" or "BERLEBIHAN")
  if (
    cleanCond.includes("BERLEBIHAN") ||
    cleanCond.includes("TERLALU TERANG") ||
    lux > 750
  ) {
    return {
      category: "glare",
      label: conditionStr || "BERLEBIHAN (Terlalu Terang)",
      badgeClass: "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
      textClass: "text-amber-400",
      description: "Tingkat penerangan melebihi standar kenyamanan visual ruang tamu (SNI 03-6197: 150-300 Lux). Disarankan meredupkan lampu atau tirai untuk menghindari silau.",
      standardLabel: "Kategori: Sangat Terang (Silau)",
    };
  }

  // Ideal / Standard SNI (150 - 500 Lux)
  if (
    cleanCond.includes("IDEAL") ||
    cleanCond.includes("NORMAL") ||
    cleanCond.includes("SNI") ||
    (lux >= 150 && lux <= 500)
  ) {
    return {
      category: "ideal",
      label: conditionStr || "IDEAL (Cahaya Sesuai Standar SNI)",
      badgeClass: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
      textClass: "text-emerald-400",
      description: "Tingkat penerangan optimal sesuai standar kenyamanan SNI 03-6197 (150 - 300 Lux). Kondisi sangat ideal untuk aktivitas visual dan relaksasi.",
      standardLabel: "Kategori: Standar SNI Terpenuhi",
    };
  }

  // Bright (500 - 750 Lux)
  if (cleanCond.includes("CUKUP") || (lux > 500 && lux <= 750)) {
    return {
      category: "bright",
      label: conditionStr || "CUKUP TERANG",
      badgeClass: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]",
      textClass: "text-cyan-400",
      description: "Penerangan berada pada batas atas kenyamanan. Cocok untuk pekerjaan presisi/membaca, namun mendekati batas silau.",
      standardLabel: "Kategori: Terang Nyaman",
    };
  }

  // Low / Redup (< 150 Lux)
  return {
    category: "dim",
    label: conditionStr || "REDUP (Kurang Terang)",
    badgeClass: "bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.2)]",
    textClass: "text-blue-400",
    description: "Tingkat penerangan berada di bawah standar rekomendasi ruang tamu (< 150 Lux). Disarankan menyalakan lampu tambahan untuk menjaga kesehatan mata.",
    standardLabel: "Kategori: Kurang Pencahayaan",
  };
}

/**
 * Calculates analytics statistics from record list
 */
export function calculateTelemetryStats(records: TelemetryRecord[]): TelemetryStats {
  if (!records || records.length === 0) {
    return {
      currentLux: 0,
      currentCondition: "MEMUAT DATA...",
      currentNodeKey: "-",
      lastUpdated: "Memuat...",
      minLux: 0,
      maxLux: 0,
      avgLux: 0,
      changePercentage: 0,
      accuracy: "±20% (LX)",
      peakTime: "--:--",
      peakValue: 0,
      totalRecords: 0,
    };
  }

  const latest = records[0];
  const luxValues = records.map((r) => r.value).filter((v) => typeof v === "number" && !isNaN(v));

  const minLux = luxValues.length > 0 ? Math.min(...luxValues) : 0;
  const maxLux = luxValues.length > 0 ? Math.max(...luxValues) : 0;
  const sumLux = luxValues.reduce((acc, val) => acc + val, 0);
  const avgLux = luxValues.length > 0 ? Math.round(sumLux / luxValues.length) : 0;

  // Find peak record
  const peakRecord = records.find((r) => r.value === maxLux) || latest;
  const peakTime = peakRecord.formattedTime || formatWibTime(peakRecord.timestamp);

  // Compare latest to average or previous
  const prevLux = records.length > 1 ? records[1].value : avgLux;
  const diff = latest.value - prevLux;
  const changePercentage = prevLux > 0 ? Number(((diff / prevLux) * 100).toFixed(1)) : 0;

  return {
    currentLux: latest.value,
    currentCondition: latest.condition || "NORMAL",
    currentNodeKey: latest.id,
    lastUpdated: latest.formattedTime || formatWibTime(latest.timestamp),
    minLux,
    maxLux,
    avgLux,
    changePercentage,
    accuracy: "±20% (LX)",
    peakTime,
    peakValue: maxLux,
    totalRecords: records.length,
  };
}

/**
 * Exports data table rows to a downloaded CSV file
 */
export function exportToCsv(records: TelemetryRecord[], filename = "lux_history_telemetry.csv") {
  if (!records || records.length === 0) {
    alert("Tidak ada data telemetri untuk diekspor.");
    return;
  }

  const headers = ["Waktu (WIB)", "Tanggal", "Firebase Node Key", "Nilai Lux (lx)", "Kondisi Ambien", "Timestamp (ms)"];
  const rows = records.map((r) => [
    `"${r.formattedTime || formatWibTime(r.timestamp)}"`,
    `"${r.formattedDate || formatWibDate(r.timestamp)}"`,
    `"${r.id}"`,
    r.value,
    `"${r.condition.replace(/"/g, '""')}"`,
    r.timestamp,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

