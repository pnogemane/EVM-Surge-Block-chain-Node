import { StrategyRegistry } from "../strategies/TrafficStrategy";
import {
  AutoScalingGroupStrategy,
  PredictiveBurstStrategy,
  CircuitBreakerStrategy,
  StandardQueueStrategy
} from "../strategies/ConcreteStrategies";
import {
  NodeMetrics,
  WalletInfo,
  RpcLog,
  PrivacySettings,
  AIRecommendation,
  StrategyMetrics
} from "../types";

export class NodeEngine {
  private static instance: NodeEngine;

  private listeners: Set<() => void> = new Set();

  private wallet: WalletInfo = {
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    privateKey: "0x4a9e8832a81907711d9f8c092281a1d90481284a1e9010091873645129c1d09e",
    publicKey: "0x04bf12a9918237194ab92019481bca019d881029381726d1829038d10928a01f",
    balanceEth: 14.825,
    minedEthTotal: 4.825,
    stakedEthTotal: 32.00,
    nonce: 142,
    createdAt: new Date().toISOString(),
  };

  private metrics: NodeMetrics = {
    rps: 12,
    peakRps: 12,
    surgeMultiplier: 1.0,
    latencyMs: 14,
    mempoolDepth: 18,
    activePods: 2,
    maxPods: 64,
    totalTransactionsProcessed: 84920,
    totalMinedEth: 4.825,
    blockHeight: 21589302,
    gasPriceGwei: 22,
    uptimeSeconds: 14280,
    healthStatus: "HEALTHY_OPTIMAL",
  };

  private privacySettings: PrivacySettings = {
    level: "ANONYMIZED_TELEMETRY",
    mode: "GEMINI_CLOUD_AI",
    anonymizeIp: true,
    encryptMempoolLogs: true,
    retentionHours: 24,
  };

  private rpcLogs: RpcLog[] = [];
  private aiRecommendationHistory: AIRecommendation[] = [];

  private isRunning: boolean = false;
  private intervalId: any = null;
  private isAiPolling: boolean = false;

  private currentStrategyMetrics: StrategyMetrics = {
    processedRps: 12,
    bufferedCount: 0,
    droppedCount: 0,
    podCount: 2,
    avgLatencyMs: 14,
    cpuUsagePercent: 18,
    memUsagePercent: 24,
  };

  private constructor() {
    this.initializeStrategies();
    this.startEngine();
  }

  public static getInstance(): NodeEngine {
    if (!NodeEngine.instance) {
      NodeEngine.instance = new NodeEngine();
    }
    return NodeEngine.instance;
  }

