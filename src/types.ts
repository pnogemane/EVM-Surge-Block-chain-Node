export interface WalletInfo {
  address: string;
  privateKey: string;
  publicKey: string;
  balanceEth: number;
  minedEthTotal: number;
  stakedEthTotal: number;
  nonce: number;
  createdAt: string;
}

export type StrategyType = 
  | "AutoScalingGroupStrategy"
  | "StandardQueueStrategy"
  | "CircuitBreakerStrategy"
  | "PredictiveBurstStrategy"
  | string;

export interface StrategyMetrics {
  processedRps: number;
  bufferedCount: number;
  droppedCount: number;
  podCount: number;
  avgLatencyMs: number;
  cpuUsagePercent: number;
  memUsagePercent: number;
}

export interface NodeMetrics {
  rps: number;
  peakRps: number;
  surgeMultiplier: number;
  latencyMs: number;
  mempoolDepth: number;
  activePods: number;
  maxPods: number;
  totalTransactionsProcessed: number;
  totalMinedEth: number;
  blockHeight: number;
  gasPriceGwei: number;
  uptimeSeconds: number;
  healthStatus: "HEALTHY_OPTIMAL" | "HIGH_LOAD_AUTOSCALING" | "CRITICAL_PRESSURE";
}

export interface PrivacySettings {
  level: "STRICT_ZERO_KNOWLEDGE" | "ANONYMIZED_TELEMETRY" | "FULL_AI_CLOUD_OPTIMIZATION";
  mode: "GEMINI_CLOUD_AI" | "OFFLINE_LOCAL";
  anonymizeIp: boolean;
  encryptMempoolLogs: boolean;
  retentionHours: number;
}

export interface RpcLog {
  id: string;
  timestamp: string;
  method: string;
  dAppOrigin: string;
  latencyMs: number;
  status: "CONFIRMED" | "QUEUED_AUTOSCALED" | "SHED_CIRCUIT_BREAKER";
  handlingStrategy: string;
  gasPriceGwei: number;
}

export interface AIRecommendation {
  recommendedStrategy: StrategyType;
  targetPods: number;
  mempoolOptimizations: string[];
  reasoning: string;
  aiConfidence: number;
  modeUsed: string;
  timestamp: string;
}

export interface CustomStrategyConfig {
  name: string;
  description: string;
  maxRpsPerPod: number;
  priorityPolicy: "FIFO" | "GAS_FEE_PRIORITY" | "DAPP_SLA_WEIGHTED";
  circuitBreakerThresholdMs: number;
  codeSnippet: string;
  addedAt: string;
}
