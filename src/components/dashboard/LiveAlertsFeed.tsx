"use client";

import React from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Sliders,
  Bot,
  ExternalLink,
  Check,
} from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";
import { cn } from "@/lib/utils";

export function LiveAlertsFeed() {
  const {
    alerts,
    resolveAlert,
    setIsChatSlideOverOpen,
    setActiveTab,
    setWarehouseFilter,
  } = useLogistics();

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          icon: AlertCircle,
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          dot: "bg-rose-400",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          dot: "bg-amber-400",
        };
      case "resolved":
        return {
          icon: CheckCircle2,
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          dot: "bg-emerald-400",
        };
      default:
        return {
          icon: Info,
          bg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
          dot: "bg-blue-400",
        };
    }
  };

  const handleEntityClick = (alert: any) => {
    if (alert.category === "warehouse") {
      setWarehouseFilter(alert.targetId);
      setActiveTab("warehouses");
    } else if (alert.category === "route") {
      setActiveTab("routes");
    } else if (alert.category === "inventory") {
      setActiveTab("inventory");
    } else {
      setActiveTab("simulation");
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </div>
          <h3 className="font-semibold text-sm text-white">Live Logistics Alert Feed</h3>
          <span className="text-[11px] text-slate-400">({alerts.length} events)</span>
        </div>

        <button
          onClick={() => setIsChatSlideOverOpen(true)}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask AI to triage</span>
        </button>
      </div>

      {/* Alert list */}
      <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
        {alerts.map((alert) => {
          const badge = getSeverityBadge(alert.severity);
          const Icon = badge.icon;
          return (
            <div
              key={alert.id}
              className={cn(
                "p-3 rounded-lg border transition-all text-xs flex flex-col justify-between gap-2",
                alert.resolved
                  ? "bg-slate-950/40 border-slate-800/60 opacity-60"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className={cn("p-1.5 rounded-md border mt-0.5", badge.bg)}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-200">{alert.title}</span>
                      <span
                        onClick={() => handleEntityClick(alert)}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 cursor-pointer border border-slate-700 transition-colors inline-flex items-center gap-1"
                      >
                        {alert.targetEntity}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                    <p className="text-slate-400 mt-1 leading-relaxed">{alert.description}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                  {alert.timestamp}
                </span>
              </div>

              {/* Action buttons */}
              {!alert.resolved && (
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-900">
                  <button
                    onClick={() => {
                      setActiveTab("simulation");
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-medium transition-colors"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Simulate Fix</span>
                  </button>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    <span>Acknowledge</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
