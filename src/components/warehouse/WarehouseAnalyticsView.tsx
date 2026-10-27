"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  TrendingDown,
  ArrowRight,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";
import { cn } from "@/lib/utils";

export function WarehouseAnalyticsView() {
  const {
    warehouses,
    selectedWarehouseFilter,
    setWarehouseFilter,
    adjustStaffing,
    applyRecommendation,
    recommendations,
  } = useLogistics();

  const [staffSlider, setStaffSlider] = useState<{ [whId: string]: number }>({
    "wh-newark": 0,
    "wh-atlanta": 0,
  });

  const isStaffRecApplied = recommendations.find((r) => r.id === "rec-1")?.isApplied;

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="p-5 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Fulfillment Hubs & Floor Staff Telematics</h2>
              <p className="text-xs text-slate-400">
                Granular inspection of packing line throughput, pick-to-pack latency, and shift imbalances
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isStaffRecApplied ? (
            <button
              onClick={() => applyRecommendation("rec-1")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Auto-Rebalance Shift Staff (-2.1h Delay)</span>
            </button>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Shift Staffing Optimized via AI</span>
            </span>
          )}
        </div>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {warehouses.map((wh) => {
          const isSelected = selectedWarehouseFilter === wh.id;
          const staffDelta = staffSlider[wh.id] || 0;
          const displayStaff = wh.activeStaff + staffDelta;
          const staffRatio = Math.round((displayStaff / wh.requiredStaff) * 100);

          return (
            <div
              key={wh.id}
              className={cn(
                "rounded-xl border p-5 backdrop-blur-md transition-all flex flex-col justify-between gap-4",
                isSelected
                  ? "bg-slate-900/90 border-cyan-500/60 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              )}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                        {wh.code}
                      </span>
                      <h3 className="font-bold text-white text-sm">{wh.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{wh.city}, {wh.state}</p>
                  </div>

                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                      wh.status === "critical"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        : wh.status === "moderate"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    )}
                  >
                    {wh.status}
                  </span>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Throughput</span>
                    <span className="text-sm font-bold font-mono text-cyan-400">{wh.throughputPerHour}</span>
                    <span className="text-[10px] text-slate-500 block">units/hr</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Avg Pack Time</span>
                    <span
                      className={cn(
                        "text-sm font-bold font-mono",
                        wh.avgPackingMinutes > 30 ? "text-rose-400" : "text-emerald-400"
                      )}
                    >
                      {wh.avgPackingMinutes}m
                    </span>
                    <span className="text-[10px] text-slate-500 block">target: {wh.targetPackingMinutes}m</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Bottleneck</span>
                    <span
                      className={cn(
                        "text-sm font-bold font-mono",
                        wh.bottleneckScore > 75
                          ? "text-rose-400"
                          : wh.bottleneckScore > 50
                          ? "text-amber-400"
                          : "text-emerald-400"
                      )}
                    >
                      {wh.bottleneckScore}
                    </span>
                    <span className="text-[10px] text-slate-500 block">/100 score</span>
                  </div>
                </div>

                {/* Staffing Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Packing Station Staff:
                    </span>
                    <span className="font-mono font-semibold text-slate-200">
                      {displayStaff} / {wh.requiredStaff} ({staffRatio}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        staffRatio < 70
                          ? "bg-rose-500"
                          : staffRatio < 90
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(100, staffRatio)}%` }}
                    />
                  </div>
                </div>

                {/* Primary Bottleneck Diagnostic Note */}
                <div className="mt-3.5 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                    Telemetry Root-Cause:
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{wh.primaryBottleneck}</p>
                </div>
              </div>

              {/* Bottom Interactive Staff Adjuster */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setWarehouseFilter(isSelected ? null : wh.id)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {isSelected ? "Clear Highlight" : "Filter Overview to Hub"}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustStaffing(wh.id, -2)}
                    disabled={wh.activeStaff <= 10}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-mono"
                    title="Remove 2 staff"
                  >
                    -2
                  </button>
                  <span className="text-[11px] font-mono text-slate-400 px-1">Staff</span>
                  <button
                    onClick={() => adjustStaffing(wh.id, +2)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono"
                    title="Add 2 staff"
                  >
                    +2
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
