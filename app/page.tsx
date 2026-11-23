"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { RealtimeHeroCard } from "@/components/RealtimeHeroCard";
import { ChartHistoryCard } from "@/components/ChartHistoryCard";
import { TableHistoryCard } from "@/components/TableHistoryCard";
import { Footer } from "@/components/Footer";
import { TelemetryRecord } from "@/lib/types";
import {
  fetchTelemetryData,
  SEED_TELEMETRY_DATA,
  subscribeToFirebaseSSE,
} from "@/lib/firebase";
import { calculateTelemetryStats } from "@/lib/utils";

export default function DashboardPage() {
  const [records, setRecords] = useState<TelemetryRecord[]>(SEED_TELEMETRY_DATA);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Realtime Live Stream Subscription
  useEffect(() => {
    if (!isStreaming) return;

    const unsubscribe = subscribeToFirebaseSSE(
      (newRecords, connected) => {
        if (newRecords && newRecords.length > 0) {
          setRecords(newRecords);
        }
        setIsConnected(connected);
      },
      (error) => {
        console.warn("Firebase SSE status update:", error);
        setIsConnected(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isStreaming]);

  // Initial manual fetch to guarantee freshest data right on page mount
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await fetchTelemetryData();
      if (freshData && freshData.length > 0) {
        setRecords(freshData);
      }
      setIsConnected(true);
    } catch (err) {
      console.error("Manual refresh error:", err);
      setIsConnected(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    handleManualRefresh();
  }, []);

  // Compute live analytical statistics
  const stats = useMemo(() => {
    return calculateTelemetryStats(records);
  }, [records]);

  const latestRecord = records.length > 0 ? records[0] : undefined;

  return (
    <div className="flex flex-col min-h-screen text-slate-200">
      {/* Top Application Header */}
      <Header
        isConnected={isConnected}
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming((prev) => !prev)}
        onRefresh={handleManualRefresh}
        nodeId={process.env.NEXT_PUBLIC_NODE_ID || "NODE_01"}
        sensorModel={process.env.NEXT_PUBLIC_SENSOR_MODEL || "BH1750 (I2C)"}
        roomName={process.env.NEXT_PUBLIC_ROOM_NAME || "Sensoring Ruang Tamu"}
      />

      {/* Main Telemetry Control Room Canvas */}
      <main className="flex-1 w-full px-3 sm:px-4 py-4 flex flex-col gap-4 min-h-0 max-w-[1920px] mx-auto">
        {/* Full-Width Realtime Hero Banner Card */}
        <RealtimeHeroCard latestRecord={latestRecord} stats={stats} />

        {/* 2-Column Split: Chart History & Data Table */}
        <section
          className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1 items-stretch"
          data-purpose="history-analytics-section"
        >
          {/* Chart History (Left 6 Columns on XL) */}
          <ChartHistoryCard records={records} stats={stats} />

          {/* Table History (Right 6 Columns on XL) */}
          <TableHistoryCard
            records={records}
            latestRecordId={latestRecord?.id}
          />
        </section>
      </main>

      {/* System Status Footer */}
      <Footer isConnected={isConnected} />
    </div>
  );
}

