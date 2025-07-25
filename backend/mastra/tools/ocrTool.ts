
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createWorker } from "tesseract.js";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import os from "os";

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
      let localPath = imagePath;
      if (imagePath.startsWith('http')) {
        const response = await fetch(imagePath);
        if (!response.ok) throw new Error('Failed to fetch image: ' + response.status);
        const buffer = await response.buffer();
        const tempPath = path.join(os.tmpdir(), `ocr-${Date.now()}.jpg`);
        fs.writeFileSync(tempPath, buffer);
        localPath = tempPath;
      }
      const worker = await createWorker("eng+ind+jav");
      const { data: result } = await worker.recognize(localPath);
      await worker.terminate();
      if (localPath !== imagePath) fs.unlinkSync(localPath);
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