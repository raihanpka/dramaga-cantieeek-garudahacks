import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import OpenAI from "openai";
import fetch from "node-fetch";
import fs from "fs";

export const ocrTool = createTool({
  id: "ocr-tool",
  description: "Extract text from image using OpenAI Vision API (zero-shot OCR)",
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
      console.log('🔍 Extracting text from image (OpenAI Vision):', imagePath);
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      // Read and encode image to base64, support http(s) and local file
      let base64Image;
      let mimeType = imagePath.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg';
      if (imagePath.startsWith('http')) {
        const response = await fetch(imagePath);
        if (!response.ok) throw new Error('Failed to fetch image: ' + response.status);
        const buffer = await response.buffer();
        base64Image = buffer.toString('base64');
      } else {
        base64Image = fs.readFileSync(imagePath, "base64");
      }
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `Ekstrak semua teks yang terlihat pada gambar ini. Jika tidak ada teks, balas kosong. Format response JSON: {\"text\": string}` },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.0,
      });
      const content = response.choices[0]?.message?.content || "";
      // Parse JSON response
      let parsedResult;
      try {
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
        parsedResult = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Error parsing OpenAI OCR JSON:', parseError);
        parsedResult = { text: content };
      }
      return {
        text: parsedResult.text || "",
        confidence: 1.0 // OpenAI tidak mengembalikan confidence, default 1.0
      };
    } catch (error) {
      console.error('Error in ocrTool (OpenAI):', error);
      return {
        text: "Error dalam ekstraksi teks",
        confidence: 0
      };
    }
  },
});