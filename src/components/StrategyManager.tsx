import React, { useState } from "react";
import {
  Layers,
  CheckCircle,
  Plus,
  Code,
  Zap,
  Shield,
  Sliders,
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react";
import { StrategyRegistry, ITrafficHandlingStrategy } from "../strategies/TrafficStrategy";
import { CustomDynamicStrategy } from "../strategies/ConcreteStrategies";

interface StrategyManagerProps {
  onStrategyChanged: () => void;
}

export const StrategyManager: React.FC<StrategyManagerProps> = ({
  onStrategyChanged,
}) => {
  const registry = StrategyRegistry.getInstance();
  const allStrategies = registry.getAllStrategies();
  const activeStrategy = registry.getActiveStrategy();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newStrategyName, setNewStrategyName] = useState<string>("MEVBoostRelayStrategy");
  const [newStrategyDesc, setNewStrategyDesc] = useState<string>(
    "Direct MEV-Boost auction relay with priority flashbots bundle queuing."
  );
  const [maxRpsPod, setMaxRpsPod] = useState<number>(30);
  const [policy, setPolicy] = useState<string>("GAS_FEE_PRIORITY");

  const handleSelectStrategy = (name: string) => {
    registry.setActiveStrategy(name);
    onStrategyChanged();
  };

  const handleRegisterCustomStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStrategyName) return;

    const customStrat = new CustomDynamicStrategy(
      newStrategyName.trim().replace(/\s+/g, ""),
      newStrategyDesc,
      maxRpsPod,
      policy
    );

    registry.registerStrategy(customStrat);
    registry.setActiveStrategy(customStrat.name);
    setShowAddModal(false);
    onStrategyChanged();
  };

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 space-y-6 shadow-sm">
      {/* Title & OCP Principle Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Behavior Lifecycle (Strategy Pattern Architecture)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Swap behavior classes dynamically at runtime without modifying core EVM node logic
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-md shadow-blue-500/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Register Concrete Behavior Class</span>
        </button>
      </div>

      {/* Sleek Theme Behavior Lifecycle Interactive Flow */}
      <div className="bg-[#020617] rounded-3xl border border-slate-800 p-6 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-slate-100 text-sm">Active Behavior Lifecycle State</h4>
          <span className="text-[10px] text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            REAL_TIME_SWAP_OCP_COMPLIANT
          </span>
        </div>

        <div className="flex items-center justify-between relative py-6 px-4">
          <div className="absolute h-[2px] w-full bg-slate-800 top-1/2 left-0 -translate-y-1/2" />
          
          <div className="z-10 bg-[#0F172A] border border-slate-700 p-3.5 rounded-2xl text-center w-36 shadow-md">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Default Class</div>
            <div className="text-xs font-bold text-slate-300 font-mono mt-0.5">LinearScaling</div>
          </div>

          <div className="z-10 bg-blue-600 border border-blue-400 p-4 rounded-2xl text-center w-40 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <div className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">Active Pattern</div>
            <div className="text-sm font-black text-white font-mono mt-0.5">{activeStrategy.name}</div>
          </div>

          <div className="z-10 bg-[#0F172A] border border-slate-700 p-3.5 rounded-2xl text-center w-36 shadow-md">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Registered Target</div>
            <div className="text-xs font-bold text-slate-300 font-mono mt-0.5">QuantumBuffer</div>
          </div>
        </div>
      </div>

      {/* Grid of Behavior Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allStrategies.map((strat) => {
          const isActive = strat.name === activeStrategy.name;

          return (
            <div
              key={strat.name}
              onClick={() => handleSelectStrategy(strat.name)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isActive
                  ? "bg-slate-900 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30"
                  : "bg-[#020617]/60 border-slate-800 hover:border-slate-700 hover:bg-[#020617]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-white">
                      {strat.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {strat.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pr-6 mt-1">
                    {strat.description}
                  </p>
                </div>

                {isActive && (
                  <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">
                  Interface: ITrafficHandlingStrategy
                </span>
                <span className={`font-semibold ${isActive ? "text-blue-400 font-bold" : "text-slate-400"}`}>
                  {isActive ? "ACTIVE AT RUNTIME" : "Click to Swap"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Open / Closed Principle Software Architecture Explanation */}
      <div className="bg-[#020617] rounded-2xl p-5 border border-slate-800 text-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-blue-400 flex items-center">
            <Code className="h-4 w-4 mr-2" />
            Open/Closed Principle (OCP) Verification Code Pattern
          </span>
          <span className="text-[10px] text-slate-500 font-mono">SOLID Architecture</span>
        </div>

        <pre className="font-mono text-[11px] text-slate-300 bg-[#0F172A] p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
{`// 1. OPEN FOR EXTENSION: Custom strategy implementation
export class CustomDynamicStrategy implements ITrafficHandlingStrategy {
  processRequests(incomingRps: number, currentMetrics: NodeMetrics) { ... }
}

// 2. CLOSED FOR MODIFICATION: Strategy Registry swaps classes at runtime
StrategyRegistry.getInstance().registerStrategy(new CustomDynamicStrategy(...));
StrategyRegistry.getInstance().setActiveStrategy("CustomDynamicStrategy");`}
        </pre>
      </div>

      {/* Register New Behavior Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <span>Register New Concrete Strategy Class</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleRegisterCustomStrategy} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Strategy Class Name (PascalCase)</label>
                <input
                  type="text"
                  required
                  value={newStrategyName}
                  onChange={(e) => setNewStrategyName(e.target.value)}
                  placeholder="e.g. EigenLayerRestakingStrategy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-cyan-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Behavior Class Description</label>
                <textarea
                  rows={2}
                  required
                  value={newStrategyDesc}
                  onChange={(e) => setNewStrategyDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Max RPS per Pod Worker</label>
                  <input
                    type="number"
                    value={maxRpsPod}
                    onChange={(e) => setMaxRpsPod(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Mempool Queue Policy</label>
                  <select
                    value={policy}
                    onChange={(e) => setPolicy(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="GAS_FEE_PRIORITY">Gas Fee Priority</option>
                    <option value="FIFO">FIFO Sequential</option>
                    <option value="DAPP_SLA_WEIGHTED">dApp SLA Weighted</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  <span>Instantiate & Activate Class</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
