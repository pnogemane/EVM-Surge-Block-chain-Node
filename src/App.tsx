import React, { useState, useEffect } from "react";
import { NodeEngine } from "./services/NodeEngine";
import { Navbar } from "./components/Navbar";
import { NodeMetrics } from "./components/NodeMetrics";
import { TrafficSpikeSim } from "./components/TrafficSpikeSim";
import { StrategyManager } from "./components/StrategyManager";
import { AIGovernorPanel } from "./components/AIGovernorPanel";
import { RpcTerminal } from "./components/RpcTerminal";
import { WalletModal } from "./components/WalletModal";
import { ApkExportModal } from "./components/ApkExportModal";
import { LayoutDashboard, Layers, Bot, Terminal, Key, Shield } from "lucide-react";

export default function App() {
  const engine = NodeEngine.getInstance();

  const [metrics, setMetrics] = useState(engine.getMetrics());
  const [strategyMetrics, setStrategyMetrics] = useState(engine.getStrategyMetrics());
  const [wallet, setWallet] = useState(engine.getWallet());
  const [privacySettings, setPrivacySettings] = useState(engine.getPrivacySettings());
  const [rpcLogs, setRpcLogs] = useState(engine.getRpcLogs());
  const [aiRecommendations, setAiRecommendations] = useState(engine.getAiRecommendations());
  const [isAiLoading, setIsAiLoading] = useState(engine.isAiLoading());

  const [activeView, setActiveView] = useState<"DASHBOARD" | "STRATEGIES" | "AI_GOVERNOR" | "RPC_TERMINAL">("DASHBOARD");
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isApkOpen, setIsApkOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = engine.subscribe(() => {
      setMetrics(engine.getMetrics());
      setStrategyMetrics(engine.getStrategyMetrics());
      setWallet(engine.getWallet());
      setPrivacySettings(engine.getPrivacySettings());
      setRpcLogs(engine.getRpcLogs());
      setAiRecommendations(engine.getAiRecommendations());
      setIsAiLoading(engine.isAiLoading());
    });
    return () => unsubscribe();
  }, [engine]);

  const handleTriggerSpike = (multiplier: number) => {
    engine.triggerTrafficSpike(multiplier);
  };

  const handleRunAiGovernor = () => {
    engine.queryAiGovernor();
  };

  const handleGenerateNewWallet = () => {
    engine.generateNewWallet();
  };

  const handleUpdatePrivacy = (updated: any) => {
    engine.updatePrivacySettings(updated);
  };

  return (
    <div className="flex h-screen w-full bg-[#0F172A] text-slate-200 font-sans overflow-hidden">
      {/* Left Sidebar - Sleek Interface Theme */}
      <aside className="w-64 border-r border-slate-800 flex flex-col bg-[#020617] shrink-0 hidden md:flex">
        {/* Brand */}
        <div className="p-6 flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-500/20 text-lg">
            N
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white flex items-center space-x-1">
              <span>NODE</span>
              <span className="text-blue-500">CORE</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              EVM SURGE v2.4
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 py-4 text-xs font-medium">
          <button
            onClick={() => setActiveView("DASHBOARD")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeView === "DASHBOARD"
                ? "bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30 shadow-md shadow-blue-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-3 text-blue-400" />
            <span>Node Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView("STRATEGIES")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeView === "STRATEGIES"
                ? "bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30 shadow-md shadow-blue-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Layers className="w-4 h-4 mr-3 opacity-70" />
            <span>Strategy Pattern</span>
          </button>

          <button
            onClick={() => setActiveView("AI_GOVERNOR")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeView === "AI_GOVERNOR"
                ? "bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30 shadow-md shadow-blue-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Bot className="w-4 h-4 mr-3 opacity-70" />
            <span>AI Privacy & Logic</span>
          </button>

          <button
            onClick={() => setActiveView("RPC_TERMINAL")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeView === "RPC_TERMINAL"
                ? "bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30 shadow-md shadow-blue-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Terminal className="w-4 h-4 mr-3 opacity-70" />
            <span>RPC Stream Logs</span>
          </button>
        </nav>

        {/* Bottom Android Native APK Widget */}
        <div className="p-4 mt-auto">
          <div
            onClick={() => setIsApkOpen(true)}
            className="bg-slate-800/50 hover:bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 group-hover:text-blue-400 transition-colors">
                Android Native
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-sm font-bold text-slate-100">APK Build v2.4.0</div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">
              Synced to phiwokuhle...
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Header */}
        <Navbar
          metrics={metrics}
          wallet={wallet}
          onOpenWallet={() => setIsWalletOpen(true)}
          onOpenApk={() => setIsApkOpen(true)}
          onTriggerAiGovernor={handleRunAiGovernor}
          isAiLoading={isAiLoading}
        />

        {/* Mobile Subnav Tabs */}
        <div className="flex md:hidden items-center space-x-1 bg-[#020617] p-2 border-b border-slate-800 text-xs font-semibold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveView("DASHBOARD")}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeView === "DASHBOARD" ? "bg-blue-600 text-white font-bold" : "text-slate-400"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView("STRATEGIES")}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeView === "STRATEGIES" ? "bg-blue-600 text-white font-bold" : "text-slate-400"
            }`}
          >
            Strategies
          </button>
          <button
            onClick={() => setActiveView("AI_GOVERNOR")}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeView === "AI_GOVERNOR" ? "bg-blue-600 text-white font-bold" : "text-slate-400"
            }`}
          >
            AI Logic
          </button>
          <button
            onClick={() => setActiveView("RPC_TERMINAL")}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeView === "RPC_TERMINAL" ? "bg-blue-600 text-white font-bold" : "text-slate-400"
            }`}
          >
            RPC Stream
          </button>
        </div>

        {/* Content View Body */}
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
          {activeView === "DASHBOARD" && (
            <div className="space-y-6">
              {/* Top Gauges & Pod Topology */}
              <NodeMetrics
                metrics={metrics}
                strategyMetrics={strategyMetrics}
                wallet={wallet}
              />

              {/* dApp Traffic Spike Controller */}
              <TrafficSpikeSim
                metrics={metrics}
                strategyMetrics={strategyMetrics}
                onTriggerSpike={handleTriggerSpike}
              />

              {/* Terminal Stream */}
              <RpcTerminal logs={rpcLogs} />
            </div>
          )}

          {activeView === "STRATEGIES" && (
            <StrategyManager
              onStrategyChanged={() => {
                setMetrics(engine.getMetrics());
                setStrategyMetrics(engine.getStrategyMetrics());
              }}
            />
          )}

          {activeView === "AI_GOVERNOR" && (
            <AIGovernorPanel
              metrics={metrics}
              privacySettings={privacySettings}
              recommendations={aiRecommendations}
              isAiLoading={isAiLoading}
              onRunAiGovernor={handleRunAiGovernor}
              onUpdatePrivacy={handleUpdatePrivacy}
            />
          )}

          {activeView === "RPC_TERMINAL" && (
            <RpcTerminal logs={rpcLogs} />
          )}
        </main>
      </div>

      {/* Modals */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        wallet={wallet}
        onGenerateNewWallet={handleGenerateNewWallet}
      />

      <ApkExportModal
        isOpen={isApkOpen}
        onClose={() => setIsApkOpen(false)}
      />
    </div>
  );
}
