import React from "react";
import {
  Activity,
  Cpu,
  Layers,
  Zap,
  TrendingUp,
  Clock,
  HardDrive,
  ShieldCheck,
  Coins
} from "lucide-react";
import { NodeMetrics as NodeMetricsType, StrategyMetrics, WalletInfo } from "../types";

interface NodeMetricsProps {
  metrics: NodeMetricsType;
  strategyMetrics: StrategyMetrics;
  wallet: WalletInfo;
}

export const NodeMetrics: React.FC<NodeMetricsProps> = ({
  metrics,
  strategyMetrics,
  wallet,
}) => {
  // Render visual grid representation of up to 32 pods
  const podElements = Array.from({ length: 32 }, (_, i) => {
    const isActive = i < strategyMetrics.podCount;
    return (
      <div
        key={i}
        className={`h-4 rounded transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-sm shadow-cyan-500/50 animate-pulse"
            : "bg-slate-800/60 border border-slate-800/80"
        }`}
        title={`Pod #${i + 1}: ${isActive ? "ACTIVE WORKER" : "STANDBY"}`}
      />
    );
  });

  return (
    <div className="space-y-6">
      {/* 4 Primary Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: RPS Throughput */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center">
              <Zap className="h-4 w-4 text-blue-400 mr-2" />
              Scaling Throughput
            </span>
            <span className="text-emerald-400 font-bold font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              +{metrics.surgeMultiplier}x Surge
            </span>
          </div>
          <div className="text-3xl font-bold flex items-baseline justify-between text-white font-mono">
            <span>
              {metrics.rps} <span className="text-xs text-slate-400 font-normal">RPS</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Peak {metrics.peakRps}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (metrics.rps / 1200) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Auto-scaling Pod Pool */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center">
              <Cpu className="h-4 w-4 text-indigo-400 mr-2" />
              Scaling Pods
            </span>
            <span className="text-indigo-300 font-bold font-mono text-[11px]">
              {strategyMetrics.cpuUsagePercent}% CPU
            </span>
          </div>
          <div className="text-3xl font-bold flex items-baseline justify-between text-indigo-300 font-mono">
            <span>
              {metrics.activePods} <span className="text-xs text-slate-400 font-normal">/ {metrics.maxPods}</span>
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              0 Drops
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (metrics.activePods / metrics.maxPods) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 3: RPC Latency */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center">
              <Clock className="h-4 w-4 text-emerald-400 mr-2" />
              RPC Latency
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {metrics.gasPriceGwei.toFixed(1)} Gwei
            </span>
          </div>
          <div className="text-3xl font-bold flex items-baseline justify-between text-emerald-400 font-mono">
            <span>
              {metrics.latencyMs} <span className="text-xs text-slate-400 font-normal">ms</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Q: {metrics.mempoolDepth}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, (metrics.latencyMs / 100) * 100))}%` }}
            />
          </div>
        </div>

        {/* Card 4: Mining & Yield */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center">
              <Coins className="h-4 w-4 text-amber-400 mr-2" />
              Current Yield
            </span>
            <span className="text-blue-400 font-bold font-mono text-[11px]">
              MAINNET
            </span>
          </div>
          <div className="text-3xl font-bold flex items-baseline justify-between text-amber-300 font-mono">
            <span>
              +{wallet.minedEthTotal.toFixed(3)} <span className="text-xs text-slate-400 font-normal">ETH</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">
              #{metrics.blockHeight}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 w-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Cloud Auto-scaling Pod Visualizer Grid */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-blue-400" />
            <span className="font-bold text-slate-100 text-sm">
              Cloud Worker Container Pod Topology (Elastic Auto-Scaler)
            </span>
          </div>
          <span className="text-slate-400 font-mono text-xs">
            Active: <span className="text-blue-400 font-bold">{strategyMetrics.podCount} Pods</span> |
            Standby Pool: <span className="text-slate-500">{32 - strategyMetrics.podCount} Pods</span>
          </span>
        </div>

        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 pt-1">
          {podElements}
        </div>
      </div>
    </div>
  );
};
