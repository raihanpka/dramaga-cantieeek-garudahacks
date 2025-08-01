import { Router } from "express";
import { analyzeImage, nusaScanSchema } from "../mastra/agents/scanAgent.js";

const router = Router();

// Upload endpoint is disabled for Vercel. All uploads must be handled via Supabase Storage from the frontend.

// Health check endpoint
router.get("/health", (req, res) => {
  return res.json({
    status: "healthy",
    service: "NusaScan API",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Get supported object types
router.get("/supported-types", (req, res) => {
  return res.json({
    success: true,
    supported_types: [
      {
        category: "batik",
        examples: ["kawung", "parang", "truntum", "sido mukti"],
        description: "Traditional Indonesian batik patterns"
      },
      {
        category: "keris", 
        examples: ["pusaka", "luk", "pamor"],
        description: "Traditional Javanese ceremonial daggers"
      },
      {
        category: "topeng",
        examples: ["jawa", "bali", "cirebon"],
        description: "Traditional Indonesian masks"
      },
      {
        category: "wayang",
        examples: ["kulit", "golek", "orang"],
        description: "Traditional Indonesian puppetry"
      },
      {
        category: "candi",
        examples: ["borobudur", "prambanan", "mendut"],
        description: "Traditional Indonesian temples"
      }
    ],
    timestamp: new Date().toISOString()
  });
});


// Analisis gambar dari Supabase Storage public URL
router.post("/", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl || typeof imageUrl !== "string") {
      return res.status(400).json({ success: false, message: "imageUrl is required" });
    }
    // Jalankan analisis
    const result = await analyzeImage(imageUrl);
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("/scan error:", error);
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    return res.status(500).json({ success: false, message: "Failed to analyze image", error: errorMessage });
  }
});

export default router;