import React, { useState } from "react";
import {
  X,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertOctagon,
  RefreshCw,
  Send,
  Lock,
  Download
} from "lucide-react";
import { WalletInfo } from "../types";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletInfo;
  onGenerateNewWallet: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onGenerateNewWallet,
}) => {
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [signedMessage, setSignedMessage] = useState<string>("");
  const [rawTxMessage, setRawTxMessage] = useState<string>("EVM Surge Node Mainnet Block Validation Signature");
  const [activeTab, setActiveTab] = useState<"EXPORT_KEY" | "MINING_YIELD" | "SIGN_TX">("EXPORT_KEY");

  if (!isOpen) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(wallet.privateKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSignTransaction = () => {
    if (!rawTxMessage) return;
    const mockSig = "0x" + Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setSignedMessage(mockSig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1E293B] border border-slate-700 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-[#020617]">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Mainnet Wallet & Private Key</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 font-bold">
                  EXPORTABLE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ethereum EVM Node Validator & Mining Yield Account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-700 bg-[#0F172A] px-6 pt-3 space-x-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab("EXPORT_KEY")}
            className={`pb-3 transition-colors border-b-2 cursor-pointer ${
              activeTab === "EXPORT_KEY"
                ? "border-blue-400 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Export Private Key
          </button>
          <button
            onClick={() => setActiveTab("MINING_YIELD")}
            className={`pb-3 transition-colors border-b-2 cursor-pointer ${
              activeTab === "MINING_YIELD"
                ? "border-blue-400 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Mining & Gas Yields
          </button>
          <button
            onClick={() => setActiveTab("SIGN_TX")}
            className={`pb-3 transition-colors border-b-2 cursor-pointer ${
              activeTab === "SIGN_TX"
                ? "border-blue-400 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Transaction Signer
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Mainnet Address Banner */}
          <div className="bg-[#020617] border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Public Ethereum Wallet Address</span>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">ERC-20 / EVM Mainnet</span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-[#0F172A] p-3 rounded-xl border border-slate-800 font-mono text-sm text-blue-400 break-all font-bold">
              <span>{wallet.address}</span>
              <button
                onClick={handleCopyAddress}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 transition-colors cursor-pointer shrink-0"
                title="Copy Address"
              >
                {copiedAddress ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {activeTab === "EXPORT_KEY" && (
            <div className="space-y-4">
              {/* Private Key Export Section */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <AlertOctagon className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Exportable Private Key Warning
                    </h3>
                    <p className="text-xs text-amber-200/80 leading-relaxed mt-1">
                      Never share your private key with unverified parties. Anyone holding this 64-character hex key possesses full control over this node address and mined ETH balances.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                      <Lock className="h-3.5 w-3.5 text-blue-400" />
                      <span>Exported Secret Private Key (64-char Hex)</span>
                    </label>
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="text-xs text-blue-400 hover:underline flex items-center space-x-1 cursor-pointer font-medium"
                    >
                      {showPrivateKey ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Hide Key</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          <span>Reveal Key</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPrivateKey ? "text" : "password"}
                      readOnly
                      value={wallet.privateKey}
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl p-3 text-xs font-mono text-blue-300 pr-12 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleCopyKey}
                      className="absolute right-2 top-2.5 p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Copy Private Key"
                    >
                      {copiedKey ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Public Key Display */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">ECDSA Uncompressed Public Key</label>
                <div className="bg-[#020617] border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-300 break-all">
                  {wallet.publicKey}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onGenerateNewWallet}
                  className="text-xs text-slate-400 hover:text-blue-300 flex items-center space-x-1.5 py-2.5 px-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer font-semibold"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Generate New Keypair</span>
                </button>

                <button
                  onClick={handleCopyKey}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Copy Private Key</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "MINING_YIELD" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Total Balance</span>
                  <span className="text-base font-bold text-cyan-300 font-mono">
                    {wallet.balanceEth.toFixed(4)} ETH
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Mined Rewards</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    +{wallet.minedEthTotal.toFixed(4)} ETH
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Staked (Validator)</span>
                  <span className="text-base font-bold text-indigo-400 font-mono">
                    {wallet.stakedEthTotal.toFixed(2)} ETH
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                <h4 className="font-semibold text-slate-200">Real-time Block Validation Rewards</h4>
                <p className="text-slate-400 leading-relaxed">
                  As the EVM Surge Node validates Ethereum mainnet blocks and absorbs dApp request surges, priority MEV tips and gas transaction fees accumulate directly into this exported wallet address.
                </p>
              </div>
            </div>
          )}

          {activeTab === "SIGN_TX" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-medium">Payload / Raw Hex Transaction Message</label>
                <textarea
                  value={rawTxMessage}
                  onChange={(e) => setRawTxMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <button
                onClick={handleSignTransaction}
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Sign Message with Private Key</span>
              </button>

              {signedMessage && (
                <div className="space-y-1 bg-slate-950 border border-emerald-500/30 rounded-xl p-3">
                  <span className="text-[10px] text-emerald-400 font-bold block">ECDSA Signature Output (secp256k1):</span>
                  <div className="font-mono text-[10px] text-slate-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
                    {signedMessage}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
