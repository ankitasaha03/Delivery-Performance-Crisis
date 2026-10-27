# PulseLogix AI — Delivery Performance & Logistics Intelligence System

PulseLogix AI is a production-grade, AI-powered **Supply Chain & Delivery Intelligence Platform** built for high-volume e-commerce enterprises experiencing delivery delays and customer complaint surges despite having adequate logistics capacity.

---

## 🚀 Live Demo & Development Server
The application is running locally at:
```bash
http://localhost:3000
```

To run in development mode:
```bash
npm run dev
```

To build for production:
```bash
npm run build
npm start
```

---

## 🧠 The Operational Paradox Solved
> **The Problem:** The enterprise maintains 89.2% fleet vehicle utilization and ample warehouse square footage, yet average delivery delay is 4.6 hours (SLA target: <1.5 hours) and customer complaints reached 8.4%.

### Root Causes Diagnosed by the AI Engine:
1. **Warehouse Packing Line Starvation (34% of delays):**
   - In Newark East DC (WH-E1), 54 packing stations exist, but only **32 associates** were scheduled on the 14:00-19:00 surge shift.
   - Orders pick at 580/hr, but packing line throughput stalls at 340/hr, generating a 1,480-order backlog.
   - Finished pallets miss the 18:30 carrier departure deadline, pushing shipments into a 14-hour overnight rollover delay.
2. **Carrier Departure & Last-Mile Metro Congestion (27% of delays):**
   - Scheduled departures at 16:30 hit peak Lincoln Tunnel & I-95 corridor gridlock.
   - Shifting departures 45 minutes earlier bypasses peak traffic and recovers 45-75 minutes per route.
3. **Ghost Inventory & Pick Aborts (13% of delays):**
   - High-velocity SKUs (such as SKU-8820 Wireless ANC Earbuds) show positive inventory in ERP but have empty aisle bins. Pickers abort waves, waiting 3.8+ hours for supervisor audits.
4. **Carrier Dock Bay Staging Paralysis (7% of delays):**
   - Simultaneous FedEx and UPS truck arrivals overload loading docks.

---

## 🛠️ Tech Stack & Architecture
- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS (Modern enterprise dark-mode command center theme with glassmorphism)
- **Visualizations:** Recharts (Area charts, Horizontal bar root-cause attribution, Composed throughput vs. packing latency matrix)
- **Icons:** Lucide React
- **State Management & Simulation:** Custom React `LogisticsContext` supporting real-time telemetry streaming, interactive staff reallocation sliders, and multi-variable what-if modeling.
- **Embedded AI Analyst:** Interactive slide-over and full-view conversational AI with quick-action prompts that directly trigger UI filters and operational simulations.

---

## 📦 Project Structure
```
src/
├── app/
│   ├── globals.css              # Custom styling, dark/light theme tokens, glassmorphism
│   ├── layout.tsx               # Root layout & typography
│   └── page.tsx                 # Main application page wiring all views
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Navigation, simulation status, theme toggle
│   │   └── Header.tsx           # Telemetry status, active filters, AI trigger button
│   ├── dashboard/
│   │   ├── MetricCards.tsx      # Active Orders, Avg Delay, Complaints, Bottleneck Index
│   │   ├── DeliveryStatusTrendChart.tsx # 24h & peak hourly volume area chart
│   │   ├── RootCauseBarChart.tsx        # Horizontal root-cause attribution chart
│   │   ├── WarehouseVsRouteMatrix.tsx   # Throughput vs. packing delay matrix
│   │   ├── RecommendationsPanel.tsx     # Prescriptive AI recommendations
│   │   └── LiveAlertsFeed.tsx           # Real-time event ticker with quick actions
│   ├── warehouse/
│   │   └── WarehouseAnalyticsView.tsx   # Hub throughput, packing lines, staff adjusters
│   ├── routes/
│   │   └── RouteOptimizerView.tsx       # Last-mile telematics, traffic scores, rerouting
│   ├── inventory/
│   │   └── InventoryDiagnosticsView.tsx # Ghost inventory detector & pick failure rates
│   ├── simulation/
│   │   └── RootCauseSimulatorView.tsx   # What-if sandbox with live outcome scorecard
│   └── chat/
│       └── AiChatbot.tsx                # Autonomous AI supply chain analyst
├── context/
│   └── LogisticsContext.tsx     # Central reactive store & simulation engine
├── data/
│   └── mockLogisticsData.ts     # Realistic enterprise fulfillment & telematics dataset
├── lib/
│   └── utils.ts                 # Formatting & class merging utilities
└── types/
    └── logistics.ts             # Domain models (Warehouse, Route, Alert, Order, etc.)
```
