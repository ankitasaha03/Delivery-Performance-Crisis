"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  ArrowRight,
  Filter,
  Sliders,
  RotateCcw,
  X,
  FileText,
  AlertTriangle,
  Building,
} from "lucide-react";
import { useLogistics } from "@/context/LogisticsContext";
import { ChatMessage } from "@/types/logistics";
import { cn } from "@/lib/utils";

const quickPrompts = [
  "Why are deliveries delayed in Warehouse B (Newark)?",
  "Simulate staff reallocation for peak hours",
  "Generate root-cause summary for today's complaints",
  "Identify ghost inventory items causing pick aborts",
  "How can we prevent RT-104 Metro traffic delays?",
];

const initialChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "assistant",
    timestamp: "Just now",
    text: `Hello! I am your **Autonomous Logistics & Delivery Intelligence Analyst**. 

I have continuously analyzed your live orders, fulfillment centers, route telematics, shift staffing levels, and carrier handoffs.

**Key Diagnostic Finding:**
Despite possessing adequate total physical delivery truck capacity (89.2% utilization), deliveries are suffering a **4.6-hour average delay** and customer complaints have surged to **8.4%**. 

The primary breakdown is **not** vehicle shortage—it is a **severe packing throughput bottleneck in Newark (WH-E1)** during the 14:00-19:00 influx, combined with **unaligned carrier dispatch windows**.

How would you like to proceed? You can select a quick action or type any operational inquiry below.`,
    quickActions: [
      {
        label: "Investigate Newark Bottleneck",
        action: "filter_newark",
      },
      {
        label: "Simulate Shift Reallocation",
        action: "simulate_staffing",
      },
      {
        label: "View Root-Cause Report",
        action: "view_rca",
      },
    ],
  },
];

