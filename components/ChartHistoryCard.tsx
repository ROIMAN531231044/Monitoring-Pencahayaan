"use client";

import React, { useEffect, useRef, useState } from "react";
import { TelemetryRecord, TelemetryStats, TimeframeRange } from "@/lib/types";
import { LineChart as ChartIcon } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartHistoryCardProps {
  records: TelemetryRecord[];
  stats: TelemetryStats;
}

export const ChartHistoryCard: React.FC<ChartHistoryCardProps> = ({
  records,
  stats,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeRange>("24h");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  // Filter records based on timeframe
  const filteredRecords = React.useMemo(() => {
    if (!records || records.length === 0) return [];

    const now = records[0]?.timestamp || Date.now();
    let cutoff = 0;

    switch (timeframe) {
      case "1h":
        cutoff = now - 60 * 60 * 1000;
        break;
      case "6h":
        cutoff = now - 6 * 60 * 60 * 1000;
        break;
      case "24h":
        cutoff = now - 24 * 60 * 60 * 1000;
        break;
      case "7d":
        cutoff = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "all":
      default:
        cutoff = 0;
        break;
    }

    const filtered = records.filter((r) => r.timestamp >= cutoff);
    return [...(filtered.length > 0 ? filtered : records)].reverse();
  }, [records, timeframe]);

  // Update chart instance
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const gradientAmber = ctx.createLinearGradient(0, 0, 0, 350);
    gradientAmber.addColorStop(0, "rgba(245, 158, 11, 0.45)");
    gradientAmber.addColorStop(0.5, "rgba(245, 158, 11, 0.15)");
    gradientAmber.addColorStop(1, "rgba(245, 158, 11, 0.0)");

    const labels = filteredRecords.map((r) => r.formattedTime || "");
    const dataPoints = filteredRecords.map((r) => r.value);
    const count = dataPoints.length;

    const glareThreshold = new Array(count).fill(750);
    const comfortThreshold = new Array(count).fill(500);

    const maxDataVal = Math.max(...dataPoints, 800);
    const yAxisMax = Math.ceil((maxDataVal * 1.2) / 100) * 100;

    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 400,
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#0c1322",
          titleColor: "#06b6d4",
          bodyColor: "#f8fafc",
          borderColor: "#334155",
          borderWidth: 1,
          padding: 10,
          displayColors: true,
          callbacks: {
            label: function (context) {
              return ` ${context.dataset.label}: ${context.parsed.y} lx`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
          },
          ticks: {
            color: "#64748b",
            font: {
              family: "JetBrains Mono",
              size: 10,
            },
            maxTicksLimit: 10,
          },
        },
        y: {
          min: 0,
          max: yAxisMax,
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
          },
          ticks: {
            color: "#64748b",
            font: {
              family: "JetBrains Mono",
              size: 11,
            },
            stepSize: 200,
            callback: function (val) {
              return val + " lx";
            },
          },
        },
      },
    };

    chartInstanceRef.current = new ChartJS(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Intensitas Cahaya (Lux)",
            data: dataPoints,
            borderColor: "#f59e0b",
            borderWidth: 2.5,
            backgroundColor: gradientAmber,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: "#fbbf24",
            pointBorderColor: "#070b12",
            pointBorderWidth: 2,
            pointRadius: dataPoints.length > 30 ? 2 : 4,
            pointHoverRadius: 7,
          },
          {
            label: "Ambang Batas Terlalu Terang (750 lx)",
            data: glareThreshold,
            borderColor: "rgba(244, 63, 94, 0.65)",
            borderWidth: 1.5,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
          },
          {
            label: "Batas Atas Standar Nyaman (500 lx)",
            data: comfortThreshold,
            borderColor: "rgba(16, 185, 129, 0.65)",
            borderWidth: 1.5,
            borderDash: [4, 4],
            fill: false,
            pointRadius: 0,
          },
        ],
      },
      options: options,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [filteredRecords]);

  return (
    <div
      className="xl:col-span-6 bg-[#0c1322] border-2 border-slate-700 hover:border-cyan-500/50 transition-colors rounded-xl p-4 md:p-5 flex flex-col justify-between shadow-xl"
      style={{
        boxShadow: "0 0 20px -5px rgba(6, 182, 212, 0.25)",
      }}
      data-purpose="chart-history-card"
    >
      <div>
        {/* Card Header & Timeframe Filter */}
        <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <ChartIcon className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white uppercase font-sans">
              Chart History Data
            </h3>
          </div>

          {/* Timeframe Selectors */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {(["1h", "6h", "24h", "7d"] as TimeframeRange[]).map((tf) => {
              const labelMap: Record<TimeframeRange, string> = {
                "1h": "1 Jam",
                "6h": "6 Jam",
                "24h": "24 Jam",
                "7d": "7 Hari",
                all: "Semua",
              };
              const active = timeframe === tf;
              return (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded transition cursor-pointer ${
                    active
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {labelMap[tf]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend & Peak Information */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-3 text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_#f59e0b]" />
              Intensitas Lux
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-rose-500 inline-block" />
              Batas Silau (&gt;750 lx)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-emerald-500 inline-block" />
              Batas Nyaman (150-500 lx)
            </span>
          </div>
          <div className="text-[11px] text-cyan-400 font-semibold font-mono">
            Puncak: {stats.peakValue} lx @ {stats.peakTime}
          </div>
        </div>

        {/* Chart Canvas Container */}
        <div className="relative w-full h-[320px] sm:h-[380px] md:h-[440px] bg-slate-950/50 rounded-lg p-2 border border-slate-800/80">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Chart Footer Meta */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500 mt-3 pt-2.5 border-t border-slate-800">
        <span>Frekuensi Sampling: 5 detik / record</span>
        <span className="text-cyan-400">Sinkron RTDB Aktif</span>
      </div>
    </div>
  );
};

