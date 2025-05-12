import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite"; // Removed serveStatic

const app = express();

// Middleware
app.use(cors({
  origin: "https://courses.dailybyte.xyz", // Replace with your actual Netlify URL
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Async setup
(async () => {
  const server = await registerRoutes(app);

  if (app.get("env") === "development") {
    await setupVite(app, server);
  }

  const port = process.env.PORT || 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  ).on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      const nextPort = parseInt(port.toString()) + 1;
      log(`Port ${port} is busy, trying ${nextPort}`);
      server.listen(nextPort, "0.0.0.0");
    } else {
      throw err;
    }
  });
})();

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  log(`Error ${status}: ${message}`);
  res.status(status).json({ message });
});
