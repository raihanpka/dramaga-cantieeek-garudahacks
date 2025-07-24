import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { openai } from "@ai-sdk/openai";
import { culturalSearchTool } from "@/mastra/tools/culturalSearchTool";
import { fastembed } from "@mastra/fastembed";

// Initialize memory with LibSQLStore for persistence
const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:./database/kala-chatbot.db", // Local database for chat history
  }),
  vector: new LibSQLVector({
    connectionUrl: process.env.TURSO_DB_URL || "file:vector-kala-chatbot.db",
    authToken: process.env.TURSO_AUTH_TOKEN || ""
  }),
  embedder: fastembed,
  options: {
    threads: {
      generateTitle: true, // Enable automatic title generation
    },
    semanticRecall: {
      topK: 3, // Enable semantic recall for better context understanding
      messageRange: 20, // Use last 20 messages for context
    },
    lastMessages: 20, // Include last 20 messages for context
  },
});

export const culturalChatbot = new Agent({
  name: "Kala Chatbot",
  instructions: `
    Kamu adalah Kala Chatbot - ahli budaya Indonesia yang ramah dan informatif.
    Tugasmu adalah menjawab pertanyaan tentang budaya Indonesia dengan akurat dan mendalam.

    CARA KERJA:
    1. SELALU gunakan culturalSearchTool untuk mencari informasi tentang topik yang ditanyakan
    2. Berikan parameter query dan category yang sesuai
    3. Gunakan hasil pencarian untuk memberikan jawaban yang akurat
    4. Jika tidak ditemukan, berikan informasi umum yang kamu ketahui
    
    FORMAT JAWABAN:
    1. Berikan informasi berdasarkan hasil culturalSearchTool
    2. Jelaskan dengan bahasa Indonesia yang sopan dan mudah dipahami
    3. Sertakan konteks historis dan makna budaya
    4. Berikan contoh konkret jika relevan

    CONTOH PERTANYAAN:
    - "Apa itu Batik Mega Mendung?"
    - "Dari mana asal Tari Saman?"
    - "Apa makna filosofis dari Wali Songo?"
  `,
  model: openai("gpt-4o-mini"),
  tools: { culturalSearchTool },
  memory, // Attach the configured memory instance
});