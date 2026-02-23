import { API_BASE_URL } from "@/config/api";

// Possible health/ping endpoints to try
const PING_ENDPOINTS = [
  `${API_BASE_URL}/health`,
  `${API_BASE_URL}/ping`,
  `${API_BASE_URL}/api/health`,
  `${API_BASE_URL}/`,
];

let warmedUp = false;

export const warmupServer = async (): Promise<void> => {
  // Only run once per session
  if (warmedUp) return;
  warmedUp = true;

  // Try each endpoint silently — first one that responds wins
  for (const endpoint of PING_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        signal: AbortSignal.timeout(8000), // 8 second timeout
      });

      if (response.ok || response.status < 500) {
        console.log("[Warmup] Server is awake ✓");
        return;
      }
    } catch {
      // Try next endpoint silently
    }
  }

  // If no health endpoint exists, hit the base URL — any response means server is awake
  try {
    await fetch(API_BASE_URL, {
      method: "HEAD",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // Server might still be waking — that's fine, we tried
  }
};
