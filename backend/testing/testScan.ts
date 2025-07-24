import { analyzeImage } from "@/mastra/agents/scanAgent";
import path from "path";

(async () => {
  try {
    console.log("Testing scanAgent analyzeImage export...");
    
    // Test dengan path gambar yang ada
    const imagePath = path.resolve(__dirname, "image.png");
    
    console.log("Calling analyzeImage with:", imagePath);
    const result = await analyzeImage(imagePath);
    
    console.log("✅ analyzeImage executed successfully!");
    console.log("Result:", JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error("❌ Error testing analyzeImage:", error);
  }
})();
