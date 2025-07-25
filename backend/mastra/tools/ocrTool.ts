import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createWorker } from "tesseract.js";

export const ocrTool = createTool({
  id: "ocr-tool",
  description: "Extract text from image using Tesseract.js",
  inputSchema: z.object({
    imagePath: z.string(),
  }),
  outputSchema: z.object({
    text: z.string(),
    confidence: z.number(),
  }),
  execute: async (context) => {
    const imagePath = context.context.imagePath;
    try {
      console.log('🔍 Extracting text from image:', imagePath);
      
      const worker = await createWorker("eng+ind+jav");
      const { data: result } = await worker.recognize(imagePath);
      await worker.terminate();
      
      return { 
        text: result.text.trim(),
        confidence: result.confidence
      };
    } catch (error) {
      console.error('Error in ocrTool:', error);
      return {
        text: "Error dalam ekstraksi teks",
        confidence: 0
      };
    }
  },
});