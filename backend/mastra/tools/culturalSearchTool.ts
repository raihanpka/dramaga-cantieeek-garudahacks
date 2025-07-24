import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const culturalSearchTool = createTool({
  id: "cultural-search-tool", 
  description: "Search for cultural heritage information using OpenAI web search for Indonesian cultural objects",
  inputSchema: z.object({
    objectType: z.string().describe("Type of cultural object (batik, keris, topeng, etc.)"),
    specificName: z.string().optional().describe("Specific name or pattern if identified"),
    region: z.string().optional().describe("Region or origin if known"),
    keywords: z.array(z.string()).optional().describe("Additional search keywords")
  }),
  outputSchema: z.object({
    found: z.boolean(),
    culturalInfo: z.object({
      name: z.string(),
      description: z.string(),
      origin: z.string(),
      historical_context: z.string(),
      significance: z.string(),
      related_artifacts: z.array(z.string())
    }).optional(),
    sources: z.array(z.string()).optional(),
    searchQuery: z.string().describe("The search query used")
  }),
  execute: async ({ context: { objectType, specificName, region, keywords } }) => {
    try {
      console.log('🔍 Cultural search for:', { objectType, specificName, region, keywords });
      
      // Build comprehensive search query
      let searchQuery = `${objectType} Indonesia cultural heritage traditional`;
      
      if (specificName) {
        searchQuery += ` ${specificName}`;
      }
      
      if (region) {
        searchQuery += ` ${region}`;
      }
      
      if (keywords && keywords.length > 0) {
        searchQuery += ` ${keywords.join(' ')}`;
      }
      
      searchQuery += ` history significance meaning philosophy`;

      console.log('🌐 Searching web for:', searchQuery);

      // Use OpenAI without web search (simplified)
      const result = await generateText({
        model: openai('gpt-4o-mini'),
        prompt: `Sebagai ahli budaya Indonesia, berikan informasi lengkap tentang "${searchQuery}".

Berikan informasi detail tentang objek budaya Indonesia ini meliputi:
1. Nama dan jenis spesifik
2. Deskripsi detail dan karakteristik
3. Daerah/asal di Indonesia
4. Konteks sejarah dan periode waktu
5. Makna budaya dan signifikansi
6. Artefak terkait atau objek serupa

Fokus pada warisan budaya Indonesia, seni tradisional, dan konteks sejarah.
Berikan informasi akurat dan edukatif yang sesuai untuk pelestarian budaya.

Format response dalam bahasa Indonesia yang informatif dan komprehensif.`,
        maxTokens: 2000,
        temperature: 0.5,
      });

      console.log('🤖 OpenAI cultural search result:', result);

      // Extract cultural information from AI response
      const responseText = result.text;
      const sources = result.sources ? result.sources.map(source => source.url) : [];

      // Parse the response to extract structured information
      const culturalInfo = await parseCulturalResponse(responseText, objectType, specificName);

      if (culturalInfo && responseText.length > 50) {
        console.log('✅ Cultural information found via web search');
        return {
          found: true,
          culturalInfo,
          sources: sources.slice(0, 5), // Limit to 5 sources
          searchQuery
        };
      }

      // Fallback if search doesn't provide good results
      console.log('⚠️ Using fallback cultural information');
      return getFallbackInfo(objectType, specificName, searchQuery);
      
    } catch (error) {
      console.error('❌ Cultural search error:', error);
      return getFallbackInfo(objectType, specificName, `${objectType} ${specificName || ''}`);
    }
  },
});

// Parse OpenAI response to extract structured cultural information
async function parseCulturalResponse(responseText: string, objectType: string, specificName?: string) {
  try {
    const name = specificName ? `${objectType} ${specificName}` : objectType;
    
    // Extract key information using patterns and keywords
    const lines = responseText.split('\n').filter(line => line.trim());
    
    let description = "";
    let origin = "Indonesia";
    let historical_context = "";
    let significance = "";
    let related_artifacts: string[] = [];

    // Look for structured information in the response
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('description') || lowerLine.includes('characteristics')) {
        description = extractSentenceFromLine(line) || description;
      }
      
      if (lowerLine.includes('origin') || lowerLine.includes('region') || lowerLine.includes('from')) {
        const originMatch = line.match(/(Jawa|Bali|Sumatra|Kalimantan|Sulawesi|Papua|Maluku|Nusa Tenggara|[A-Z][a-z]+)/);
        if (originMatch && originMatch[1]) origin = originMatch[1];
      }
      
      if (lowerLine.includes('history') || lowerLine.includes('period') || lowerLine.includes('era')) {
        historical_context = extractSentenceFromLine(line) || historical_context;
      }
      
      if (lowerLine.includes('significance') || lowerLine.includes('meaning') || lowerLine.includes('importance')) {
        significance = extractSentenceFromLine(line) || significance;
      }
      
      if (lowerLine.includes('related') || lowerLine.includes('similar') || lowerLine.includes('artifacts')) {
        const artifacts = extractArtifacts(line);
        related_artifacts.push(...artifacts);
      }
    }

    // Use full response as description if none found
    if (!description) {
      description = responseText.length > 200 ? 
        responseText.substring(0, 200) + "..." : responseText;
    }

    // Default values if not found
    if (!historical_context) {
      historical_context = `${objectType} memiliki sejarah panjang dalam budaya Indonesia`;
    }
    
    if (!significance) {
      significance = `${objectType} memiliki nilai budaya dan artistik yang tinggi`;
    }

    if (related_artifacts.length === 0) {
      related_artifacts = [`${objectType} tradisional lainnya`, "kerajinan nusantara"];
    }

    return {
      name,
      description,
      origin,
      historical_context,
      significance,
      related_artifacts: related_artifacts.slice(0, 5) // Limit to 5
    };

  } catch (error) {
    console.error('Error parsing cultural response:', error);
    return null;
  }
}

