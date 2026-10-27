"use client";

import React from "react";
import {
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  CheckCircle,
  Undo2,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";
import { formatNumber, formatHours } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function RecommendationsPanel() {
  const { recommendations, applyRecommendation, revertRecommendation, totalImprovements } =
    useLogistics();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">AI Prescriptive Recommendations</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Root-cause mitigation actions synthesized by Autonomous Logistics Engine
          </p>
        </div>

        {totalImprovements.costSaved > 0 && (
          <div className="flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Est. Saved: ${formatNumber(totalImprovements.costSaved)}/wk</span>
          </div>
        )}
      </div>

      {/* Cards list */}
      <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
        {recommendations.map((rec) => {
          return (
            <div
              key={rec.id}
              className={cn(
                "p-4 rounded-xl border transition-all text-xs flex flex-col justify-between gap-3",
                rec.isApplied
                  ? "bg-emerald-950/20 border-emerald-500/40 shadow-sm shadow-emerald-500/5"
                  : "bg-slate-950/70 border-slate-800/90 hover:border-slate-700"
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{rec.title}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {rec.category}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "text-[11px] font-semibold px-2.5 py-1 rounded-full border",
                      rec.isApplied
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-slate-800 text-cyan-400 border-cyan-500/30 font-mono"
                    )}
                  >
                    {rec.impactBadge}
                  </span>
                </div>

                <p className="text-slate-300 mt-2 leading-relaxed">{rec.summary}</p>

                {/* Target root cause tag */}
                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    Deploy Time: <strong className="text-slate-300">{rec.timeToDeploy}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Confidence: <strong className="text-cyan-400">{rec.confidenceScore}%</strong>
                  </span>
                  <span>•</span>
                  <span className="truncate">
                    Root Cause: <strong className="text-slate-300">{rec.rootCauseTarget}</strong>
                  </span>
                </div>
              </div>

              {/* Steps and Action CTA */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-mono">
                    <TrendingDown className="w-3 h-3" />
                    -{formatHours(rec.simulationDelta.delayReductionHours)} delay
                  </span>
                  <span className="font-mono text-purple-400">
                    -${formatNumber(rec.simulationDelta.estimatedCostSavings)}/wk
                  </span>
                </div>

                <div>
                  {rec.isApplied ? (
                    <button
                      onClick={() => revertRecommendation(rec.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Revert Sim</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => applyRecommendation(rec.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate Fix</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
