"use client";

import React from "react";
import { Database } from "lucide-react";
import { FIREBASE_CONFIG } from "@/lib/firebase";

interface FooterProps {
  isConnected: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isConnected }) => {
  return (
    <footer
      className="border-t border-slate-800/80 bg-[#080d16] px-4 sm:px-6 py-4 mt-6 text-xs font-mono text-slate-500 w-full"
      data-purpose="system-footer"
    >
      <div className="w-full flex flex-wrap justify-between items-center gap-4 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-3">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
            }`}
          />
          <span className="text-slate-400">
            ESP32 Hardware Stream:{" "}
            <span
              className={
                isConnected
                  ? "text-emerald-400 font-semibold"
                  : "text-rose-400 font-semibold"
              }
            >
              {isConnected ? "TERHUBUNG" : "TERPUTUS"}
            </span>{" "}
            (WebSocket / RTDB SSE)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            Host: <code className="text-slate-300 font-mono">{FIREBASE_CONFIG.host}</code>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400">
            Path: <code className="text-amber-400 font-mono">/{FIREBASE_CONFIG.path}</code>
          </span>
        </div>
      </div>
    </footer>
  );
};

