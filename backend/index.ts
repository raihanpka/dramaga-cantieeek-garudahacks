import express from "express";
import cors from "cors";
import scanRoutes from "./routes/scan.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/scan", scanRoutes);
app.use("/chat", chatRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Bun + Mastra server running on http://localhost:${PORT}`);
});