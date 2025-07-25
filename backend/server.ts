import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scanRoutes from "./routes/scan.routes.js";
import chatRoutes from "./routes/chat.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "NusaScan API Server",
    version: "1.0.0",
    services: {
      scan: "/api/scan",
      chat: "/api/chat"
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/scan", scanRoutes);
app.use("/api/chat", chatRoutes);

// Global health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    services: {
      scan: "active",
      chat: "active"
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  res.status(500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.path} not found`,
    available_routes: {
      scan: "/api/scan",
      chat: "/api/chat",
      health: "/health"
    },
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NusaScan API Server running on port ${PORT}`);
  console.log(`📸 Scan API: http://localhost:${PORT}/api/scan`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`❤️ Health: http://localhost:${PORT}/health`);
});

export default app;
