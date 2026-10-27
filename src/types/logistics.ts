export type DeliveryStatus = 'on_time' | 'at_risk' | 'delayed' | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  destinationCity: string;
  warehouseId: string;
  warehouseName: string;
  routeId: string;
  carrier: string;
  status: DeliveryStatus;
  delayHours: number;
  rootCause: string;
  itemsCount: number;
  orderPlacedAt: string;
  promisedDeliveryAt: string;
  estimatedDeliveryAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  capacityUtilization: number; // percentage (e.g. 88)
  throughputPerHour: number; // units/hr
  avgPackingMinutes: number; // minutes to pick & pack
  targetPackingMinutes: number;
  activeStaff: number;
  requiredStaff: number;
  bottleneckScore: number; // 0-100 (higher = worse)
  status: 'healthy' | 'moderate' | 'critical';
  dockTurnaroundMinutes: number;
  backlogOrders: number;
  primaryBottleneck: string;
}

export interface Route {
  id: string;
  code: string;
  originHub: string;
  destinationZone: string;
  carrier: 'FedEx' | 'UPS' | 'OnTrac' | 'DHL' | 'Internal Fleet';
  avgTransitHours: number;
  scheduledTransitHours: number;
  delayHours: number;
  trafficAnomalyScore: number; // 0-100
  weatherCondition: 'Clear' | 'Rain Storm' | 'Snow / Ice' | 'High Winds' | 'Fog';
  slaCompliancePercent: number;
  activeDeliveries: number;
  bottleneckFactor: string;
}

export interface InventoryDiagnostic {
  sku: string;
  name: string;
  category: string;
  warehouseCode: string;
  inStock: number;
  allocated: number;
  stockoutIncidentsPast30d: number;
  ghostInventoryRisk: number; // percentage
  avgFulfillmentDelayHours: number;
  pickFailureRate: number; // percentage
  recommendation: string;
}

export interface LiveAlert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info' | 'resolved';
  category: 'warehouse' | 'route' | 'staffing' | 'inventory';
  title: string;
  description: string;
  targetEntity: string;
  targetId: string;
  resolved: boolean;
}

export interface OperationalRecommendation {
  id: string;
  title: string;
  category: 'Staffing' | 'Routing' | 'Inventory' | 'Batching';
  impactBadge: string;
  confidenceScore: number; // 0-100
  timeToDeploy: string;
  rootCauseTarget: string;
  summary: string;
  operationalSteps: string[];
  simulationDelta: {
    delayReductionHours: number;
    bottleneckIndexReduction: number;
    complaintRateReduction: number;
    estimatedCostSavings: number;
  };
  isApplied: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  quickActions?: {
    label: string;
    action: string;
    payload?: any;
  }[];
  dataVisual?: {
    type: 'comparison' | 'metric' | 'warehouse_breakdown';
    title: string;
    metrics: { label: string; value: string; delta?: string }[];
  };
}

export interface GlobalLogisticsState {
  totalOrders: number;
  avgDelayHours: number;
  complaintRate: number; // percentage
  bottleneckIndex: number; // 0-100
  fleetUtilization: number; // percentage
  staffUtilization: number; // percentage
  slaComplianceRate: number; // percentage
}
