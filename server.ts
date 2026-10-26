import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Server-side Gemini initialization
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    network: "Ethereum Mainnet (EVM Surge Node)",
    version: "2.4.0-auto-scale",
  });
});

// AI Traffic Governor Endpoint
app.post("/api/ai-traffic-governor", async (req, res) => {
  try {
    const { metrics, activeStrategy, privacySettings } = req.body;

    // Check privacy settings
    if (privacySettings?.mode === "OFFLINE_LOCAL") {
      return res.json({
        recommendedStrategy: determineLocalFallbackStrategy(metrics),
        targetPods: Math.min(64, Math.ceil((metrics.rps || 10) / 15)),
        mempoolOptimizations: [
          "Zero-Knowledge Mode Active: Heuristic local rate smoothing applied.",
          "Local mempool priority boost for gas fees > 35 Gwei.",
        ],
        reasoning: "Local Heuristic Engine active due to Strict Offline Privacy policy.",
        aiConfidence: 0.98,
        modeUsed: "LOCAL_PRIVACY_HEURISTIC",
      });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.json({
        recommendedStrategy: determineLocalFallbackStrategy(metrics),
        targetPods: Math.min(64, Math.ceil((metrics.rps || 10) / 15)),
        mempoolOptimizations: [
          "Auto-scaled pod allocation tuned to load peak.",
          "Dynamic gas fee queueing enabled for dApp transaction throughput.",
        ],
        reasoning: "Standard Auto-Scaler local engine active (AI key standby mode).",
        aiConfidence: 0.95,
        modeUsed: "LOCAL_AUTO_SCALER",
      });
    }

    const prompt = `
You are the AI Traffic Governor for an Ethereum EVM High-Throughput Mainnet Node.
Analyze the following node traffic & performance metrics:
- Current Requests Per Second (RPS): ${metrics.rps}
- Peak dApp Traffic Surge Multiplier: ${metrics.surgeMultiplier}x
- Average Processing Latency: ${metrics.latencyMs}ms
- Mempool Pending Transactions: ${metrics.mempoolDepth}
- Cloud Auto-Scale Pod Count: ${metrics.podCount} / ${metrics.maxPods}
- Current Active Handling Strategy: "${activeStrategy}"
- User Privacy Level: "${privacySettings?.level || "STANDARD_ANONYMIZED"}"

Determine the optimal traffic-handling Strategy Pattern behavior class to activate:
Options:
1. "AutoScalingGroupStrategy" (Best for massive RPS surges & dApp traffic spikes without dropping transactions)
2. "PredictiveBurstStrategy" (Best when mempool depth is surging or gas spikes predicted)
3. "CircuitBreakerStrategy" (Best when hardware or RPC backpressure is above 90% load)
4. "StandardQueueStrategy" (Best for normal baseline traffic)

Return a strict JSON object with:
{
  "recommendedStrategy": "StrategyClassName",
  "targetPods": number,
  "mempoolOptimizations": ["string1", "string2"],
  "reasoning": "brief 1-2 sentence engineering explanation",
  "aiConfidence": number (0.0 to 1.0)
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const result = JSON.parse(jsonText);

    res.json({
      ...result,
      modeUsed: "GEMINI_AI_HYPER_GOVERNOR",
    });
  } catch (error: any) {
    console.error("AI Governor error:", error);
    res.status(500).json({
      error: "Failed to run AI Traffic Governor",
      details: error.message,
      recommendedStrategy: "AutoScalingGroupStrategy",
      targetPods: 32,
      mempoolOptimizations: [
        "Fallback Auto-Scale activated",
        "Buffered dApp burst queue engaged",
      ],
      reasoning: "Switched to fail-safe cluster scaling strategy.",
      aiConfidence: 0.9,
      modeUsed: "FAILSAFE_FALLBACK",
    });
  }
});

function determineLocalFallbackStrategy(metrics: any) {
  const rps = metrics.rps || 0;
  if (rps > 150) return "AutoScalingGroupStrategy";
  if (rps > 75) return "PredictiveBurstStrategy";
  if (metrics.latencyMs > 250) return "CircuitBreakerStrategy";
  return "StandardQueueStrategy";
}

// Simulated JSON-RPC Ethereum endpoint for live dApp requests
app.post("/api/rpc-proxy", (req, res) => {
  const { method, params, id } = req.body;
  const currentBlockHex = "0x" + Math.floor(21500000 + Date.now() / 12000).toString(16);

  switch (method) {
    case "eth_blockNumber":
      return res.json({ jsonrpc: "2.0", id: id || 1, result: currentBlockHex });
    case "eth_gasPrice":
      return res.json({ jsonrpc: "2.0", id: id || 1, result: "0x" + Math.floor(18000000000 + Math.random() * 5000000000).toString(16) });
    case "eth_sendRawTransaction":
      return res.json({
        jsonrpc: "2.0",
        id: id || 1,
        result: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      });
    default:
      return res.json({
        jsonrpc: "2.0",
        id: id || 1,
        result: "0x0000000000000000000000000000000000000000000000000000000000000001",
      });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EVM Surge Node] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
