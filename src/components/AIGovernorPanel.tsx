import React, { useState } from "react";
import {
  Shield,
  Bot,
  Lock,
  EyeOff,
  Cpu,
  RefreshCcw,
  Sparkles,
  Check,
  AlertCircle,
  Sliders,
  ChevronRight
} from "lucide-react";
import { NodeMetrics, PrivacySettings, AIRecommendation } from "../types";

interface AIGovernorPanelProps {
  metrics: NodeMetrics;
  privacySettings: PrivacySettings;
  recommendations: AIRecommendation[];
  isAiLoading: boolean;
  onRunAiGovernor: () => void;
  onUpdatePrivacy: (settings: Partial<PrivacySettings>) => void;
}

export const AIGovernorPanel: React.FC<AIGovernorPanelProps> = ({
  metrics,
  privacySettings,
  recommendations,
  isAiLoading,
  onRunAiGovernor,
  onUpdatePrivacy,
}) => {
  const [activeTab, setActiveTab] = useState<"AI_GOVERNOR" | "PRIVACY_SETTINGS">("AI_GOVERNOR");

  const latestRec = recommendations[0];

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 space-y-6 shadow-sm">
      {/* Header & Mode Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>AI Traffic Governor & ML Privacy Guard</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono border border-blue-500/20 font-bold">
                GEMINI 3.6
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous machine learning optimization & privacy-preserving telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-[#020617] p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("AI_GOVERNOR")}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === "AI_GOVERNOR"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            AI Governor
          </button>
          <button
            onClick={() => setActiveTab("PRIVACY_SETTINGS")}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              activeTab === "PRIVACY_SETTINGS"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Lock className="h-3.5 w-3.5 mr-1" />
            <span>Privacy Controls</span>
          </button>
        </div>
      </div>

      {activeTab === "AI_GOVERNOR" ? (
        <div className="space-y-4">
          {/* AI Trigger Action & Engine Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#020617] p-4 rounded-2xl border border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">
                Active Optimization Engine Mode
              </span>
              <span className="text-xs text-blue-300 font-mono flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {privacySettings.mode === "GEMINI_CLOUD_AI"
                    ? "Gemini 3.6 Flash Server-Side Governor"
                    : "Strict Offline Local ML Heuristic Engine"}
                </span>
              </span>
            </div>

            <button
              onClick={onRunAiGovernor}
              disabled={isAiLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`h-4 w-4 ${isAiLoading ? "animate-spin" : ""}`} />
              <span>{isAiLoading ? "Evaluating Traffic..." : "Evaluate & Advance Strategy"}</span>
            </button>
          </div>

          {/* Latest Recommendation Panel */}
          {latestRec ? (
            <div className="bg-[#020617] rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Latest AI Traffic Recommendation</span>
                <span className="text-blue-400 font-mono text-[11px] font-bold">{latestRec.timestamp}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#0F172A] p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[11px] block font-medium">Advancing Strategy</span>
                  <span className="font-mono text-blue-400 font-bold text-sm">
                    {latestRec.recommendedStrategy}
                  </span>
                </div>

                <div className="bg-[#0F172A] p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[11px] block font-medium">Target Pod Cluster Scale</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    {latestRec.targetPods} Pods
                  </span>
                </div>

                <div className="bg-[#0F172A] p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[11px] block font-medium">AI Confidence Score</span>
                  <span className="font-mono text-indigo-300 font-bold text-sm">
                    {(latestRec.aiConfidence * 100).toFixed(0)}% Match
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-slate-300">AI Reasoning:</span>
                <p className="text-xs text-slate-300 bg-[#0F172A] p-3.5 rounded-xl border border-slate-800 leading-relaxed font-mono">
                  {latestRec.reasoning}
                </p>
              </div>

              {latestRec.mempoolOptimizations.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Mempool & Auto-Scaling Directives:
                  </span>
                  <ul className="space-y-1">
                    {latestRec.mempoolOptimizations.map((opt, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-emerald-300/90 flex items-center space-x-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 font-mono"
                      >
                        <ChevronRight className="h-3 w-3 shrink-0" />
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#020617] p-8 rounded-2xl border border-slate-800 text-center space-y-2">
              <Bot className="h-8 w-8 text-blue-400 mx-auto opacity-60" />
              <p className="text-xs text-slate-400">
                Click "Evaluate & Advance Strategy" above to run Gemini AI Traffic Governor analysis.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Machine Learning Privacy Settings Tab */
        <div className="space-y-4 text-xs">
          <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Machine Learning & Telemetry Privacy Architecture</span>
            </h4>

            {/* AI Engine Mode Toggle */}
            <div className="space-y-2">
              <label className="text-slate-300 font-semibold block">AI Execution Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onUpdatePrivacy({ mode: "GEMINI_CLOUD_AI" })}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    privacySettings.mode === "GEMINI_CLOUD_AI"
                      ? "bg-blue-600/20 border-blue-500 text-blue-200 ring-1 ring-blue-500/30"
                      : "bg-[#0F172A] border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold text-xs text-white">Gemini Cloud AI Mode</div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Uses Gemini 3.6 Flash for intelligent predictive traffic governor
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdatePrivacy({ mode: "OFFLINE_LOCAL" })}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    privacySettings.mode === "OFFLINE_LOCAL"
                      ? "bg-blue-600/20 border-blue-500 text-blue-200 ring-1 ring-blue-500/30"
                      : "bg-[#0F172A] border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold text-xs text-white">Strict Offline Local ML</div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Uses zero-external network heuristic rule engine locally
                  </p>
                </button>
              </div>
            </div>

            {/* Privacy Level */}
            <div className="space-y-2">
              <label className="text-slate-300 font-semibold block">Privacy Isolation Level</label>
              <select
                value={privacySettings.level}
                onChange={(e) => onUpdatePrivacy({ level: e.target.value as any })}
                className="w-full bg-[#0F172A] border border-slate-800 rounded-xl p-3 text-slate-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="STRICT_ZERO_KNOWLEDGE">Strict Zero-Knowledge (No dApp origin tracking)</option>
                <option value="ANONYMIZED_TELEMETRY">Anonymized Telemetry (Standard Production Default)</option>
                <option value="FULL_AI_CLOUD_OPTIMIZATION">Full AI Cloud Optimization (Maximum Throughput Tuning)</option>
              </select>
            </div>

            {/* Toggle Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center space-x-3 bg-[#0F172A] p-3.5 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.anonymizeIp}
                  onChange={(e) => onUpdatePrivacy({ anonymizeIp: e.target.checked })}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">IP Masking</span>
                  <span className="text-[10px] text-slate-400">Anonymize RPC peer addresses</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 bg-[#0F172A] p-3.5 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.encryptMempoolLogs}
                  onChange={(e) => onUpdatePrivacy({ encryptMempoolLogs: e.target.checked })}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Mempool Encryption</span>
                  <span className="text-[10px] text-slate-400">AES-256 in-memory tx log buffers</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
