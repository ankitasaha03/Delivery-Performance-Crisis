"use client";

import React, { useState } from "react";
import {
  Sliders,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Truck,
  PackageCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";
import { formatNumber, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function RootCauseSimulatorView() {
  const { metrics, applyRecommendation, recommendations, resetAll } = useLogistics();

  // Local sandbox slider states
  const [reallocatedStaff, setReallocatedStaff] = useState<number>(18);
  const [earlyDispatchMinutes, setEarlyDispatchMinutes] = useState<number>(45);
  const [chicagoSpilloverActive, setChicagoSpilloverActive] = useState<boolean>(true);
  const [staggeredDockActive, setStaggeredDockActive] = useState<boolean>(true);

  // Compute simulated outcomes dynamically based on levers
  const delayReduction = Number(
    (
      (reallocatedStaff / 18) * 1.8 +
      (earlyDispatchMinutes / 45) * 1.1 +
      (chicagoSpilloverActive ? 0.9 : 0) +
      (staggeredDockActive ? 0.6 : 0)
    ).toFixed(1)
  );

  const simulatedDelay = Math.max(0.9, Number((metrics.avgDelayHours - delayReduction).toFixed(1)));
  const simulatedBottleneck = Math.max(22, Math.round(metrics.bottleneckIndex - (reallocatedStaff * 1.5 + (earlyDispatchMinutes / 45) * 12)));
  const simulatedComplaints = Math.max(1.8, Number((metrics.complaintRate * (simulatedDelay / metrics.avgDelayHours)).toFixed(1)));
  const simulatedCostSavings = Math.round(delayReduction * 11500);

  const handleApplyAllSimulations = () => {
    recommendations.forEach((r) => {
      if (!r.isApplied) {
        applyRecommendation(r.id);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Autonomous Root-Cause What-If Simulation Sandbox</h2>
              <p className="text-xs text-slate-400">
                Adjust operational levers across staffing, transit departures, and ghost inventory to model delay recovery
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleApplyAllSimulations}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Deploy All AI Recommendations</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Levers */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-6">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Adjust Operational Levers
            </h3>

            {/* Lever 1: Staff Reallocation */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  Cross-Hub Staff Reallocation to Newark Packing Line:
                </span>
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  +{reallocatedStaff} associates
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={reallocatedStaff}
                onChange={(e) => setReallocatedStaff(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 (No change)</span>
                <span>+12 (Moderate)</span>
                <span>+25 (Full capacity)</span>
              </div>
            </div>

            {/* Lever 2: Early Carrier Departure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Advance Last-Mile Dispatch Window (Beat Metro Gridlock):
                </span>
                <span className="font-mono text-amber-400 font-bold text-sm">
                  {earlyDispatchMinutes} mins earlier
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={earlyDispatchMinutes}
                onChange={(e) => setEarlyDispatchMinutes(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 mins (Depart 16:30)</span>
                <span>30 mins</span>
                <span>60 mins (Depart 15:30)</span>
              </div>
            </div>

            {/* Lever 3: Ghost Stock Auto-Spillover */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5 text-purple-400" />
                  Ghost Inventory Auto-Spillover to Chicago Hub
                </span>
                <p className="text-[11px] text-slate-400">
                  Redirect pick-aborted SKUs to Chicago Central Hub (1,840 verified units)
                </p>
              </div>
              <button
                onClick={() => setChicagoSpilloverActive((p) => !p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  chicagoSpilloverActive
                    ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                    : "bg-slate-800 text-slate-400"
                )}
              >
                {chicagoSpilloverActive ? "Active" : "Disabled"}
              </button>
            </div>

            {/* Lever 4: Staggered Dock Appointments */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  Staggered Dock Bay Scheduling (Atlanta & Dallas)
                </span>
                <p className="text-[11px] text-slate-400">
                  Stagger carrier arrivals by 45 mins to prevent staging yard paralysis
                </p>
              </div>
              <button
                onClick={() => setStaggeredDockActive((p) => !p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  staggeredDockActive
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-800 text-slate-400"
                )}
              >
                {staggeredDockActive ? "Active" : "Disabled"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Projected Outcome Scorecard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Simulated Outcome Prediction
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Confidence: 94%
              </span>
            </div>

            {/* Scorecard Metrics */}
            <div className="space-y-3 pt-2">
              {/* Metric 1 */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Avg Delivery Delay</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-lg font-bold font-mono text-white">
                      {simulatedDelay} hrs
                    </span>
                    <span className="text-xs line-through text-slate-500 font-mono">
                      {metrics.avgDelayHours.toFixed(1)} hrs
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold">
                  <TrendingDown className="w-4 h-4" />
                  -{delayReduction} hrs (-{Math.round((delayReduction / metrics.avgDelayHours) * 100)}%)
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Customer Complaint Rate</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {simulatedComplaints}%
                    </span>
                    <span className="text-xs line-through text-slate-500 font-mono">
                      {metrics.complaintRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-emerald-400 font-mono text-xs font-bold">
                  Within SLA Target
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Warehouse Bottleneck Index</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-lg font-bold font-mono text-white">
                      {simulatedBottleneck}/100
                    </span>
                    <span className="text-xs line-through text-slate-500 font-mono">
                      {metrics.bottleneckIndex}/100
                    </span>
                  </div>
                </div>
                <div className="text-emerald-400 font-mono text-xs font-bold">
                  Queue Resolved
                </div>
              </div>

              {/* Metric 4 */}
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-300">Projected Savings</span>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                    ${formatNumber(simulatedCostSavings)} / week
                  </div>
                </div>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <button
              onClick={handleApplyAllSimulations}
              className="w-full mt-2 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Commit Simulated Parameters to Live System</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
