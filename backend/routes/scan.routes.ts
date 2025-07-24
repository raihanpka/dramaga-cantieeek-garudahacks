import { Router } from "express";
import { unlinkSync } from "fs";
import { upload } from "@/services/upload";
import { analyzeImage, nusaScanSchema } from "@/mastra/agents/scanAgent";

const router = Router();

router.post("/", upload.single("image"), async (req, res) => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: "No file uploaded",
        message: "Please upload an image file" 
      });
    }

    const imagePath = req.file.path;
    
    // Add timeout for real-time guarantee (max 15 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analysis timeout - taking too long')), 15000);
    });

    // Use the new scanAgent with structured output and grounding search
    const analysisResult = await Promise.race([
      analyzeImage(imagePath),
      timeoutPromise
    ]);

    // Cleanup uploaded file
    unlinkSync(imagePath);

    const processingTime = Date.now() - startTime;

    // Return comprehensive analysis result with timing
    res.json({
      success: true,
      data: analysisResult,
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString(),
      message: "Analisis berhasil dilakukan"
    });

  } catch (error) {
    console.error('NusaScan Analysis Error:', error);
    
    // Cleanup file if it exists
    if (req.file?.path) {
      try {
        unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('File cleanup error:', cleanupError);
      }
    }

    const processingTime = Date.now() - startTime;

    res.status(500).json({ 
      success: false,
      error: "Gagal memproses gambar",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "NusaScan API",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Get supported object types
router.get("/supported-types", (req, res) => {
  res.json({
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

// Real-time streaming endpoint for progressive results
router.post("/stream", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Set headers for Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  const imagePath = req.file.path;
  const startTime = Date.now();

  try {
    // Send initial status
    res.write(`data: ${JSON.stringify({
      status: 'processing',
      stage: 'initializing',
      message: 'Memulai analisis gambar...',
      timestamp: new Date().toISOString()
    })}\n\n`);

    // Simulate progressive updates (in real implementation, these would come from agent callbacks)
    setTimeout(() => {
      res.write(`data: ${JSON.stringify({
        status: 'processing',
        stage: 'vision_analysis',
        message: 'Menganalisis objek budaya...',
        progress: 33,
        timestamp: new Date().toISOString()
      })}\n\n`);
    }, 1000);

    setTimeout(() => {
      res.write(`data: ${JSON.stringify({
        status: 'processing', 
        stage: 'text_extraction',
        message: 'Mengekstrak teks dari gambar...',
        progress: 66,
        timestamp: new Date().toISOString()
      })}\n\n`);
    }, 2000);

    setTimeout(() => {
      res.write(`data: ${JSON.stringify({
        status: 'processing',
        stage: 'grounding_search',
        message: 'Melakukan pencarian verifikasi...',
        progress: 90,
        timestamp: new Date().toISOString()
      })}\n\n`);
    }, 3000);

    // Perform actual analysis
    const analysisResult = await analyzeImage(imagePath);
    const processingTime = Date.now() - startTime;

    // Send final result
    res.write(`data: ${JSON.stringify({
      status: 'completed',
      stage: 'finished',
      data: analysisResult,
      processing_time_ms: processingTime,
      progress: 100,
      message: 'Analisis selesai!',
      timestamp: new Date().toISOString()
    })}\n\n`);

    // Cleanup
    unlinkSync(imagePath);
    res.end();

  } catch (error) {
    console.error('Streaming analysis error:', error);
    
    res.write(`data: ${JSON.stringify({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      processing_time_ms: Date.now() - startTime,
      timestamp: new Date().toISOString()
    })}\n\n`);

    if (req.file?.path) {
      try { unlinkSync(req.file.path); } catch {}
    }
    
    res.end();
  }
});

export default router;