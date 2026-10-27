"use client";

import React, { useState } from "react";
import {
  Navigation,
  CloudRain,
  Sun,
  CloudFog,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
  TrendingDown,
  RotateCcw,
} from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";
import { formatHours } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function RouteOptimizerView() {
  const { routes, applyRecommendation, recommendations, revertRecommendation } = useLogistics();
  const [carrierFilter, setCarrierFilter] = useState<string>("All");

  const isRouteRecApplied = recommendations.find((r) => r.id === "rec-2")?.isApplied;

  const filteredRoutes = routes.filter((r) => {
    if (carrierFilter === "All") return true;
    return r.carrier === carrierFilter;
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Rain Storm":
        return <CloudRain className="w-3.5 h-3.5 text-blue-400" />;
      case "Fog":
        return <CloudFog className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Last-Mile Telematics & Dynamic Route Optimizer</h2>
              <p className="text-xs text-slate-400">
                Continuous carrier SLA monitoring, tunnel/highway congestion scoring, and adaptive routing
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isRouteRecApplied ? (
            <button
              onClick={() => applyRecommendation("rec-2")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Simulate Early Batch Reroute (-45 min delay)</span>
            </button>
          ) : (
            <button
              onClick={() => revertRecommendation("rec-2")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Route Optimization Deployed (Click to Revert)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Filter by Carrier:</span>
          {["All", "Internal Fleet", "FedEx", "UPS", "DHL", "OnTrac"].map((carrier) => (
            <button
              key={carrier}
              onClick={() => setCarrierFilter(carrier)}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors",
                carrierFilter === carrier
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              )}
            >
              {carrier}
            </button>
          ))}
        </div>

        <div className="text-slate-400">
          Showing <strong>{filteredRoutes.length}</strong> active transit corridors
        </div>
      </div>

      {/* Routes Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Route ID / Corridor</th>
                <th className="py-3 px-4">Origin Hub</th>
                <th className="py-3 px-4">Carrier</th>
                <th className="py-3 px-4">Transit Latency</th>
                <th className="py-3 px-4">Traffic / Weather</th>
                <th className="py-3 px-4">SLA Compliance</th>
                <th className="py-3 px-4">Primary Bottleneck Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRoutes.map((route) => {
                const isDelayed = route.delayHours > 1.0;
                return (
                  <tr key={route.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Route ID */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{route.code}</div>
                      <div className="text-[11px] text-slate-400">{route.destinationZone}</div>
                    </td>

                    {/* Origin */}
                    <td className="py-3.5 px-4 text-slate-300">
                      {route.originHub}
                    </td>

                    {/* Carrier */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">
                        <Truck className="w-3 h-3 text-cyan-400" />
                        {route.carrier}
                      </span>
                    </td>

                    {/* Transit Latency */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("font-mono font-bold", isDelayed ? "text-rose-400" : "text-emerald-400")}>
                          {route.avgTransitHours.toFixed(1)} hrs
                        </span>
                        <span className="text-[10px] text-slate-500">
                          (Sched: {route.scheduledTransitHours.toFixed(1)}h)
                        </span>
                      </div>
                      {isDelayed && (
                        <div className="text-[10px] text-rose-400 font-mono">
                          +{route.delayHours.toFixed(1)}h variance
                        </div>
                      )}
                    </td>

                    {/* Weather & Traffic */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-slate-300">
                          {getWeatherIcon(route.weatherCondition)}
                          {route.weatherCondition}
                        </span>
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-mono",
                            route.trafficAnomalyScore > 70
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-slate-800 text-slate-400"
                          )}
                        >
                          Traffic: {route.trafficAnomalyScore}/100
                        </span>
                      </div>
                    </td>

                    {/* SLA Compliance */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              route.slaCompliancePercent < 70
                                ? "bg-rose-500"
                                : route.slaCompliancePercent < 85
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            )}
                            style={{ width: `${route.slaCompliancePercent}%` }}
                          />
                        </div>
                        <span
                          className={cn(
                            "font-mono font-semibold",
                            route.slaCompliancePercent < 70
                              ? "text-rose-400"
                              : route.slaCompliancePercent < 85
                              ? "text-amber-400"
                              : "text-emerald-400"
                          )}
                        >
                          {route.slaCompliancePercent.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* Bottleneck factor */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                        {route.bottleneckFactor}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