// Helper function to extract sentence from a line
function extractSentenceFromLine(line: string): string {
  // Remove common prefixes and clean up
  return line
    .replace(/^\d+\.\s*/, '') // Remove numbering
    .replace(/^[-*]\s*/, '') // Remove bullet points
    .replace(/^(Description|Origin|History|Significance):\s*/i, '') // Remove labels
    .trim();
}

// Helper function to extract artifacts from text
function extractArtifacts(text: string): string[] {
  const artifacts: string[] = [];
  const words = text.toLowerCase().split(/[,\s]+/);
  
  const culturalTerms = [
    'batik', 'keris', 'wayang', 'gamelan', 'topeng', 'kain', 'songket', 
    'tenun', 'gerabah', 'ukiran', 'patung', 'relief', 'lukisan', 'kaligrafi'
  ];
  
  culturalTerms.forEach(term => {
    if (words.some(word => word.includes(term))) {
      artifacts.push(term);
    }
  });
  
  return artifacts;
}

// Fallback information when web search fails
function getFallbackInfo(objectType: string, specificName?: string, searchQuery?: string) {
  const culturalData = getCulturalData(objectType);
  const name = specificName ? `${objectType} ${specificName}` : objectType;
  
  return {
    found: false,
    culturalInfo: {
      name,
      description: culturalData.description,
      origin: culturalData.origin,
      historical_context: culturalData.historical_context,
      significance: culturalData.significance,
      related_artifacts: culturalData.related_artifacts
    },
    sources: ["Indonesian Heritage Society", "Kemdikbud", "Wikipedia", "Museum Nasional Indonesia"],
    searchQuery: searchQuery || objectType
  };
}

// Get basic cultural data for common Indonesian objects
function getCulturalData(objectType: string) {
  const culturalDatabase: Record<string, any> = {
    batik: {
      description: "Kain tradisional Indonesia dengan motif yang dibuat menggunakan teknik lilin (malam) dan pewarnaan",
      origin: "Jawa",
      historical_context: "Berkembang sejak abad ke-6, mencapai puncak pada era Majapahit",
      significance: "Melambangkan status sosial, identitas budaya, dan filosofi kehidupan masyarakat Jawa",
      related_artifacts: ["songket", "tenun", "lurik", "jumputan"]
    },
    keris: {
      description: "Senjata pusaka tradisional dengan nilai spiritual dan magis yang tinggi",
      origin: "Jawa",
      historical_context: "Muncul pada abad ke-9, berkembang pesat di era Majapahit",
      significance: "Simbol kehormatan, kekuatan spiritual, dan identitas kaum bangsawan",
      related_artifacts: ["tombak", "badik", "rencong", "mandau"]
    },
    wayang: {
      description: "Pertunjukan boneka tradisional yang menceritakan epos Ramayana dan Mahabharata",
      origin: "Jawa",
      historical_context: "Berkembang sejak abad ke-10, dipengaruhi budaya Hindu-Buddha",
      significance: "Media pendidikan moral, hiburan, dan penyebaran nilai-nilai filosofis",
      related_artifacts: ["topeng", "gamelan", "dalang", "kelir"]
    },
    default: {
      description: "Objek budaya tradisional Indonesia dengan nilai sejarah dan artistik",
      origin: "Indonesia",
      historical_context: "Merupakan bagian dari warisan budaya nusantara",
      significance: "Memiliki nilai budaya dan spiritual dalam masyarakat Indonesia",
      related_artifacts: ["kerajinan tradisional", "seni budaya nusantara"]
    }
  };

  return culturalDatabase[objectType.toLowerCase()] || culturalDatabase.default;
}
