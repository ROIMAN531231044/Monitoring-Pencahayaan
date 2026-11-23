export interface TelemetryRecord {
  id: string;
  value: number;
  condition: string;
  timestamp: number;
  formattedTime?: string;
  formattedDate?: string;
  relativeTime?: string;
}

export interface TelemetryStats {
  currentLux: number;
  currentCondition: string;
  currentNodeKey: string;
  lastUpdated: string;
  minLux: number;
  maxLux: number;
  avgLux: number;
  changePercentage: number;
  accuracy: string;
  peakTime: string;
  peakValue: number;
  totalRecords: number;
}

export type TimeframeRange = "1h" | "6h" | "24h" | "7d" | "all";

export type ConditionCategory = "glare" | "ideal" | "bright" | "dim";

export interface ConditionInfo {
  category: ConditionCategory;
  label: string;
  badgeClass: string;
  textClass: string;
  description: string;
  standardLabel: string;
}

