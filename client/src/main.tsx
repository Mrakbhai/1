import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { applyTheme } from "./lib/theme";

// Apply saved theme on initial load
applyTheme();

createRoot(document.getElementById("root")!).render(<App />);
