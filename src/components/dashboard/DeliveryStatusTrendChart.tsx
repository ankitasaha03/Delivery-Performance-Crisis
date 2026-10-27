"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Clock, ShieldAlert, Sparkles, Filter } from "lucide-react";
import { mockHourlyTrend } from "@/data/mockLogisticsData";
import { useLogistics } from "@/context/LogisticsContext";

export function DeliveryStatusTrendChart() {
  const [timeframe, setTimeframe] = useState<"24h" | "peak" | "7d">("24h");
  const { totalImprovements } = useLogistics();

  // Adjust data dynamically if AI recommendations are applied
  const chartData = mockHourlyTrend.map((item) => {
    if (totalImprovements.delaySavedHours > 0) {
      const shiftSaved = Math.min(item.delayed, Math.round(item.delayed * 0.55));
      return {
        ...item,
        delayed: item.delayed - shiftSaved,
        atRisk: Math.max(20, Math.round(item.atRisk * 0.6)),
        onTime: item.onTime + shiftSaved,
        complaints: Math.max(2, Math.round(item.complaints * 0.4)),
      };
    }
    return item;
  });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-white">Delivery Volume & Delay Trends</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Live Flow
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hourly distribution of On-Time, At-Risk, and Delayed shipments
          </p>
        </div>

        {/* Timeframe Controls */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setTimeframe("24h")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              timeframe === "24h" ? "bg-slate-800 text-cyan-400 shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Today (24h)
          </button>
          <button
            onClick={() => setTimeframe("peak")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              timeframe === "peak" ? "bg-slate-800 text-cyan-400 shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Peak Surge (14-20h)
          </button>
          <button
            onClick={() => setTimeframe("7d")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              timeframe === "7d" ? "bg-slate-800 text-cyan-400 shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            7-Day History
          </button>
        </div>
      </div>

      {/* Surging indicator callout if delay is unmitigated */}
      {totalImprovements.delaySavedHours === 0 ? (
        <div className="mb-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-300">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span>
              <strong>Surge Bottleneck:</strong> Delayed orders peak at 18:00 (740 orders) due to packing station deficit at Newark DC.
            </span>
          </div>
          <span className="text-[11px] font-mono text-rose-400">Delay Spike: +3.2h</span>
        </div>
      ) : (
        <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>AI Shift Smoothing Active:</strong> Peak delayed orders curtailed by 55% via cross-hub flex staffing.
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">SLA Recovery: 94.2%</span>
        </div>
      )}

      {/* Recharts Area Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="onTimeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="atRiskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="delayedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#090d16",
                borderColor: "#334155",
                borderRadius: "0.5rem",
                color: "#f8fafc",
                fontSize: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
            />

            <Area
              type="monotone"
              dataKey="onTime"
              name="On-Time Orders"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#onTimeGrad)"
            />
            <Area
              type="monotone"
              dataKey="atRisk"
              name="At-Risk (Tight SLA)"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#atRiskGrad)"
            />
            <Area
              type="monotone"
              dataKey="delayed"
              name="Delayed Orders"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#delayedGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
