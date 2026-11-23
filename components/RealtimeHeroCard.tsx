"use client";

import React, { useEffect, useState } from "react";
import { TelemetryRecord, TelemetryStats } from "@/lib/types";
import { getConditionInfo } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Moon, SunMedium } from "lucide-react";

interface RealtimeHeroCardProps {
  latestRecord?: TelemetryRecord;
  stats: TelemetryStats;
}

export const RealtimeHeroCard: React.FC<RealtimeHeroCardProps> = ({
  latestRecord,
  stats,
}) => {
  const [localClock, setLocalClock] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).replace(/\./g, ":");
      setLocalClock(`${timeStr} WIB`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const lux = latestRecord ? latestRecord.value : stats.currentLux;
  const condition = latestRecord?.condition || stats.currentCondition;
  const conditionInfo = getConditionInfo(condition, lux);

  // Icon depending on category
  const renderConditionIcon = () => {
    switch (conditionInfo.category) {
      case "glare":
        return <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />;
      case "ideal":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
      case "bright":
        return <SunMedium className="w-5 h-5 text-cyan-400 flex-shrink-0" />;
      case "dim":
      default:
        return <Moon className="w-5 h-5 text-blue-400 flex-shrink-0" />;
    }
  };

  // Percentage for spectrum marker (0 - 1200 lx range)
  const spectrumPercentage = Math.min(100, Math.max(0, (lux / 1200) * 100));

  return (
    <section
      className="w-full bg-[#0c1322] border-2 border-amber-500/40 rounded-xl p-4 md:p-5 shadow-2xl relative overflow-hidden transition-all duration-300"
      style={{
        boxShadow: "0 0 30px -5px rgba(245, 158, 11, 0.25)",
      }}
      data-purpose="realtime-status-banner"
    >
      {/* Ambient background glows */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 mb-4 gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <span className="flex h-3.5 w-3.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500" />
          </span>
          <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white uppercase font-sans">
            Data Realtime Lux dan Kondisi
          </h2>
          <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono uppercase tracking-wider">
            ESP32-WROOM Stream
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Firebase Node ID:</span>
            <span className="text-cyan-400 font-bold tracking-wider font-mono">
              {latestRecord?.id || stats.currentNodeKey}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
            <span className="text-slate-400">Update Terakhir:</span>
            <span className="text-emerald-400 font-semibold">
              {stats.lastUpdated ? `${stats.lastUpdated} WIB` : "Baru saja (Realtime)"}
            </span>
          </div>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative z-10">
        {/* Big Lux Display */}
        <div className="lg:col-span-4 bg-slate-900/60 p-4 rounded-lg border border-slate-800/80 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              <span>Intensitas Terdeteksi</span>
              <span className="text-amber-400 font-semibold">Satuan: Lux (lx)</span>
            </div>
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-6xl md:text-7xl font-extrabold tracking-tighter text-amber-400 font-mono drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                {lux.toLocaleString("id-ID")}
              </span>
              <span className="text-2xl text-slate-300 font-mono font-semibold">Lux</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pt-2 border-t border-slate-800/70">
            <span
              className={`font-semibold ${
                stats.changePercentage >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {stats.changePercentage >= 0 ? "↑ +" : "↓ "}
              {Math.abs(stats.changePercentage)}%
            </span>
            <span>
              dibanding rerata sesi saat ini ({stats.avgLux} lx)
            </span>
          </div>
        </div>

        {/* Status Condition Box */}
        <div className="lg:col-span-5 bg-slate-900/60 p-4 rounded-lg border border-slate-800/80 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Evaluasi Kondisi Ambien
            </div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-bold text-sm sm:text-base md:text-lg mb-2 ${conditionInfo.badgeClass}`}
            >
              {renderConditionIcon()}
              <span>{conditionInfo.label}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {conditionInfo.description}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap justify-between gap-1">
            <span>Standar Ruang Tamu: 150 - 250 lx</span>
            <span className={`${conditionInfo.textClass} font-bold`}>
              {conditionInfo.standardLabel}
            </span>
          </div>
        </div>

        {/* Lux Spectrum Gauge & Telemetry Metadata */}
        <div className="lg:col-span-3 bg-slate-900/60 p-4 rounded-lg border border-slate-800/80 flex flex-col justify-between backdrop-blur-sm">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Statistik Sesi Hari Ini
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/70 p-2.5 rounded border border-slate-800/70 flex-1 content-center">
            <div>
              <span className="text-slate-500 block text-[10px]">WAKTU LOKAL:</span>
              <span className="text-cyan-400 font-semibold">{localClock || "--:--:-- WIB"}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">AKURASI SENSOR:</span>
              <span className="text-slate-200 font-semibold">{stats.accuracy}</span>
            </div>
            <div className="pt-1">
              <span className="text-slate-500 block text-[10px]">MIN / MAKS:</span>
              <span className="text-slate-200">
                {stats.minLux} / {stats.maxLux.toLocaleString("id-ID")} lx
              </span>
            </div>
            <div className="pt-1">
              <span className="text-slate-500 block text-[10px]">RATA-RATA:</span>
              <span className="text-slate-200">{stats.avgLux} lx</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Lux Spectrum Meter Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 relative z-10">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
          <span>Spektrum Tingkat Pencahayaan (0 - 1.200 lx)</span>
          <span className="text-cyan-400">
            Posisi Sensor: <b className="text-white">{lux} lx</b> ({spectrumPercentage.toFixed(0)}%)
          </span>
        </div>

        {/* Multi-colored Spectrum Track */}
        <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
          <div style={{ width: "12.5%" }} className="h-full bg-blue-600/70" title="Redup (<150 lx)" />
          <div style={{ width: "12.5%" }} className="h-full bg-emerald-500" title="Standar SNI Ruang Tamu (150-300 lx)" />
          <div style={{ width: "16.6%" }} className="h-full bg-cyan-400" title="Terang Nyaman (300-500 lx)" />
          <div style={{ width: "20.8%" }} className="h-full bg-amber-400" title="Cukup Terang (500-750 lx)" />
          <div style={{ width: "37.6%" }} className="h-full bg-rose-500" title="Silau (>750 lx)" />
        </div>

        {/* Needle Marker */}
        <div className="relative w-full h-4 mt-1">
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
            style={{ left: `${spectrumPercentage}%` }}
          >
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-cyan-400" />
            <span className="text-[9px] font-mono font-bold text-cyan-300 tracking-tighter whitespace-nowrap">
              ▲ {lux} lx
            </span>
          </div>

          {/* Scale Labels */}
          <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-2">
            <span>0 lx</span>
            <span className="text-emerald-400">150 lx (SNI Min)</span>
            <span className="text-cyan-400">300 lx (SNI Maks)</span>
            <span className="text-amber-400">500 lx</span>
            <span className="text-rose-400">750 lx (Silau)</span>
            <span>1.200+ lx</span>
          </div>
        </div>
      </div>
    </section>
  );
};

