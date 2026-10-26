import { ITrafficHandlingStrategy } from "./TrafficStrategy";
import { NodeMetrics, RpcLog, StrategyMetrics } from "../types";

const DAPP_NAMES = [
  "Uniswap V4 Router",
  "Aave V3 Protocol",
  "OpenSea Seaport",
  "Lido Staking Hub",
  "Curve Finance Pool",
  "EigenLayer AVS Node",
  "Arbitrum Bridge Gateway",
  "Blur NFT Exchange",
  "Compound V3 Controller",
  "Base Sequencer Relay"
];

const RPC_METHODS = [
  "eth_sendRawTransaction",
  "eth_call",
  "eth_estimateGas",
  "eth_blockNumber",
  "eth_getLogs",
  "eth_getBalance"
];

function generateRpcLogs(count: number, strategyName: string, status: "CONFIRMED" | "QUEUED_AUTOSCALED" | "SHED_CIRCUIT_BREAKER", avgLatency: number): RpcLog[] {
  const logs: RpcLog[] = [];
  const limit = Math.min(count, 12);
  for (let i = 0; i < limit; i++) {
    const method = RPC_METHODS[Math.floor(Math.random() * RPC_METHODS.length)];
    const dApp = DAPP_NAMES[Math.floor(Math.random() * DAPP_NAMES.length)];
    const latency = Math.max(2, Math.round(avgLatency + (Math.random() * 8 - 4)));
    logs.push({
      id: "tx_" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      method,
      dAppOrigin: dApp,
      latencyMs: latency,
      status,
      handlingStrategy: strategyName,
      gasPriceGwei: Math.round(18 + Math.random() * 45)
    });
  }
  return logs;
}

/**
 * CONCRETE STRATEGY 1: AutoScalingGroupStrategy
 * Dynamically provisions cloud pod autoscaling groups to absorb sudden 100x traffic spikes
 * without dropping dApp transactions.
 */
export class AutoScalingGroupStrategy implements ITrafficHandlingStrategy {
  readonly name = "AutoScalingGroupStrategy";
  readonly description = "Cloud Auto-Scaling Pod Grouping: Spins up parallel cloud worker containers dynamically to absorb sudden dApp transaction surges with zero transaction drops.";
  readonly category = "AutoScaler" as const;

  processRequests(incomingRps: number, currentMetrics: NodeMetrics) {
    const podsNeeded = Math.min(currentMetrics.maxPods, Math.max(2, Math.ceil(incomingRps / 12)));
    const processedRps = incomingRps; // 100% processing capability due to cloud pod scaling
    const bufferedCount = Math.max(0, Math.floor(incomingRps * 0.05));
    const droppedCount = 0; // ZERO dropped transactions!
    const avgLatencyMs = Math.round(12 + (incomingRps / (podsNeeded * 10)) * 8);

    const strategyMetrics: StrategyMetrics = {
      processedRps,
      bufferedCount,
      droppedCount,
      podCount: podsNeeded,
      avgLatencyMs,
      cpuUsagePercent: Math.min(92, Math.round(25 + (incomingRps / podsNeeded) * 2.5)),
      memUsagePercent: Math.min(88, Math.round(30 + (podsNeeded / currentMetrics.maxPods) * 45))
    };

    const logs = generateRpcLogs(Math.min(8, Math.ceil(incomingRps / 10)), this.name, "CONFIRMED", avgLatencyMs);

    return {
      strategyMetrics,
      processedLogs: logs,
      recommendedPodScale: podsNeeded
    };
  }

  getExecutionTelemetry(): string {
    return "Cloud Auto-Scaling Group active: Elastic pod scaling active across Kubernetes/Cloud Run nodes. dApp request spikes absorbed smoothly without latency inflation.";
  }
}

/**
 * CONCRETE STRATEGY 2: PredictiveBurstStrategy
 * Uses machine learning / mempool depth prediction to pre-warm pod capacity and prioritize gas fees.
 */
export class PredictiveBurstStrategy implements ITrafficHandlingStrategy {
  readonly name = "PredictiveBurstStrategy";
  readonly description = "AI Predictive Burst Pre-provisioning: Pre-warms cloud pod clusters ahead of anticipated gas spikes and mempool surges.";
  readonly category = "AI-Predictive" as const;

  processRequests(incomingRps: number, currentMetrics: NodeMetrics) {
    // Pre-warms pods anticipating 1.5x traffic
    const targetPods = Math.min(currentMetrics.maxPods, Math.max(4, Math.ceil((incomingRps * 1.35) / 10)));
    const processedRps = incomingRps;
    const bufferedCount = Math.max(0, Math.floor(incomingRps * 0.02));
    const droppedCount = 0;
    const avgLatencyMs = Math.round(8 + (incomingRps / (targetPods * 12)) * 5);

    const strategyMetrics: StrategyMetrics = {
      processedRps,
      bufferedCount,
      droppedCount,
      podCount: targetPods,
      avgLatencyMs,
      cpuUsagePercent: Math.min(85, Math.round(20 + (incomingRps / targetPods) * 2)),
      memUsagePercent: Math.min(80, Math.round(35 + (targetPods / currentMetrics.maxPods) * 35))
    };

    const logs = generateRpcLogs(Math.min(8, Math.ceil(incomingRps / 10)), this.name, "CONFIRMED", avgLatencyMs);

    return {
      strategyMetrics,
      processedLogs: logs,
      recommendedPodScale: targetPods
    };
  }

  getExecutionTelemetry(): string {
    return "Predictive ML Model active: Pre-allocated 35% buffer headroom. Gas price priority sorting enabled for Ethereum mempool blocks.";
  }
}