export function AiChatbot({ isSlideOver = false, onClose }: { isSlideOver?: boolean; onClose?: () => void }) {
  const {
    applyRecommendation,
    setWarehouseFilter,
    setActiveTab,
    metrics,
    warehouses,
    routes,
  } = useLogistics();

  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      generateAiResponse(query);
      setIsTyping(false);
    }, 1200);
  };

  const handleActionClick = (action: string) => {
    if (action === "filter_newark") {
      setWarehouseFilter("wh-newark");
      setActiveTab("warehouses");
    } else if (action === "simulate_staffing") {
      applyRecommendation("rec-1");
      const followUpMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: `⚡ **Simulation Executed:** Reassigned 18 trained associates to Newark East DC packing lines.
- Packing queue projected to drop from **1,480 orders to <280 orders**.
- Average packing time reduces from **42 mins to 20 mins**.
- Overall delivery delay reduced by **2.1 hours**.
- Dashboard metrics and live alert ticker have been updated.`,
      };
      setMessages((prev) => [...prev, followUpMsg]);
    } else if (action === "simulate_route") {
      applyRecommendation("rec-2");
      const followUpMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: `🚚 **Route Rerouting Simulated:** Rerouting RT-104 Manhattan traffic via early cross-dock staging and Queens bypass.
- Predicted transit time drops by **45 minutes**.
- SLA compliance improves from **61.4% to 89.2%**.`,
      };
      setMessages((prev) => [...prev, followUpMsg]);
    } else if (action === "view_rca") {
      setActiveTab("simulation");
    } else if (action === "inspect_inventory") {
      setActiveTab("inventory");
    }
  };

  const generateAiResponse = (query: string) => {
    const q = query.toLowerCase();
    let reply: ChatMessage;

    if (q.includes("warehouse b") || q.includes("newark")) {
      reply = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: `### 🔍 Deep Dive: Newark East DC (WH-E1) Bottleneck Analysis

**Why deliveries fail despite adequate logistics fleet:**
1. **Packing Station Starvation:** Newark DC has 54 designated packing benches, but only **32 active staff** are scheduled on the 14:00-19:00 shift. Orders pick at 580/hr, but packing line throughput stalls at 340/hr.
2. **Backlog Avalanche:** A queue of **1,480 orders** has accumulated on staging conveyors (pack latency: 42 mins vs. 18 min target).
3. **Carrier Cut-Off Failure:** Because packing finishes after the 18:30 FedEx & internal carrier dock cut-off, parcels miss same-day outbound runs, creating overnight delays.
4. **Physical Capacity vs. Labor Misalignment:** Truck fleet utilization is at 89%, but trucks are leaving docks at only 65% capacity due to packed pallet shortages.`,
        quickActions: [
          { label: "Apply Staff Reallocation Fix (-2.1h Delay)", action: "simulate_staffing" },
          { label: "Filter Dashboard to Newark Hub", action: "filter_newark" },
        ],
      };
    } else if (q.includes("staff") || q.includes("reallocation")) {
      reply = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: `### 👥 Staff Reallocation Simulation Model

**Identified Labor Imbalances Across Network:**
- **Chicago Central Hub:** Operating with +6 surplus pickers on low-demand aisles.
- **Newark East DC:** Deficit of -22 packing associates during evening dispatch wave.
- **Atlanta Southeast:** Deficit of -12 packing associates.

**Autonomous Action Plan:**
Shift 18 cross-trained general fulfillment staff to Newark packing benches 9–16 immediately. 

**Predicted Operational Impact:**
- Packing backlog cleared within **1.4 hours**
- Average delivery delay drops from **4.6 hrs → 2.5 hrs**
- Weekly estimated penalty/reshipment savings: **$18,400**`,
        quickActions: [
          { label: "Deploy Reallocation Now", action: "simulate_staffing" },
          { label: "Inspect Warehouse Staffing Sliders", action: "filter_newark" },
        ],
      };
    } else if (q.includes("complaint") || q.includes("root-cause") || q.includes("summary")) {
      reply = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: `### 📋 Executive Root-Cause Summary for Today's Complaints

**Total Customer Complaints Logged Today:** 842 tickets (Complaint Rate: 8.4%)

| Delay Category | Share | Root Cause Explanation | Direct Fix |
| :--- | :--- | :--- | :--- |
| **Warehouse Packing Queue** | 34% | Influx exceeded packing line headcount | Flex station staffing |
| **Last-Mile & Handoff** | 27% | Lincoln tunnel congestion & late dock manifests | Early batch release |
| **Shift Allocation Mismatch** | 19% | Floor workers clustered in receiving vs packing | Cross-dock transfer |
| **Ghost Inventory / Pick Aborts** | 13% | ERP showed 1,420 units of SKU-8820 but 86 missing | Cycle count freeze |
| **Carrier Bay Staging** | 7% | Simultaneous UPS/FedEx arrival dock gridlock | Staggered appointments |`,
        quickActions: [
          { label: "Simulate Staffing Solution", action: "simulate_staffing" },
          { label: "Simulate Route Optimization", action: "simulate_route" },
          { label: "Inspect Inventory Diagnostics", action: "inspect_inventory" },
        ],
      };
    } else if (q.includes("ghost") || q.includes("inventory") || q.includes("sku")) {
      reply = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: `### 📦 Ghost Inventory & Pick Failure Diagnostic

**Highest Severity SKU Discrepancies:**
- **SKU-8820-NC (Wireless ANC Earbuds):** 18.4% pick failure rate at Newark DC. 14 pickers had to abort tasks today because bin 14B was physically depleted despite ERP registering 86 available units.
- **SKU-4011-FL (Thermal Fleece):** Ground pick faces depleted; pickers waiting 14 minutes per pick for mezzanine forklift replenishment.

**Recommended Fix:**
Freeze phantom count on SKU-8820 and spill over orders to Chicago Central Hub, which holds 1,840 verified units in prime ground bin locations.`,
        quickActions: [
          { label: "Open Inventory Diagnostic Module", action: "inspect_inventory" },
        ],
      };
    } else {
      reply = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: `I've evaluated your query against current logistics telemetry. 

The system continues to track **${metrics.totalOrders.toLocaleString()} active orders** across 5 fulfillment centers. 

Currently, **Warehouse B (Newark)** and **Route RT-104 (NY Metro)** account for 61% of total SLA variance. Implementing the proposed AI shift reallocation and route bypass is calculated to reduce customer complaints by **68%**.`,
        quickActions: [
          { label: "Simulate Staff Reallocation", action: "simulate_staffing" },
          { label: "View Executive Overview", action: "view_rca" },
        ],
      };
    }

    setMessages((prev) => [...prev, reply]);
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-slate-950 border border-slate-800 text-slate-100",
        isSlideOver
          ? "fixed right-0 top-0 bottom-0 w-full sm:w-[520px] z-50 shadow-2xl shadow-black/80 backdrop-blur-xl"
          : "rounded-xl h-[780px]"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 text-slate-950">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              Autonomous Logistics AI Analyst
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                GPT-4o Supply Chain
              </span>
            </h3>
            <p className="text-xs text-slate-400">Real-time root cause analysis & operational simulator</p>
          </div>
        </div>

        {isSlideOver && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isBot = msg.sender === "assistant";
          return (
            <div
              key={msg.id}
              className={cn("flex gap-3", isBot ? "items-start" : "items-start flex-row-reverse")}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs",
                  isBot
                    ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950"
                    : "bg-slate-800 text-slate-300"
                )}
              >
                {isBot ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={cn(
                  "p-3.5 rounded-xl text-xs max-w-[85%] leading-relaxed border space-y-2",
                  isBot
                    ? "bg-slate-900/90 border-slate-800 text-slate-200"
                    : "bg-cyan-600 text-white border-cyan-500"
                )}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* Quick action buttons attached to bot reply */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(qa.action)}
                        className="px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-medium flex items-center gap-1 transition-all"
                      >
                        <Zap className="w-3 h-3" />
                        <span>{qa.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={cn(
                    "text-[10px] text-right font-mono",
                    isBot ? "text-slate-500" : "text-cyan-200"
                  )}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-mono text-cyan-300">Synthesizing logistics telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="p-2 border-t border-slate-800/80 bg-slate-900/40">
        <div className="text-[11px] font-semibold text-slate-400 mb-1.5 px-2 flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400" />
          Quick Action Inquiries:
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 px-1">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 whitespace-nowrap transition-colors flex-shrink-0 hover:text-cyan-400"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask why orders are delayed, request a simulation, or ask for operational fixes..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 transition-colors shadow-md shadow-cyan-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
