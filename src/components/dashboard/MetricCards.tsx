"use client";

import React from "react";
import {
  Package,
  Clock,
  MessageSquareWarning,
  Flame,
  Truck,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";
import { formatNumber, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function MetricCards() {
  const { metrics, recommendations } = useLogistics();
  const appliedCount = recommendations.filter((r) => r.isApplied).length;

  const cards = [
    {
      id: "orders",
      title: "Active Orders in Transit",
      value: formatNumber(metrics.totalOrders),
      unit: "shipments",
      change: "+12.4% vs last week",
      trend: "up",
      icon: Package,
      statusColor: "text-blue-400",
      accentBg: "from-blue-500/10 to-transparent",
      borderColor: "border-blue-500/20",
      note: "Adequate physical fleet pipeline",
    },
    {
      id: "delay",
      title: "Avg Delivery Delay",
      value: `${metrics.avgDelayHours.toFixed(1)} hrs`,
      unit: "SLA limit: 1.5 hrs",
      change: metrics.avgDelayHours > 2 ? "+2.8 hrs over threshold" : "Within acceptable SLA",
      trend: metrics.avgDelayHours > 2 ? "warning" : "down",
      icon: Clock,
      statusColor: metrics.avgDelayHours > 2 ? "text-rose-400" : "text-emerald-400",
      accentBg: metrics.avgDelayHours > 2 ? "from-rose-500/10 to-transparent" : "from-emerald-500/10 to-transparent",
      borderColor: metrics.avgDelayHours > 2 ? "border-rose-500/30" : "border-emerald-500/30",
      note: metrics.avgDelayHours > 2 ? "Primary bottleneck: Newark packing line" : "Optimized via AI dynamic reroute",
    },
    {
      id: "complaints",
      title: "Customer Complaint Rate",
      value: formatPercent(metrics.complaintRate),
      unit: "Benchmark: < 2.5%",
      change: metrics.complaintRate > 4 ? "4.2x industry baseline" : "-68% post AI reallocation",
      trend: metrics.complaintRate > 4 ? "warning" : "down",
      icon: MessageSquareWarning,
      statusColor: metrics.complaintRate > 4 ? "text-amber-400" : "text-emerald-400",
      accentBg: metrics.complaintRate > 4 ? "from-amber-500/10 to-transparent" : "from-emerald-500/10 to-transparent",
      borderColor: metrics.complaintRate > 4 ? "border-amber-500/30" : "border-emerald-500/30",
      note: "Top ticket: 'Order packed late / ETA pushed'",
    },
    {
      id: "bottleneck",
      title: "Warehouse Bottleneck Index",
      value: `${metrics.bottleneckIndex}/100`,
      unit: metrics.bottleneckIndex > 70 ? "CRITICAL QUEUE" : metrics.bottleneckIndex > 45 ? "MODERATE" : "BALANCED",
      change: metrics.bottleneckIndex > 70 ? "Shift peak: 14:00 - 19:00" : "Throughput normalized",
      trend: metrics.bottleneckIndex > 70 ? "warning" : "down",
      icon: Flame,
      statusColor: metrics.bottleneckIndex > 70 ? "text-rose-400" : "text-emerald-400",
      accentBg: metrics.bottleneckIndex > 70 ? "from-rose-500/10 to-transparent" : "from-emerald-500/10 to-transparent",
      borderColor: metrics.bottleneckIndex > 70 ? "border-rose-500/30" : "border-emerald-500/30",
      note: "Dock & Packing queue exceeds pick speed",
    },
    {
      id: "utilization",
      title: "Fleet vs Staff Utilization",
      value: `${metrics.fleetUtilization.toFixed(0)}% / ${metrics.staffUtilization.toFixed(0)}%`,
      unit: "Fleet / Packing Staff",
      change: "Capacity Paradox Detected",
      trend: "info",
      icon: Truck,
      statusColor: "text-purple-400",
      accentBg: "from-purple-500/10 to-transparent",
      borderColor: "border-purple-500/20",
      note: "High trucks, understaffed pack stations",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={cn(
              "relative overflow-hidden rounded-xl border p-4 bg-gradient-to-b bg-slate-900/60 backdrop-blur-md transition-all hover:border-slate-700 group",
              card.borderColor
            )}
          >
            {/* Ambient subtle glow background */}
            <div
              className={cn(
                "absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br opacity-40 blur-2xl group-hover:opacity-70 transition-opacity",
                card.accentBg
              )}
            />

            <div className="flex items-start justify-between relative z-10">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className={cn("p-2 rounded-lg bg-slate-800/80 border border-slate-700/60", card.statusColor)}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-white font-mono">{card.value}</span>
                <span className="text-[11px] text-slate-400 font-medium">{card.unit}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">
                <span
                  className={cn(
                    "flex items-center gap-1 font-medium",
                    card.trend === "warning"
                      ? "text-rose-400"
                      : card.trend === "down"
                      ? "text-emerald-400"
                      : card.trend === "up"
                      ? "text-cyan-400"
                      : "text-slate-300"
                  )}
                >
                  {card.trend === "warning" && <AlertCircle className="w-3.5 h-3.5" />}
                  {card.trend === "down" && <TrendingDown className="w-3.5 h-3.5" />}
                  {card.trend === "up" && <TrendingUp className="w-3.5 h-3.5" />}
                  {card.trend === "info" && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                  {card.change}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
                {card.note}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
