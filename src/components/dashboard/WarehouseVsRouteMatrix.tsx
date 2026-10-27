"use client";

import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { mockWarehouseEfficiency } from "@/data/mockLogisticsData";
import { Building2, ArrowUpRight } from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";

export function WarehouseVsRouteMatrix() {
  const { setWarehouseFilter, setActiveTab, warehouses } = useLogistics();

  // Combine live warehouse states
  const chartData = warehouses.map((wh) => ({
    name: wh.city,
    id: wh.id,
    throughput: wh.throughputPerHour,
    avgPackingMinutes: wh.avgPackingMinutes,
    bottleneckScore: wh.bottleneckScore,
    status: wh.status,
  }));

  const handleBarClick = (entry: any) => {
    if (entry && entry.id) {
      setWarehouseFilter(entry.id);
      setActiveTab("warehouses");
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-white">Hub Throughput vs. Packing Delay Matrix</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Comparative
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Output velocity (Units/hr) against Packing Station wait latency (Mins)
          </p>
        </div>

        <button
          onClick={() => setActiveTab("warehouses")}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>View All Hubs</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Composed Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 0, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis
              yAxisId="left"
              stroke="#38bdf8"
              fontSize={11}
              tickLine={false}
              unit=" u/h"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#f43f5e"
              fontSize={11}
              tickLine={false}
              unit="m"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 shadow-xl text-xs space-y-1.5">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                        {data.name} Center
                      </p>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Throughput:</span>
                        <span className="font-mono text-cyan-400 font-semibold">{data.throughput} units/hr</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Avg Pack Time:</span>
                        <span className={`font-mono font-semibold ${data.avgPackingMinutes > 30 ? "text-rose-400" : "text-emerald-400"}`}>
                          {data.avgPackingMinutes} mins (Target: 18m)
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Bottleneck Index:</span>
                        <span className="font-mono text-amber-400 font-semibold">{data.bottleneckScore}/100</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800 text-[10px] text-cyan-300">
                        Click to inspect {data.name} analytics
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
            />
            <Bar
              yAxisId="left"
              dataKey="throughput"
              name="Throughput (Units/Hour)"
              fill="#0284c7"
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              className="cursor-pointer"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgPackingMinutes"
              name="Avg Packing Time (Mins)"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={{ fill: "#f43f5e", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span>
          <strong>Target benchmark:</strong> 18 min pack time. Red line shows severe latency in Newark (42m) and Atlanta (38m).
        </span>
      </div>
    </div>
  );
}
