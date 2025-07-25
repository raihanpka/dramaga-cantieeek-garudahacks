import { Router } from "express";
import { culturalChatbot } from "../mastra/agents/kalaChatbot.js";

const router = Router();

// Chat endpoint for Kala Chatbot
router.post("/", async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { message, threadId, resourceId } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: "No message provided",
        message: "Please provide a message to chat with Kala" 
      });
    }

    console.log('💬 Kala Chat request:', { message, threadId, resourceId });

    // Generate response using Kala Chatbot with proper memory context
    const response = await culturalChatbot.generate(
      [
        {
          role: "user",
          content: message,
        },
      ],
      {
        threadId: threadId || `chat_${Date.now()}`, // Generate threadId if not provided
        resourceId: resourceId || "default_user", // Use resourceId for memory scoping
      }
    );

    const processingTime = Date.now() - startTime;

    // Return chat response
    return res.json({
      success: true,
      data: {
        response: response.text,
        threadId: threadId || `chat_${Date.now()}`,
        resourceId: resourceId || "default_user",
        toolResults: response.toolResults || [],
      },
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString(),
      message: "Chat berhasil diproses"
    });

  } catch (error) {
    console.error('Kala Chat Error:', error);
    
    const processingTime = Date.now() - startTime;

    
    return res.status(500).json({ 
      success: false,
      error: "Gagal memproses chat",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString()
    });
  }
});

// Get chat history
router.get("/history/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    
    if (!threadId) {
      return res.status(400).json({ 
        error: "Thread ID required",
        message: "Please provide a valid thread ID" 
      });
    }

    // Get memory/history for the thread (simplified for now)
    return res.json({
      success: true,
      data: {
        threadId,
        messages: [], // Memory API would be implemented here
        timestamp: new Date().toISOString(),
        note: "Chat history feature will be implemented when memory API is available"
      }
    });

  } catch (error) {
    console.error('Chat History Error:', error);
    
    return res.status(500).json({ 
      success: false,
      error: "Gagal mengambil riwayat chat",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString()
    });
  }
});

// Health check for chat service
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Kala Chatbot API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    features: ["cultural_search", "conversational_ai"]
  });
});

export default router;
