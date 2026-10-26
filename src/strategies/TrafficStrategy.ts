import { NodeMetrics, RpcLog, StrategyMetrics } from "../types";

/**
 * STRATEGY PATTERN INTERFACE
 * Each concrete traffic handling class implements this interface to govern
 * how dApp traffic spikes are absorbed, queued, or distributed across auto-scaling cloud pod groups.
 */
export interface ITrafficHandlingStrategy {
  readonly name: string;
  readonly description: string;
  readonly category: "AutoScaler" | "Queue" | "Resilience" | "AI-Predictive" | "Custom-Extension";
  
  /**
   * Process incoming dApp request surges
   */
  processRequests(
    incomingRps: number,
    currentMetrics: NodeMetrics
  ): {
    strategyMetrics: StrategyMetrics;
    processedLogs: RpcLog[];
    recommendedPodScale: number;
  };

  /**
   * Explain current operational behavior under load
   */
  getExecutionTelemetry(): string;
}

/**
 * OPEN / CLOSED PRINCIPLE STRATEGY REGISTRY
 * Open for extension (register new strategy behavior classes at runtime without modifying code)
 * Closed for modification (the core node engine executes strategy interfaces abstractly).
 */
export class StrategyRegistry {
  private static instance: StrategyRegistry;
  private strategies: Map<string, ITrafficHandlingStrategy> = new Map();
  private activeStrategyName: string = "AutoScalingGroupStrategy";

  private constructor() {}

  public static getInstance(): StrategyRegistry {
    if (!StrategyRegistry.instance) {
      StrategyRegistry.instance = new StrategyRegistry();
    }
    return StrategyRegistry.instance;
  }

  /**
   * Register a new behavior class (Satisfies Open/Closed Principle)
   */
  public registerStrategy(strategy: ITrafficHandlingStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }

  public getStrategy(name: string): ITrafficHandlingStrategy | undefined {
    return this.strategies.get(name);
  }

  public getAllStrategies(): ITrafficHandlingStrategy[] {
    return Array.from(this.strategies.values());
  }

  public setActiveStrategy(name: string): boolean {
    if (this.strategies.has(name)) {
      this.activeStrategyName = name;
      return true;
    }
    return false;
  }

  public getActiveStrategy(): ITrafficHandlingStrategy {
    const strategy = this.strategies.get(this.activeStrategyName);
    if (!strategy) {
      // Fallback
      return Array.from(this.strategies.values())[0];
    }
    return strategy;
  }
}
