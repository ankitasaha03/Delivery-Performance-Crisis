"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GlobalLogisticsState,
  Warehouse,
  Route,
  InventoryDiagnostic,
  LiveAlert,
  OperationalRecommendation,
} from "@/types/logistics";
import {
  initialGlobalMetrics,
  mockWarehouses,
  mockRoutes,
  mockInventoryDiagnostics,
  mockAlerts,
  mockRecommendations,
} from "@/data/mockLogisticsData";

interface LogisticsContextType {
  metrics: GlobalLogisticsState;
  warehouses: Warehouse[];
  routes: Route[];
  inventory: InventoryDiagnostic[];
  alerts: LiveAlert[];
  recommendations: OperationalRecommendation[];
  selectedWarehouseFilter: string | null;
  selectedRouteFilter: string | null;
  theme: "dark" | "light";
  activeTab: string;
  isChatSlideOverOpen: boolean;
  simulationActive: boolean;
  simulationSpeed: number;
  totalImprovements: {
    delaySavedHours: number;
    bottleneckReduced: number;
    costSaved: number;
    complaintReduced: number;
  };
  setWarehouseFilter: (id: string | null) => void;
  setRouteFilter: (id: string | null) => void;
  setTheme: (theme: "dark" | "light") => void;
  setActiveTab: (tab: string) => void;
  setIsChatSlideOverOpen: (open: boolean) => void;
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  applyRecommendation: (id: string) => void;
  revertRecommendation: (id: string) => void;
  resolveAlert: (id: string) => void;
  adjustStaffing: (warehouseId: string, additionalStaff: number) => void;
  triggerSimulatedSurge: () => void;
  resetAll: () => void;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export function LogisticsProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<GlobalLogisticsState>(initialGlobalMetrics);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [inventory, setInventory] = useState<InventoryDiagnostic[]>(mockInventoryDiagnostics);
  const [alerts, setAlerts] = useState<LiveAlert[]>(mockAlerts);
  const [recommendations, setRecommendations] = useState<OperationalRecommendation[]>(mockRecommendations);

  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState<string | null>(null);
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string | null>(null);
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isChatSlideOverOpen, setIsChatSlideOverOpen] = useState<boolean>(false);
  const [simulationActive, setSimulationActive] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Sync theme with document class
  const setTheme = (newTheme: "dark" | "light") => {
    setThemeState(newTheme);
    if (typeof document !== "undefined") {
      if (newTheme === "light") {
        document.documentElement.classList.add("light-theme");
      } else {
        document.documentElement.classList.remove("light-theme");
      }
    }
  };

  // Calculate cumulative improvements applied from recommendations
  const totalImprovements = recommendations.reduce(
    (acc, rec) => {
      if (rec.isApplied) {
        acc.delaySavedHours += rec.simulationDelta.delayReductionHours;
        acc.bottleneckReduced += rec.simulationDelta.bottleneckIndexReduction;
        acc.costSaved += rec.simulationDelta.estimatedCostSavings;
        acc.complaintReduced += rec.simulationDelta.complaintRateReduction;
      }
      return acc;
    },
    { delaySavedHours: 0, bottleneckReduced: 0, costSaved: 0, complaintReduced: 0 }
  );

  // Recalculate global metrics whenever recommendations or warehouses change
  const applyRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, isApplied: true };
        }
        return r;
      })
    );

    const targetRec = recommendations.find((r) => r.id === id);
    if (!targetRec || targetRec.isApplied) return;

    // Apply positive delta to metrics
    setMetrics((m) => ({
      ...m,
      avgDelayHours: Math.max(0.9, Number((m.avgDelayHours - targetRec.simulationDelta.delayReductionHours).toFixed(1))),
      bottleneckIndex: Math.max(20, m.bottleneckIndex - targetRec.simulationDelta.bottleneckIndexReduction),
      complaintRate: Math.max(1.2, Number((m.complaintRate - targetRec.simulationDelta.complaintRateReduction).toFixed(1))),
      slaComplianceRate: Math.min(98.5, Number((m.slaComplianceRate + targetRec.simulationDelta.delayReductionHours * 4.2).toFixed(1))),
    }));

    // If rec is staffing, also improve Newark and Atlanta warehouse metrics
    if (id === "rec-1") {
      setWarehouses((prev) =>
        prev.map((wh) => {
          if (wh.id === "wh-newark") {
            return {
              ...wh,
              activeStaff: 50,
              avgPackingMinutes: 20,
              bottleneckScore: 42,
              status: "healthy",
              backlogOrders: 280,
            };
          }
          return wh;
        })
      );
    }

    // If rec is routing, improve RT-104
    if (id === "rec-2") {
      setRoutes((prev) =>
        prev.map((rt) => {
          if (rt.id === "rt-104") {
            return {
              ...rt,
              avgTransitHours: 3.2,
              delayHours: 0.7,
              trafficAnomalyScore: 35,
              slaCompliancePercent: 89.2,
            };
          }
          return rt;
        })
      );
    }

    // Add alert acknowledging the fix
    const newAlert: LiveAlert = {
      id: `alt-rec-${Date.now()}`,
      timestamp: "Just now",
      severity: "resolved",
      category: "staffing",
      title: `Simulation Deployed: ${targetRec.title}`,
      description: `Predicted impact: ${targetRec.impactBadge}. Operations rebalancing active.`,
      targetEntity: targetRec.category,
      targetId: targetRec.id,
      resolved: true,
    };
    setAlerts((a) => [newAlert, ...a]);
  };

  const revertRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, isApplied: false };
        }
        return r;
      })
    );

    const targetRec = recommendations.find((r) => r.id === id);
    if (!targetRec || !targetRec.isApplied) return;

    setMetrics((m) => ({
      ...m,
      avgDelayHours: Number((m.avgDelayHours + targetRec.simulationDelta.delayReductionHours).toFixed(1)),
      bottleneckIndex: Math.min(95, m.bottleneckIndex + targetRec.simulationDelta.bottleneckIndexReduction),
      complaintRate: Number((m.complaintRate + targetRec.simulationDelta.complaintRateReduction).toFixed(1)),
      slaComplianceRate: Math.max(65, Number((m.slaComplianceRate - targetRec.simulationDelta.delayReductionHours * 4.2).toFixed(1))),
    }));

    if (id === "rec-1") {
      setWarehouses((prev) =>
        prev.map((wh) => {
          if (wh.id === "wh-newark") {
            return {
              ...wh,
              activeStaff: 32,
              avgPackingMinutes: 42,
              bottleneckScore: 92,
              status: "critical",
              backlogOrders: 1480,
            };
          }
          return wh;
        })
      );
    }
  };

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true, severity: "resolved" } : a))
    );
  };

  const adjustStaffing = (warehouseId: string, additionalStaff: number) => {
    setWarehouses((prev) =>
      prev.map((wh) => {
        if (wh.id === warehouseId) {
          const newStaff = Math.max(10, wh.activeStaff + additionalStaff);
          const ratio = newStaff / wh.requiredStaff;
          const newScore = Math.max(20, Math.min(98, Math.round(95 - ratio * 45)));
          const newAvgPacking = Math.max(16, Math.round(48 / (ratio || 0.5)));
          const newStatus = newScore > 80 ? "critical" : newScore > 55 ? "moderate" : "healthy";
          return {
            ...wh,
            activeStaff: newStaff,
            bottleneckScore: newScore,
            avgPackingMinutes: newAvgPacking,
            status: newStatus,
          };
        }
        return wh;
      })
    );
  };

  const triggerSimulatedSurge = () => {
    const alertId = `alt-surge-${Date.now()}`;
    const newAlert: LiveAlert = {
      id: alertId,
      timestamp: "Just now",
      severity: "critical",
      category: "route",
      title: "Sudden Flash Congestion Spike Detected",
      description: "Severe rain squall on I-95 corridor causing +45m slowdown. Fleet telematics triggered re-routing advisory.",
      targetEntity: "RT-208 (I-95)",
      targetId: "rt-208",
      resolved: false,
    };
    setAlerts((a) => [newAlert, ...a]);
    setMetrics((m) => ({
      ...m,
      avgDelayHours: Number((m.avgDelayHours + 0.3).toFixed(1)),
      complaintRate: Number((m.complaintRate + 0.4).toFixed(1)),
    }));
  };

  const resetAll = () => {
    setMetrics(initialGlobalMetrics);
    setWarehouses(mockWarehouses);
    setRoutes(mockRoutes);
    setInventory(mockInventoryDiagnostics);
    setAlerts(mockAlerts);
    setRecommendations(mockRecommendations.map((r) => ({ ...r, isApplied: false })));
    setSelectedWarehouseFilter(null);
    setSelectedRouteFilter(null);
  };

  // Subtle real-time heart beat to simulate live stream data
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      setMetrics((prev) => {
        // Minor natural fluctuations
        const jitter = (Math.random() - 0.5) * 0.04;
        const newDelay = Math.max(0.8, Number((prev.avgDelayHours + jitter).toFixed(2)));
        return {
          ...prev,
          avgDelayHours: newDelay,
          totalOrders: prev.totalOrders + Math.floor(Math.random() * 3),
        };
      });
    }, 4000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [simulationActive, simulationSpeed]);

  return (
    <LogisticsContext.Provider
      value={{
        metrics,
        warehouses,
        routes,
        inventory,
        alerts,
        recommendations,
        selectedWarehouseFilter,
        selectedRouteFilter,
        theme,
        activeTab,
        isChatSlideOverOpen,
        simulationActive,
        simulationSpeed,
        totalImprovements,
        setWarehouseFilter: setSelectedWarehouseFilter,
        setRouteFilter: setSelectedRouteFilter,
        setTheme,
        setActiveTab,
        setIsChatSlideOverOpen,
        toggleSimulation: () => setSimulationActive((p) => !p),
        setSimulationSpeed,
        applyRecommendation,
        revertRecommendation,
        resolveAlert,
        adjustStaffing,
        triggerSimulatedSurge,
        resetAll,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
}

export function useLogistics() {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error("useLogistics must be used within a LogisticsProvider");
  }
  return context;
}
