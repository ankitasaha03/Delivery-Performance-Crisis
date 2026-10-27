"use client";

import React from "react";
import {
  LayoutDashboard,
  Building2,
  Navigation,
  PackageSearch,
  Bot,
  SlidersHorizontal,
  Sun,
  Moon,
  Zap,
  Activity,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Executive Overview", icon: LayoutDashboard },
  { id: "warehouses", label: "Warehouse Analytics", icon: Building2, badge: "2 Critical", badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
  { id: "routes", label: "Route Optimizer", icon: Navigation, badge: "I-95 Alert", badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { id: "inventory", label: "Inventory Diagnostics", icon: PackageSearch },
  { id: "simulation", label: "Root-Cause Simulator", icon: SlidersHorizontal },
  { id: "chat", label: "AI Logistics Analyst", icon: Bot, badge: "AI Ready", badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
];

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    theme,
    setTheme,
    simulationActive,
    toggleSimulation,
    simulationSpeed,
    setSimulationSpeed,
    resetAll,
    setIsChatSlideOverOpen,
    alerts,
  } = useLogistics();

  const unresolvedCriticalCount = alerts.filter(
    (a) => !a.resolved && a.severity === "critical"
  ).length;

  return (
    <aside className="w-68 flex-shrink-0 flex flex-col justify-between border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-xl h-screen sticky top-0 z-30 transition-colors">
      {/* Top Header Logo */}
      <div>
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white font-bold text-lg">
              <Zap className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
                PulseLogix <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">AI</span>
              </div>
              <p className="text-xs text-slate-400 font-normal">Logistics Intelligence</p>
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", simulationActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500")} />
            <span className="text-slate-300 font-medium">
              {simulationActive ? "Telemetry Live" : "Stream Paused"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <button
              onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 5 : 1)}
              className="px-1.5 py-0.5 rounded hover:bg-slate-800 text-cyan-400 font-mono transition-colors"
              title="Click to toggle simulation speed"
            >
              {simulationSpeed}x Speed
            </button>
            <button
              onClick={toggleSimulation}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={simulationActive ? "Pause simulation" : "Resume simulation"}
            >
              {simulationActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === "chat") {
                    setIsChatSlideOverOpen(true);
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm shadow-cyan-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                      item.badgeColor || "bg-slate-800 text-slate-400 border-slate-700"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls & System Telemetry */}
      <div className="p-3 border-t border-slate-800/60 space-y-3">
        {/* Unresolved Alert Banner */}
        {unresolvedCriticalCount > 0 && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
            <div className="flex items-center justify-between text-rose-400 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 animate-bounce" />
                Bottleneck Alert
              </span>
              <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-[10px]">
                {unresolvedCriticalCount} Active
              </span>
            </div>
            <p className="text-[11px] text-rose-300/80 leading-relaxed">
              Packing queue at Newark DC & Metro traffic exceeding SLA tolerances.
            </p>
          </div>
        )}

        {/* Footer Actions: Theme Toggle & Reset */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 px-2 py-1.5 rounded-md hover:bg-slate-900 transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 px-2 py-1.5 rounded-md hover:bg-slate-900 transition-colors"
            title="Reset simulation and models to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