/**
 * CONCRETE STRATEGY 3: CircuitBreakerStrategy
 * Resilience strategy that caps maximum pod allocation and applies dApp priority backpressure under extreme load.
 */
export class CircuitBreakerStrategy implements ITrafficHandlingStrategy {
  readonly name = "CircuitBreakerStrategy";
  readonly description = "Resilience Circuit Breaker: Enforces strict load thresholds, dApp rate-limiting SLA buckets, and backpressure isolation under extreme hardware saturation.";
  readonly category = "Resilience" as const;

  processRequests(incomingRps: number, currentMetrics: NodeMetrics) {
    const maxAllowedRps = 250;
    const processedRps = Math.min(incomingRps, maxAllowedRps);
    const overflow = Math.max(0, incomingRps - maxAllowedRps);
    const bufferedCount = Math.min(500, Math.floor(overflow * 0.7));
    const droppedCount = Math.max(0, overflow - bufferedCount);
    const podsNeeded = Math.min(24, Math.max(4, Math.ceil(processedRps / 10)));
    const avgLatencyMs = Math.round(35 + (processedRps / 10) * 1.2);

    const strategyMetrics: StrategyMetrics = {
      processedRps,
      bufferedCount,
      droppedCount,
      podCount: podsNeeded,
      avgLatencyMs,
      cpuUsagePercent: 95,
      memUsagePercent: 90
    };

    const logs = generateRpcLogs(
      6,
      this.name,
      droppedCount > 0 ? "SHED_CIRCUIT_BREAKER" : "QUEUED_AUTOSCALED",
      avgLatencyMs
    );

    return {
      strategyMetrics,
      processedLogs: logs,
      recommendedPodScale: podsNeeded
    };
  }

  getExecutionTelemetry(): string {
    return "Circuit Breaker engaged: Rate limits active on high-volume dApp origins. Core node RPC methods prioritized for block state synchronization.";
  }
}

/**
 * CONCRETE STRATEGY 4: StandardQueueStrategy
 * Baseline FIFO queue strategy for smooth steady-state traffic.
 */
export class StandardQueueStrategy implements ITrafficHandlingStrategy {
  readonly name = "StandardQueueStrategy";
  readonly description = "Standard Sequential FIFO Queue: Handles baseline steady-state dApp traffic with standard node pod allocations.";
  readonly category = "Queue" as const;

  processRequests(incomingRps: number, currentMetrics: NodeMetrics) {
    const podCount = Math.min(8, Math.max(1, Math.ceil(incomingRps / 15)));
    const processedRps = Math.min(incomingRps, podCount * 25);
    const bufferedCount = Math.max(0, incomingRps - processedRps);
    const droppedCount = 0;
    const avgLatencyMs = Math.round(18 + bufferedCount * 0.5);

    const strategyMetrics: StrategyMetrics = {
      processedRps,
      bufferedCount,
      droppedCount,
      podCount,
      avgLatencyMs,
      cpuUsagePercent: Math.min(85, Math.round(15 + (incomingRps / podCount) * 4)),
      memUsagePercent: Math.min(75, Math.round(25 + podCount * 5))
    };

    const logs = generateRpcLogs(5, this.name, "CONFIRMED", avgLatencyMs);

    return {
      strategyMetrics,
      processedLogs: logs,
      recommendedPodScale: podCount
    };
  }

  getExecutionTelemetry(): string {
    return "Standard FIFO Queue active: Operating at baseline network latency. Cloud auto-scale pods sitting in standard standby pool.";
  }
}

/**
 * DYNAMIC CUSTOM BEHAVIOR CLASS
 * Allows adding new strategy behavior classes at runtime (demonstrating Open/Closed Principle)
 */
export class CustomDynamicStrategy implements ITrafficHandlingStrategy {
  readonly name: string;
  readonly description: string;
  readonly category = "Custom-Extension" as const;

  private maxRpsPerPod: number;
  private priorityPolicy: string;

  constructor(name: string, description: string, maxRpsPerPod: number = 20, priorityPolicy: string = "GAS_FEE_PRIORITY") {
    this.name = name;
    this.description = description;
    this.maxRpsPerPod = maxRpsPerPod;
    this.priorityPolicy = priorityPolicy;
  }

  processRequests(incomingRps: number, currentMetrics: NodeMetrics) {
    const podsNeeded = Math.min(currentMetrics.maxPods, Math.max(2, Math.ceil(incomingRps / this.maxRpsPerPod)));
    const processedRps = incomingRps;
    const bufferedCount = Math.max(0, Math.floor(incomingRps * 0.01));
    const droppedCount = 0;
    const avgLatencyMs = Math.round(10 + (incomingRps / (podsNeeded * this.maxRpsPerPod)) * 6);

    const strategyMetrics: StrategyMetrics = {
      processedRps,
      bufferedCount,
      droppedCount,
      podCount: podsNeeded,
      avgLatencyMs,
      cpuUsagePercent: Math.min(88, Math.round(20 + (incomingRps / podsNeeded) * 2)),
      memUsagePercent: Math.min(82, Math.round(25 + (podsNeeded / currentMetrics.maxPods) * 40))
    };

    const logs = generateRpcLogs(6, this.name, "CONFIRMED", avgLatencyMs);

    return {
      strategyMetrics,
      processedLogs: logs,
      recommendedPodScale: podsNeeded
    };
  }

  getExecutionTelemetry(): string {
    return `Custom Plugin Strategy '${this.name}' active: Max ${this.maxRpsPerPod} RPS/pod limit with policy '${this.priorityPolicy}'. Open/Closed Principle extension verified.`;
  }
}
