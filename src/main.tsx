import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { warmupServer } from "./lib/warmup";

// Ping backend immediately when app loads
// so server is awake before user performs any action
warmupServer();

createRoot(document.getElementById("root")!).render(<App />);