  private initializeStrategies(): void {
    const registry = StrategyRegistry.getInstance();
    registry.registerStrategy(new AutoScalingGroupStrategy());
    registry.registerStrategy(new PredictiveBurstStrategy());
    registry.registerStrategy(new CircuitBreakerStrategy());
    registry.registerStrategy(new StandardQueueStrategy());
    registry.setActiveStrategy("AutoScalingGroupStrategy");
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  private startEngine(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      this.tick();
    }, 2000);
  }

  private tick(): void {
    // 1. Advance block height & time
    this.metrics.uptimeSeconds += 2;
    if (Math.random() > 0.6) {
      this.metrics.blockHeight += 1;
      // Mining reward calculation (Block reward 2.0 ETH + priority gas fee)
      const blockReward = 0.012 + Math.random() * 0.008;
      this.metrics.totalMinedEth += blockReward;
      this.wallet.minedEthTotal += blockReward;
      this.wallet.balanceEth += blockReward;
    }

    // Fluctuate gas price
    this.metrics.gasPriceGwei = Math.max(12, Math.round(this.metrics.gasPriceGwei + (Math.random() * 4 - 2)));

    // Decay surge multiplier gradually back to baseline if user isn't actively bursting
    if (this.metrics.surgeMultiplier > 1.0) {
      this.metrics.surgeMultiplier = Math.max(1.0, Number((this.metrics.surgeMultiplier * 0.88).toFixed(2)));
    }

    // Determine target incoming RPS
    const baseRps = 10 + Math.floor(Math.random() * 8);
    const effectiveRps = Math.round(baseRps * this.metrics.surgeMultiplier);
    this.metrics.rps = effectiveRps;
    if (effectiveRps > this.metrics.peakRps) {
      this.metrics.peakRps = effectiveRps;
    }

    // 2. Process traffic using Active Strategy Behavior Class
    const registry = StrategyRegistry.getInstance();
    const activeStrategy = registry.getActiveStrategy();
    const result = activeStrategy.processRequests(effectiveRps, this.metrics);

    this.currentStrategyMetrics = result.strategyMetrics;
    this.metrics.activePods = result.strategyMetrics.podCount;
    this.metrics.latencyMs = result.strategyMetrics.avgLatencyMs;
    this.metrics.mempoolDepth = Math.max(2, result.strategyMetrics.bufferedCount + Math.floor(Math.random() * 10));
    this.metrics.totalTransactionsProcessed += result.strategyMetrics.processedRps * 2;

    // Update Health Status
    if (result.strategyMetrics.droppedCount > 0) {
      this.metrics.healthStatus = "CRITICAL_PRESSURE";
    } else if (result.strategyMetrics.podCount > 16 || this.metrics.surgeMultiplier > 5) {
      this.metrics.healthStatus = "HIGH_LOAD_AUTOSCALING";
    } else {
      this.metrics.healthStatus = "HEALTHY_OPTIMAL";
    }

    // Prepend RPC logs
    if (result.processedLogs.length > 0) {
      this.rpcLogs = [...result.processedLogs, ...this.rpcLogs].slice(0, 50);
    }

    this.notify();
  }

  /**
   * Trigger a dApp Traffic Spike (e.g. 10x, 50x, 100x surge)
   */
  public triggerTrafficSpike(multiplier: number): void {
    this.metrics.surgeMultiplier = multiplier;
    this.tick();
    
    // Auto query AI Governor when a major spike occurs
    if (multiplier >= 10 && !this.isAiPolling) {
      this.queryAiGovernor();
    }
  }

  /**
   * Query Gemini AI Traffic Governor to evaluate metrics & swap strategies if needed
   */
  public async queryAiGovernor(): Promise<AIRecommendation | null> {
    if (this.isAiPolling) return null;
    this.isAiPolling = true;
    this.notify();

    try {
      const activeStrategy = StrategyRegistry.getInstance().getActiveStrategy().name;
      const response = await fetch("/api/ai-traffic-governor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics: this.metrics,
          activeStrategy,
          privacySettings: this.privacySettings,
        }),
      });

      const data = await response.json();
      const rec: AIRecommendation = {
        recommendedStrategy: data.recommendedStrategy || "AutoScalingGroupStrategy",
        targetPods: data.targetPods || 32,
        mempoolOptimizations: data.mempoolOptimizations || ["Elastic auto-scaling engaged"],
        reasoning: data.reasoning || "AI Governor tuned cluster pods for burst spike.",
        aiConfidence: data.aiConfidence || 0.96,
        modeUsed: data.modeUsed || "GEMINI_AI_HYPER_GOVERNOR",
        timestamp: new Date().toLocaleTimeString(),
      };

      this.aiRecommendationHistory = [rec, ...this.aiRecommendationHistory].slice(0, 10);

      // Auto-advance/swap strategy if AI recommends a new strategy class
      if (rec.recommendedStrategy && rec.recommendedStrategy !== activeStrategy) {
        const registry = StrategyRegistry.getInstance();
        if (registry.getStrategy(rec.recommendedStrategy)) {
          registry.setActiveStrategy(rec.recommendedStrategy);
        }
      }

      this.isAiPolling = false;
      this.notify();
      return rec;
    } catch (err) {
      console.error("AI Governor call failed:", err);
      this.isAiPolling = false;
      this.notify();
      return null;
    }
  }

  // Getters & Setters
  public getWallet(): WalletInfo {
    return { ...this.wallet };
  }

  public exportPrivateKey(): string {
    return this.wallet.privateKey;
  }

  public generateNewWallet(): WalletInfo {
    const randomHex = () => Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const randomKey = () => Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    
    this.wallet = {
      address: "0x" + randomHex(),
      privateKey: "0x" + randomKey(),
      publicKey: "0x04" + randomHex() + randomHex().substring(0, 24),
      balanceEth: 10.0,
      minedEthTotal: 0.0,
      stakedEthTotal: 32.0,
      nonce: 0,
      createdAt: new Date().toISOString(),
    };
    this.notify();
    return this.getWallet();
  }

  public getMetrics(): NodeMetrics {
    return { ...this.metrics };
  }

  public getStrategyMetrics(): StrategyMetrics {
    return { ...this.currentStrategyMetrics };
  }

  public getPrivacySettings(): PrivacySettings {
    return { ...this.privacySettings };
  }

  public updatePrivacySettings(settings: Partial<PrivacySettings>): void {
    this.privacySettings = { ...this.privacySettings, ...settings };
    this.notify();
  }

  public getRpcLogs(): RpcLog[] {
    return [...this.rpcLogs];
  }

  public getAiRecommendations(): AIRecommendation[] {
    return [...this.aiRecommendationHistory];
  }

  public isAiLoading(): boolean {
    return this.isAiPolling;
  }
}
