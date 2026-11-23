"use client";

import React, { useMemo, useState } from "react";
import { TelemetryRecord } from "@/lib/types";
import { exportToCsv, formatWibDate, formatWibTime, getConditionInfo } from "@/lib/utils";
import { Search, Download, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface TableHistoryCardProps {
  records: TelemetryRecord[];
  latestRecordId?: string;
}

export const TableHistoryCard: React.FC<TableHistoryCardProps> = ({
  records,
  latestRecordId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [quickRange, setQuickRange] = useState<"all" | "today" | "24h" | "7d">("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logic
  const filteredRecords = useMemo(() => {
    let result = [...records];

    const now = Date.now();
    const todayStr = new Date().toISOString().split("T")[0];

    // Quick range filter
    if (quickRange === "today") {
      result = result.filter((r) => {
        const itemDate = r.formattedDate || formatWibDate(r.timestamp);
        return itemDate === todayStr || Math.abs(now - r.timestamp) < 24 * 60 * 60 * 1000;
      });
    } else if (quickRange === "24h") {
      const past24 = now - 24 * 60 * 60 * 1000;
      result = result.filter((r) => r.timestamp >= past24);
    } else if (quickRange === "7d") {
      const past7d = now - 7 * 24 * 60 * 60 * 1000;
      result = result.filter((r) => r.timestamp >= past7d);
    }

    // Custom date range filter
    if (startDate) {
      const startMs = new Date(startDate).getTime();
      result = result.filter((r) => r.timestamp >= startMs);
    }
    if (endDate) {
      const endMs = new Date(endDate).getTime() + 24 * 60 * 60 * 1000;
      result = result.filter((r) => r.timestamp <= endMs);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((r) => {
        const timeMatch = (r.formattedTime || formatWibTime(r.timestamp)).toLowerCase().includes(q);
        const idMatch = r.id.toLowerCase().includes(q);
        const condMatch = r.condition.toLowerCase().includes(q);
        const luxMatch = r.value.toString().includes(q);
        return timeMatch || idMatch || condMatch || luxMatch;
      });
    }

    return result;
  }, [records, quickRange, startDate, endDate, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div
      className="xl:col-span-6 bg-[#0c1322] border-2 border-slate-700 hover:border-cyan-500/50 transition-colors rounded-xl p-4 md:p-5 flex flex-col justify-between shadow-xl"
      style={{
        boxShadow: "0 0 20px -5px rgba(6, 182, 212, 0.25)",
      }}
      data-purpose="table-history-card"
    >
      <div>
        {/* Search & Export Controls */}
        <div className="mb-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari Node Key, Kondisi, atau Nilai Lux..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <button
              type="button"
              onClick={() => exportToCsv(filteredRecords)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 hover:text-white transition flex-shrink-0 cursor-pointer shadow-sm"
              title="Unduh seluruh data hasil filter sebagai file CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">Ekspor CSV</span>
            </button>
          </div>

          {/* Range Selection Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Rentang:
              </span>
              {(
                [
                  { key: "today", label: "Hari Ini" },
                  { key: "24h", label: "24 Jam" },
                  { key: "7d", label: "7 Hari" },
                  { key: "all", label: "Semua" },
                ] as const
              ).map((pill) => {
                const active = quickRange === pill.key;
                return (
                  <button
                    key={pill.key}
                    type="button"
                    onClick={() => {
                      setQuickRange(pill.key);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] transition whitespace-nowrap cursor-pointer ${
                      active
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-300 focus-within:border-cyan-500/50">
                <span className="text-slate-500 text-[10px]">DARI:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-slate-200 border-0 p-0 text-[11px] font-mono focus:ring-0 cursor-pointer"
                />
              </div>
              <span className="text-slate-600">—</span>
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-300 focus-within:border-cyan-500/50">
                <span className="text-slate-500 text-[10px]">SAMPAI:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-slate-200 border-0 p-0 text-[11px] font-mono focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Telemetry Table */}
        <div
          className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60 max-h-[380px] md:max-h-[440px] overflow-y-auto"
          data-purpose="history-table-container"
        >
          <table className="w-full text-left text-xs font-mono" id="telemetryDataTable">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-800 z-10">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap" scope="col">
                  WAKTU (WIB)
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap" scope="col">
                  FIREBASE KEY / NODE
                </th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap" scope="col">
                  NILAI LUX
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap" scope="col">
                  KONDISI / STATUS AMBIEN
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 font-mono">
                    Tidak ada catatan telemetri yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record, idx) => {
                  const isLatest =
                    record.id === latestRecordId || (currentPage === 1 && idx === 0);
                  const condInfo = getConditionInfo(record.condition, record.value);

                  return (
                    <tr
                      key={record.id}
                      className={`transition-colors hover:border-l-2 hover:border-cyan-400 ${
                        isLatest
                          ? "bg-amber-500/10 hover:bg-amber-500/20"
                          : "hover:bg-slate-900/70"
                      }`}
                    >
                      <td className="py-2.5 px-3 whitespace-nowrap font-medium">
                        <div className="flex items-center gap-1.5">
                          {isLatest ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
                              <span className="text-amber-300 font-bold">
                                {record.formattedTime || formatWibTime(record.timestamp)}
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-400">
                              {record.formattedTime || formatWibTime(record.timestamp)}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-semibold text-cyan-400 whitespace-nowrap font-mono">
                        {record.id}
                      </td>

                      <td className="py-2.5 px-3 text-right font-bold whitespace-nowrap">
                        <span
                          className={
                            condInfo.category === "glare"
                              ? "text-amber-300 font-bold"
                              : condInfo.category === "ideal"
                              ? "text-emerald-400 font-semibold"
                              : condInfo.category === "bright"
                              ? "text-cyan-300 font-semibold"
                              : "text-blue-400 font-semibold"
                          }
                        >
                          {record.value.toLocaleString("id-ID")} lx
                        </span>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${condInfo.badgeClass}`}
                        >
                          {condInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 mt-3 pt-2.5 border-t border-slate-800 gap-2">
        <span>
          Menampilkan {filteredRecords.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
          {Math.min(currentPage * itemsPerPage, filteredRecords.length)} dari{" "}
          {filteredRecords.length} catatan telemetri
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((page, idx, arr) => {
              const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
              return (
                <React.Fragment key={page}>
                  {showEllipsis && <span className="px-1 text-slate-600">...</span>}
                  <button
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                      currentPage === page
                        ? "bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-bold"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

