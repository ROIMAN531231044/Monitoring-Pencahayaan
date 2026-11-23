"use client";

import React, { useEffect, useState } from "react";
import { Activity, Wifi, Radio, Cpu, RefreshCw } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onRefresh: () => void;
  nodeId?: string;
  sensorModel?: string;
  roomName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  isStreaming,
  onToggleStreaming,
  onRefresh,
  nodeId = "NODE_01",
  sensorModel = "BH1750 (I2C)",
  roomName = "Sensoring Ruang Tamu",
}) => {
  const [ping, setPing] = useState<number>(38);

  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 15) + 32);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-[#0c1322]/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-3 w-full shadow-lg">
      <div className="w-full flex flex-wrap items-center justify-between gap-4 max-w-[1920px] mx-auto">
        {/* Brand & Hardware Identifier */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-bold text-base sm:text-lg text-white tracking-wide font-sans">
                LUXMONITOR // ESP32
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                {nodeId}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1 ${
                  isConnected
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                  }`}
                />
                {isConnected ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {roomName} • RTDB Realtime Node
            </p>
          </div>
        </div>

        {/* Realtime Telemetry Status Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono">
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
            <Radio className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Ping:</span>
            <span className="text-cyan-400 font-bold">{ping} ms</span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Sensor:</span>
            <span className="text-amber-400 font-semibold">{sensorModel}</span>
          </div>

          <button
            onClick={onRefresh}
            title="Muat ulang data telemetri"
            className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md border border-slate-800 transition-all font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onToggleStreaming}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all font-semibold cursor-pointer ${
              isStreaming
                ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isStreaming ? "bg-cyan-400 animate-pulse" : "bg-slate-500"
              }`}
            />
            <span>{isStreaming ? "LIVE SYNC: AKTIF" : "LIVE SYNC: DIJEDA"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

