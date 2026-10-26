import React, { useState } from "react";
import { Terminal, Shield, CheckCircle, Search, Filter } from "lucide-react";
import { RpcLog } from "../types";

interface RpcTerminalProps {
  logs: RpcLog[];
}

export const RpcTerminal: React.FC<RpcTerminalProps> = ({ logs }) => {
  const [filterMethod, setFilterMethod] = useState<string>("ALL");

  const filteredLogs = filterMethod === "ALL"
    ? logs
    : logs.filter((log) => log.method === filterMethod);

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Live Ethereum dApp RPC Request Terminal</span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time incoming dApp transaction streams absorbed by Strategy Pattern pod groups
            </p>
          </div>
        </div>

        {/* Filter dropdown */}
        <div className="flex items-center space-x-2 bg-[#020617] px-3 py-1.5 rounded-xl border border-slate-800">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="bg-transparent text-xs text-slate-300 font-mono focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-[#020617] text-white">All RPC Methods</option>
            <option value="eth_sendRawTransaction" className="bg-[#020617] text-white">eth_sendRawTransaction</option>
            <option value="eth_call" className="bg-[#020617] text-white">eth_call</option>
            <option value="eth_estimateGas" className="bg-[#020617] text-white">eth_estimateGas</option>
            <option value="eth_blockNumber" className="bg-[#020617] text-white">eth_blockNumber</option>
          </select>
        </div>
      </div>

      {/* Terminal View Table */}
      <div className="bg-[#020617] rounded-2xl border border-slate-800 overflow-hidden">
        <div className="max-h-80 overflow-y-auto font-mono text-xs divide-y divide-slate-800/80">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Listening for incoming dApp JSON-RPC calls...
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 hover:bg-slate-900/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-slate-500 text-[10px] shrink-0 font-bold">{log.timestamp}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-bold shrink-0">
                    {log.method}
                  </span>
                  <span className="text-slate-200 font-semibold truncate max-w-[200px]">
                    {log.dAppOrigin}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-slate-400">
                    <span className="text-slate-500">Strategy: </span>
                    <span className="text-blue-400 font-bold">{log.handlingStrategy}</span>
                  </span>

                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    {log.status}
                  </span>

                  <span className="text-slate-400 font-mono shrink-0">
                    {log.latencyMs}ms
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
