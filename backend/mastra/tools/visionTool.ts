
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fs from "fs";
import OpenAI from "openai";
import fetch from "node-fetch";

const openai = new OpenAI(
  {
    apiKey: process.env.OPENAI_API_KEY
  }
);

export const visionTool = createTool({
  id: "vision-tool",
  description: "Analyze cultural objects from images using OpenAI Vision API with text extraction capabilities",
  inputSchema: z.object({
    imagePath: z.string(),
  }),
  outputSchema: z.object({
    category: z.string().describe("Kategori utama objek budaya"),
    specific_type: z.string().describe("Jenis spesifik objek"),
    confidence: z.number().min(0).max(1).describe("Tingkat kepercayaan"),
    description: z.string().describe("Deskripsi visual objek"),
    extracted_text: z.string().describe("Teks yang terdeteksi dalam gambar"),
    cultural_elements: z.array(z.string()).describe("Elemen budaya yang teridentifikasi"),
  }),
  execute: async (context) => {
    const imagePath = context.context.imagePath;
    try {
      console.log('🔍 Analyzing image with OpenAI Vision:', imagePath);


      // Read and encode image to base64, support http(s) and local file
      let base64Image: string;
      let mimeType = imagePath.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg';
      if (imagePath.startsWith('http')) {
        const response = await fetch(imagePath);
        if (!response.ok) throw new Error('Failed to fetch image: ' + response.status);
        const buffer = await response.buffer();
        base64Image = buffer.toString('base64');
        // Optionally, detect mimeType from response.headers.get('content-type')
      } else {
        base64Image = fs.readFileSync(imagePath, "base64");
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: `Analisis gambar ini sebagai objek budaya Indonesia. Berikan informasi dalam format JSON:
FOKUS ANALISIS:
1. Identifikasi kategori objek budaya (batik, keris, wayang, candi, topeng, arsip budaya kuno, dll)
2. Jenis spesifik dan karakteristik unik
3. Ekstrak semua teks yang terlihat (jika ada)
4. Elemen budaya dan artistik yang teridentifikasi
5. Tingkat kepercayaan identifikasi (0.1-1.0)

Format response JSON dengan field: category, specific_type, confidence, description, extracted_text, cultural_elements` 
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content || "";
      console.log('🤖 OpenAI Vision raw response:', content);

      // Parse JSON response
      let parsedResult;
      try {
        // Extract JSON from response if wrapped in markdown
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
        parsedResult = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        // Fallback result
        parsedResult = {
          category: "objek_budaya",
          specific_type: "Objek budaya Indonesia",
          confidence: 0.6,
          description: content.substring(0, 200) || "Deskripsi tidak tersedia",
          extracted_text: "Tidak ada teks terdeteksi",
          cultural_elements: ["elemen tradisional"]
        };
      }

      // Ensure valid response structure
      const result = {
        category: parsedResult.category || "objek_budaya",
        specific_type: parsedResult.specific_type || "Objek budaya Indonesia", 
        confidence: Math.min(Math.max(parsedResult.confidence || 0.6, 0.1), 1.0),
        description: parsedResult.description || "Objek dengan karakteristik budaya Indonesia",
        extracted_text: parsedResult.extracted_text || "Tidak ada teks terdeteksi",
        cultural_elements: Array.isArray(parsedResult.cultural_elements) ? 
          parsedResult.cultural_elements : ["motif tradisional", "teknik klasik"]
      };

      console.log('✅ Vision analysis result:', result);
      return result;

    } catch (error) {
      console.error('Error in visionTool:', error);

      // Return fallback result
      return {
        category: "objek_budaya",
        specific_type: "Objek budaya Indonesia",
        confidence: 0.3,
        description: "Tidak dapat menganalisis gambar secara detail",
        extracted_text: "Error dalam ekstraksi teks",
        cultural_elements: ["elemen tradisional"]
      };
    }
  },
});