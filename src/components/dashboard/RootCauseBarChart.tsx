"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { mockRootCauses } from "@/data/mockLogisticsData";
import { Info, Sparkles, Sliders } from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";

export function RootCauseBarChart() {
  const { setActiveTab, setIsChatSlideOverOpen } = useLogistics();
  const [selectedCause, setSelectedCause] = useState<string | null>(null);

  const handleBarClick = (data: any) => {
    if (data && data.name) {
      setSelectedCause(data.name);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-white">Delay Root-Cause Attribution</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              AI Diagnostic
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Contribution to total delivery delays despite adequate physical vehicle fleet
          </p>
        </div>

        <button
          onClick={() => setActiveTab("simulation")}
          className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Simulate Fixes</span>
        </button>
      </div>

      {/* Root cause bar chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockRootCauses}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              unit="%"
              stroke="#64748b"
              fontSize={11}
              domain={[0, 40]}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={10}
              width={160}
              tickLine={false}
              tickFormatter={(val) => (val.length > 24 ? `${val.substring(0, 22)}...` : val)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 shadow-xl text-xs">
                      <p className="font-semibold text-white mb-1">{data.name}</p>
                      <div className="space-y-1 text-slate-300">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Delay Share:</span>
                          <span className="font-bold text-rose-400">{data.value}% of delays</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Delay Addition:</span>
                          <span className="font-mono text-amber-400">+{data.delayContributionHours} hrs / order</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-cyan-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Click bar for AI deep dive
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} onClick={handleBarClick}>
              {mockRootCauses.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom diagnostic insight */}
      <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            Primary takeaway: <strong>60% of total delay time</strong> originates inside warehouse packing queues & shift mismatches, not driver shortage.
          </span>
        </div>
      </div>
    </div>
  );
}
