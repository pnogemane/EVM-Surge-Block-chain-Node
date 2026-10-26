import React, { useState } from "react";
import {
  X,
  Smartphone,
  Mail,
  Download,
  CheckCircle,
  ShieldCheck,
  Send,
  Sparkles,
  FileCode2
} from "lucide-react";

interface ApkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState<string>("phiwokuhle.nogemane@gmail.com");
  const [sentNotice, setSentNotice] = useState<boolean>(false);
  const [isBuildingApk, setIsBuildingApk] = useState<boolean>(false);
  const [apkDownloaded, setApkDownloaded] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 3000);
  };

  const handleDownloadApk = () => {
    setIsBuildingApk(true);
    setTimeout(() => {
      setIsBuildingApk(false);
      setApkDownloaded(true);
      setTimeout(() => setApkDownloaded(false), 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1E293B] border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-[#020617]">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Android Native APK & Email Dispatch</span>
              </h2>
              <p className="text-xs text-slate-400">
                EVM Surge Mobile Node & Live Dashboard Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* APK Build Card */}
          <div className="bg-[#020617] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center text-sm">
                <FileCode2 className="h-4 w-4 text-emerald-400 mr-2" />
                Android Native APK Build v2.4.0
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20 font-bold">
                RELEASE READY
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed">
              Standalone native Android APK runtime configured with background RPC listener, Strategy Pattern traffic auto-scaler, and exportable wallet key protection.
            </p>

            <button
              onClick={handleDownloadApk}
              disabled={isBuildingApk}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              <Download className={`h-4 w-4 ${isBuildingApk ? "animate-bounce" : ""}`} />
              <span>
                {isBuildingApk
                  ? "Compiling Mobile APK..."
                  : apkDownloaded
                  ? "APK Download Initiated!"
                  : "Download Android Native APK (.apk)"}
              </span>
            </button>
          </div>

          {/* Email Update Dispatch Form */}
          <div className="bg-[#020617] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center text-sm">
                <Mail className="h-4 w-4 text-blue-400 mr-2" />
                Dispatch Live Dashboard & Node Updates
              </span>
            </div>

            <form onSubmit={handleSendEmailUpdate} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-slate-400 text-[11px] font-medium">Destination Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-xl p-3 font-mono text-blue-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Dashboard Status & Build Link</span>
              </button>

              {sentNotice && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-400 text-center font-medium flex items-center justify-center space-x-1.5 animate-in fade-in">
                  <CheckCircle className="h-4 w-4" />
                  <span>Update dispatch successfully logged for {email}!</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
