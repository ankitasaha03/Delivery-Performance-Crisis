"use client";

import React from "react";
import {
  PackageSearch,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Zap,
  ArrowRight,
  TrendingDown,
  Layers,
} from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";
import { cn } from "@/lib/utils";

export function InventoryDiagnosticsView() {
  const { inventory, applyRecommendation, recommendations, revertRecommendation } = useLogistics();

  const isInventoryRecApplied = recommendations.find((r) => r.id === "rec-3")?.isApplied;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <PackageSearch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Ghost Inventory & Pick Failure Intelligence</h2>
              <p className="text-xs text-slate-400">
                Detecting phantom ERP quantities and bin location sync errors causing fulfillment halts
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isInventoryRecApplied ? (
            <button
              onClick={() => applyRecommendation("rec-3")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Auto-Quarantine Ghost Stock & Re-route to Chicago Hub</span>
            </button>
          ) : (
            <button
              onClick={() => revertRecommendation("rec-3")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Ghost Stock Quarantined & Re-routed (Click to Revert)</span>
            </button>
          )}
        </div>
      </div>

      {/* Diagnostic Explanation Banner */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-200">
            What is "Ghost Inventory" and why does it delay orders?
          </p>
          <p className="text-amber-300/80 leading-relaxed">
            When your ERP registers units in stock that are physically missing or damaged in aisle bins, pickers encounter an empty location. Pickers must abort the wave, summon a floor supervisor, and initiate a manual recount. This adds an average <strong>3.8 to 5.2 hours of latency</strong> to customer orders before they even reach the packing line!
          </p>
        </div>
      </div>

      {/* SKUs Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">SKU & Item Name</th>
                <th className="py-3 px-4">Fulfillment Hub</th>
                <th className="py-3 px-4">ERP vs Allocated</th>
                <th className="py-3 px-4">Ghost Risk</th>
                <th className="py-3 px-4">Pick Failure Rate</th>
                <th className="py-3 px-4">Fulfillment Delay Added</th>
                <th className="py-3 px-4">Prescriptive Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {inventory.map((item) => {
                const isHighRisk = item.ghostInventoryRisk > 30;
                return (
                  <tr key={item.sku} className="hover:bg-slate-800/30 transition-colors">
                    {/* SKU & Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-cyan-400">{item.sku}</div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.category}</div>
                    </td>

                    {/* Warehouse */}
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {item.warehouseCode}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-200">
                        {item.inStock} in stock
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.allocated} allocated
                      </div>
                    </td>

                    {/* Ghost Risk */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold border",
                          isHighRisk
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        )}
                      >
                        {item.ghostInventoryRisk}% risk
                      </span>
                    </td>

                    {/* Pick Failure */}
                    <td className="py-3.5 px-4">
                      <div
                        className={cn(
                          "font-mono font-bold",
                          item.pickFailureRate > 10 ? "text-rose-400" : "text-emerald-400"
                        )}
                      >
                        {item.pickFailureRate}% abort rate
                      </div>
                    </td>

                    {/* Delay */}
                    <td className="py-3.5 px-4">
                      <div
                        className={cn(
                          "font-mono font-semibold",
                          item.avgFulfillmentDelayHours > 3.0 ? "text-rose-400" : "text-slate-300"
                        )}
                      >
                        +{item.avgFulfillmentDelayHours.toFixed(1)} hrs
                      </div>
                    </td>

                    {/* Recommendation */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {item.recommendation}
                      </p>
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
