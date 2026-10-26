import React from "react";
import {
  Activity,
  Cpu,
  Shield,
  Wallet,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Zap
} from "lucide-react";
import { NodeMetrics, WalletInfo } from "../types";
import { StrategyRegistry } from "../strategies/TrafficStrategy";

interface NavbarProps {
  metrics: NodeMetrics;
  wallet: WalletInfo;
  onOpenWallet: () => void;
  onOpenApk: () => void;
  onTriggerAiGovernor: () => void;
  isAiLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  metrics,
  wallet,
  onOpenWallet,
  onOpenApk,
  onTriggerAiGovernor,
  isAiLoading,
}) => {
  const activeStrategy = StrategyRegistry.getInstance().getActiveStrategy();

  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 bg-[#020617] shrink-0 text-slate-100 z-30">
      {/* Network ID & Status */}
      <div className="flex items-center space-x-3">
        <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">
          MAINNET_ORBITAL_01
        </span>
        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-bold flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Connected</span>
        </span>
      </div>

      {/* Right Header Stats & Controls */}
      <div className="flex items-center space-x-3 md:space-x-5">
        {/* Gas Price */}
        <div className="text-right hidden sm:block">
          <div className="text-[10px] text-slate-500 uppercase tracking-tighter font-semibold">
            Gas Price
          </div>
          <div className="text-xs md:text-sm font-mono text-slate-200 font-bold">
            {metrics.gasPriceGwei.toFixed(1)} Gwei
          </div>
        </div>

        {/* Pod Status Pill */}
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-lg px-2.5 py-1 hidden lg:flex items-center space-x-2 text-xs">
          <Activity className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-slate-400 text-[11px]">Pods:</span>
          <span className="font-mono text-blue-400 font-bold">
            {metrics.activePods} / {metrics.maxPods}
          </span>
        </div>

        {/* Strategy Badge */}
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-lg px-2.5 py-1 hidden xl:flex items-center space-x-2 text-xs">
          <Cpu className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-mono text-indigo-300 font-semibold text-[11px]">
            {activeStrategy.name}
          </span>
        </div>

        {/* AI Governor Action */}
        <button
          onClick={onTriggerAiGovernor}
          disabled={isAiLoading}
          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Shield className={`h-3.5 w-3.5 text-blue-400 ${isAiLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isAiLoading ? "Analyzing..." : "AI Governor"}</span>
        </button>

        {/* Wallet Pill Button */}
        <button
          onClick={onOpenWallet}
          className="bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs px-3 py-1.5 rounded-xl font-bold border border-white/10 shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
        >
          <Wallet className="h-3.5 w-3.5" />
          <span className="font-mono hidden sm:inline">
            {wallet.address.substring(0, 6)}...{wallet.address.substring(38)}
          </span>
          <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] text-blue-200 font-extrabold">
            {wallet.balanceEth.toFixed(2)} ETH
          </span>
        </button>

        {/* APK Dispatch */}
        <button
          onClick={onOpenApk}
          className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer md:hidden"
          title="Download Android APK"
        >
          <Smartphone className="h-4 w-4 text-emerald-400" />
        </button>
      </div>
    </header>
  );
};
