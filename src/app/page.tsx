"use client";

import React from "react";
import { LogisticsProvider, useLogistics } from "@/context/LogisticsContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { DeliveryStatusTrendChart } from "@/components/dashboard/DeliveryStatusTrendChart";
import { RootCauseBarChart } from "@/components/dashboard/RootCauseBarChart";
import { WarehouseVsRouteMatrix } from "@/components/dashboard/WarehouseVsRouteMatrix";
import { LiveAlertsFeed } from "@/components/dashboard/LiveAlertsFeed";
import { RecommendationsPanel } from "@/components/dashboard/RecommendationsPanel";
import { WarehouseAnalyticsView } from "@/components/warehouse/WarehouseAnalyticsView";
import { RouteOptimizerView } from "@/components/routes/RouteOptimizerView";
import { InventoryDiagnosticsView } from "@/components/inventory/InventoryDiagnosticsView";
import { RootCauseSimulatorView } from "@/components/simulation/RootCauseSimulatorView";
import { AiChatbot } from "@/components/chat/AiChatbot";

function AppContent() {
  const { activeTab, isChatSlideOverOpen, setIsChatSlideOverOpen } = useLogistics();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              {/* 1. Metric Cards */}
              <MetricCards />

              {/* 2. Primary Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DeliveryStatusTrendChart />
                <RootCauseBarChart />
              </div>

              {/* 3. Secondary Analytics & Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WarehouseVsRouteMatrix />
                <RecommendationsPanel />
              </div>

              {/* 4. Live Alerts Ticker */}
              <div className="w-full">
                <LiveAlertsFeed />
              </div>
            </div>
          )}

          {activeTab === "warehouses" && <WarehouseAnalyticsView />}
          {activeTab === "routes" && <RouteOptimizerView />}
          {activeTab === "inventory" && <InventoryDiagnosticsView />}
          {activeTab === "simulation" && <RootCauseSimulatorView />}
          {activeTab === "chat" && (
            <div className="max-w-4xl mx-auto py-2">
              <AiChatbot />
            </div>
          )}
        </main>
      </div>

      {/* Embedded Slide-Over AI Assistant Panel */}
      {isChatSlideOverOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsChatSlideOverOpen(false)}
          />
          <AiChatbot isSlideOver onClose={() => setIsChatSlideOverOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <LogisticsProvider>
      <AppContent />
    </LogisticsProvider>
  );
}
