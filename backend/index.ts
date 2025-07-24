import express from "express";
import cors from "cors";
import scanRoutes from "./routes/scan.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/scan", scanRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Bun + Mastra server running on http://localhost:${PORT}`);
});