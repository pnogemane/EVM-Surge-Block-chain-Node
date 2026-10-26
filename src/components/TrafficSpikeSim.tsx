import React from "react";
import {
  Flame,
  Zap,
  TrendingUp,
  Layers,
  BarChart3,
  CheckCircle2,
  Cpu,
  ArrowUpRight
} from "lucide-react";
import { NodeMetrics, StrategyMetrics } from "../types";
import { StrategyRegistry } from "../strategies/TrafficStrategy";

interface TrafficSpikeSimProps {
  metrics: NodeMetrics;
  strategyMetrics: StrategyMetrics;
  onTriggerSpike: (multiplier: number) => void;
}

export const TrafficSpikeSim: React.FC<TrafficSpikeSimProps> = ({
  metrics,
  strategyMetrics,
  onTriggerSpike,
}) => {
  const activeStrategy = StrategyRegistry.getInstance().getActiveStrategy();

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Flame className="h-5 w-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Traffic Monitoring & ETH Spike Protection</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono border border-blue-500/20 font-bold">
                LIVE SIMULATOR
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Inject synthetic dApp RPC surges to evaluate Strategy Pattern auto-scaling response
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-[#020617] px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-500">Current Load:</span>
          <span className="text-blue-400 font-bold">{metrics.rps} RPS</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">Surge:</span>
          <span className="text-amber-400 font-bold">{metrics.surgeMultiplier}x</span>
        </div>
      </div>

      {/* Preset Spike Triggers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onTriggerSpike(1.0)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            metrics.surgeMultiplier === 1.0
              ? "bg-slate-900 border-blue-500 ring-1 ring-blue-500/30"
              : "bg-[#020617]/50 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Normal Baseline</span>
            <span className="text-emerald-400 font-bold">1x</span>
          </div>
          <div className="text-base font-bold text-white font-mono">~12 RPS</div>
          <p className="text-[10px] text-slate-500 mt-1">Standard block state sync</p>
        </button>

        <button
          onClick={() => onTriggerSpike(10.0)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            metrics.surgeMultiplier === 10.0
              ? "bg-slate-900 border-amber-500 ring-1 ring-amber-500/30"
              : "bg-[#020617]/50 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>DEX Arbitrage Burst</span>
            <span className="text-amber-400 font-bold">10x</span>
          </div>
          <div className="text-base font-bold text-amber-300 font-mono">~120 RPS</div>
          <p className="text-[10px] text-slate-500 mt-1">Uniswap pool trade surge</p>
        </button>

        <button
          onClick={() => onTriggerSpike(50.0)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            metrics.surgeMultiplier === 50.0
              ? "bg-slate-900 border-orange-500 ring-1 ring-orange-500/30"
              : "bg-[#020617]/50 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>NFT Mint Frenzy</span>
            <span className="text-orange-400 font-bold">50x</span>
          </div>
          <div className="text-base font-bold text-orange-300 font-mono">~600 RPS</div>
          <p className="text-[10px] text-slate-500 mt-1">OpenSea gas war burst</p>
        </button>

        <button
          onClick={() => onTriggerSpike(100.0)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            metrics.surgeMultiplier === 100.0
              ? "bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/40"
              : "bg-[#020617]/50 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Flashloan Surge</span>
            <span className="text-indigo-400 font-extrabold flex items-center">
              100x <Zap className="h-3 w-3 ml-0.5 animate-pulse text-indigo-300" />
            </span>
          </div>
          <div className="text-base font-bold text-indigo-200 font-mono">~1,200 RPS</div>
          <p className="text-[10px] text-slate-400 mt-1">Aave liquidation cascade</p>
        </button>
      </div>

      {/* Visual Traffic Monitoring Bar Chart from Sleek Design */}
      <div className="bg-[#020617] rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-200">Real-Time Traffic Load Telemetry</span>
          <span className="text-[10px] text-blue-400 font-mono">SPIKE_ABSORBER_ACTIVE</span>
        </div>
        <div className="h-[120px] flex items-end space-x-1.5 overflow-hidden pt-4">
          {Array.from({ length: 24 }, (_, i) => {
            const isSpike = (i > 8 && i < 14) || (i > 18 && i < 22);
            const height = isSpike
              ? Math.min(100, Math.max(40, (metrics.surgeMultiplier / 100) * 90 + Math.sin(i) * 15))
              : Math.max(15, Math.sin(i * 0.8) * 20 + 25);
            return (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all duration-300 ${
                  isSpike && metrics.surgeMultiplier > 1
                    ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    : "bg-slate-800"
                }`}
                style={{ height: `${height}%` }}
                title={`Sample #${i + 1}: ${Math.round(height)}% load`}
              />
            );
          })}
        </div>
      </div>

      {/* Auto-scaling Group Performance telemetry */}
      <div className="bg-[#020617] rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-200">
              Active Strategy:{" "}
              <span className="text-blue-300 font-mono font-bold">{activeStrategy.name}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Allocated Pods:</span>
            <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {strategyMetrics.podCount} Pod Workers
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <span className="text-slate-500 block text-[11px]">Processed RPS</span>
            <span className="font-mono text-white font-bold text-sm">
              {strategyMetrics.processedRps} req/sec
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Buffered Mempool Queue</span>
            <span className="font-mono text-blue-300 font-bold text-sm">
              {strategyMetrics.bufferedCount} txs
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Dropped Requests</span>
            <span className="font-mono text-emerald-400 font-bold text-sm flex items-center">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-1" />
              {strategyMetrics.droppedCount} (0.00%)
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Cluster Avg Latency</span>
            <span className="font-mono text-indigo-300 font-bold text-sm">
              {strategyMetrics.avgLatencyMs} ms
            </span>
          </div>
        </div>

        {/* Telemetry log message */}
        <p className="text-[11px] text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono leading-relaxed mt-2">
          <span className="text-blue-400 font-bold mr-2">[TELEMETRY]</span>
          {activeStrategy.getExecutionTelemetry()}
        </p>
      </div>
    </div>
  );
};
