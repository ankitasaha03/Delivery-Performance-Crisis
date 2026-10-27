"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  AlertTriangle,
  Building,
  CheckCircle2,
  X,
  TrendingDown,
} from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";
import { formatHours, formatNumber } from "@/lib/utils";

export function Header() {
  const {
    activeTab,
    selectedWarehouseFilter,
    setWarehouseFilter,
    warehouses,
    recommendations,
    setIsChatSlideOverOpen,
    triggerSimulatedSurge,
    totalImprovements,
  } = useLogistics();

  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedWh = warehouses.find((w) => w.id === selectedWarehouseFilter);

  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Delivery Performance & Logistics Command Center";
      case "warehouses":
        return "Fulfillment Centers & Bottleneck Diagnostics";
      case "routes":
        return "Last-Mile Routes & Carrier SLA Optimizer";
      case "inventory":
        return "Inventory Stockout & Ghost Stock Intelligence";
      case "simulation":
        return "Root-Cause What-If Simulation Sandbox";
      case "chat":
        return "Autonomous AI Supply Chain Analyst";
      default:
        return "Logistics Intelligence";
    }
  };

  const appliedCount = recommendations.filter((r) => r.isApplied).length;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Filter breadcrumb */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            {getTabTitle()}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Logistics OS v4.2</span>
            <span>•</span>
            <span className="font-mono text-slate-400">{currentTime || "Live Telemetry"}</span>
            {selectedWh && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px]">
                  <Building className="w-3 h-3" />
                  {selectedWh.name}
                  <button
                    onClick={() => setWarehouseFilter(null)}
                    className="hover:text-white ml-0.5"
                    title="Clear filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Controls & AI Status */}
      <div className="flex items-center gap-3">
        {/* Applied Optimizations Metric Pill */}
        {appliedCount > 0 && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{appliedCount} AI Fix{appliedCount > 1 ? "es" : ""} Active</span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1 font-mono text-emerald-300">
              <TrendingDown className="w-3 h-3" />
              -{formatHours(totalImprovements.delaySavedHours)} delay (${formatNumber(totalImprovements.costSaved)}/wk)
            </span>
          </div>
        )}

        {/* Trigger Surge Test Button */}
        <button
          onClick={triggerSimulatedSurge}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium transition-all hover:shadow-sm hover:shadow-amber-500/10"
          title="Simulate sudden traffic / weather incident to observe live dashboard adaptation"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Simulate Surge Event</span>
        </button>

        {/* AI Analyst Trigger Button */}
        <button
          onClick={() => setIsChatSlideOverOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI Analyst</span>
          <Sparkles className="w-3 h-3 text-slate-950/70" />
        </button>
      </div>
    </header>
  );
}
