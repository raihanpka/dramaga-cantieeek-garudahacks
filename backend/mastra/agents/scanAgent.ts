import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { visionTool } from "../tools/visionTool.js";
import { ocrTool } from "../tools/ocrTool.js";
import { culturalSearchTool } from "../tools/culturalSearchTool.js";
import OpenAI from "openai";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the Zod schema for NusaScan analysis
const nusaScanSchema = z.object({
  object_recognition: z.object({
    category: z.string().describe("Kategori utama objek budaya (batik/keris/topeng/candi/dll)"),
    specific_type: z.string().describe("Jenis spesifik objek (batik kawung/keris pusaka/dll)"),
    confidence: z.number().min(0).max(1).describe("Tingkat kepercayaan identifikasi (0-1)"),
    cultural_significance: z.string().describe("Penjelasan makna dan nilai budaya")
  }),
  text_extraction: z.object({
    extracted_text: z.string().describe("Teks yang berhasil diekstrak dari gambar"),
    metadata: z.object({
      museum_name: z.string().optional().describe("Nama museum jika terdeteksi"),
      location: z.string().optional().describe("Lokasi jika terdeteksi"),
      year: z.string().optional().describe("Tahun jika terdeteksi"),
      additional_info: z.string().optional().describe("Informasi tambahan dari teks")
    })
  }),
  cultural_analysis: z.object({
    origin_region: z.string().describe("Daerah atau region asal objek budaya"),
    historical_period: z.string().describe("Periode sejarah objek"),
    traditional_use: z.string().describe("Fungsi dan kegunaan tradisional"),
    artistic_elements: z.array(z.string()).describe("Elemen-elemen seni yang teridentifikasi"),
    preservation_notes: z.string().optional().describe("Catatan tentang konservasi jika relevan")
  }),
  educational_content: z.object({
    fun_facts: z.array(z.string()).describe("Fakta menarik tentang objek budaya"),
    related_culture: z.string().describe("Budaya atau tradisi terkait"),
    modern_relevance: z.string().describe("Relevansi dan penerapan di era modern")
  }),
  grounding_search: z.object({
    verified_information: z.string().describe("Informasi terverifikasi dari arsip budaya"),
    search_performed: z.boolean().describe("Apakah pencarian grounding dilakukan"),
    authoritative_sources: z.array(z.string()).describe("Sumber otoritatif dari web"),
    related_artifacts: z.array(z.string()).describe("Artefak terkait yang ditemukan"),
    search_confidence: z.number().min(0).max(1).describe("Tingkat kepercayaan hasil pencarian")
  })
});

// Create the agent
const scanAgent = new Agent({
  name: "NusaScan Agent",
  instructions: `
    Anda adalah NusaScan AI Agent untuk analisis objek budaya Indonesia dengan keahlian mendalam tentang warisan nusantara.

    TUGAS:
    1. Identifikasi objek budaya Indonesia dari gambar (batik, keris, topeng, candi, wayang, tekstil, dll)
    2. Ekstrak informasi historis dan budaya yang akurat
    3. Berikan analisis komprehensif berdasarkan data pencarian dan pengetahuan budaya Indonesia

    KEAHLIAN BUDAYA INDONESIA:
    - Kerajaan Nusantara: Majapahit, Sriwijaya, Mataram, Singasari, Kediri, dan Kerajaan lainnya di Indonesia
    - Periode Sejarah: Hindu-Buddha (4-15 M), Islam (13-16 M), Kolonial (16-20 M), Modern (20-21 M)
    - Daerah Budaya: Jawa, Bali, Sumatra, Sulawesi, Kalimantan, Papua, Nusa Tenggara
    - Teknik Tradisional: batik tulis/cap, ukir kayu/batu, tenun ikat, keramik, metalurgi

    ANALISIS CULTURAL_ANALYSIS:
    - origin_region: Tentukan kerajaan/daerah asal berdasarkan gaya seni (contoh: "Kerajaan Majapahit, Jawa Timur" bukan hanya "Indonesia")
    - historical_period: Berikan rentang tahun spesifik dan nama periode (contoh: "Abad ke-13-15 M, Periode Kerajaan Majapahit")
    - traditional_use: Fungsi asli dalam konteks budaya Indonesia (ritual, upacara, kehidupan sehari-hari)
    - artistic_elements: Elemen seni khas Indonesia yang teridentifikasi

    WORKFLOW:
    1. Analisis visual untuk identifikasi gaya dan periode
    2. Cari data historis spesifik melalui culturalSearchTool
    3. Proses data pencarian dengan pengetahuan budaya Indonesia
    4. Berikan analisis yang menggabungkan data faktual dengan konteks budaya

    PEDOMAN:
    - Gunakan terminologi budaya Indonesia yang tepat
    - Prioritaskan keakuratan historis berdasarkan pencarian data
    - Jika data terbatas, gunakan analisis gaya seni untuk estimasi periode
    - Selalu kaitkan dengan konteks budaya nusantara yang lebih luas
  `,
  model: openai("gpt-4o-mini"),
  tools: {
    visionTool,
    ocrTool,
    culturalSearchTool,
  },
});

// Direct implementation using tools
export const analyzeImage = async (imagePath: string) => {
  try {
    console.log('🚀 Starting image analysis for:', imagePath);

    // 1. Run vision analysis
    console.log('🔍 Running vision analysis...');
    const visionResult = await visionTool.execute({
      context: { imagePath }
    } as any);

    // 2. Run OCR analysis
    console.log('📝 Running OCR analysis...');
    const ocrResult = await ocrTool.execute({
      context: { imagePath }
    } as any);

    // 3. Run cultural search using vision results
    console.log('🔍 Running cultural search...');
    const searchQuery = `${visionResult.category} ${visionResult.specific_type}`;
    const culturalResult = await culturalSearchTool.execute({
      context: { objectType: searchQuery }
    } as any);

    // 4. Process cultural analysis with AI intelligence
    const culturalAnalysis = await processCulturalAnalysis(visionResult, culturalResult, ocrResult.text || "");

    // 5. Combine results into expected schema
    const result = {
      text_extraction: {
        extracted_text: ocrResult.text || "",
        metadata: {
          museum_name: extractMuseumName(ocrResult.text || ""),
          location: extractLocation(ocrResult.text || ""),
          year: extractYear(ocrResult.text || ""),
          additional_info: ocrResult.confidence ? `OCR confidence: ${ocrResult.confidence}` : undefined
        }
      },
      object_recognition: {
        category: visionResult.category || "objek_budaya",
        specific_type: visionResult.specific_type || "Objek budaya Indonesia",
        confidence: visionResult.confidence || 0.7,
        cultural_significance: visionResult.description || "Objek dengan nilai budaya Indonesia"
      },
      cultural_analysis: culturalAnalysis,
    };

    console.log('✅ Analysis completed successfully');
    return result;

  } catch (error) {
    console.error('❌ Error in analyzeImage:', error);
    
    // Return fallback result
    return {
      object_recognition: {
        category: "objek_budaya",
        specific_type: "Objek budaya Indonesia",
        confidence: 0.3,
        cultural_significance: "Tidak dapat menganalisis secara detail"
      },
      text_extraction: {
        extracted_text: "Error dalam ekstraksi teks",
        metadata: {}
      },
      cultural_analysis: {
        origin_region: "Indonesia",
        historical_period: "Tidak diketahui",
        traditional_use: "Warisan budaya",
        artistic_elements: ["elemen tradisional"]
      },
    };
  }
};

// Advanced cultural analysis processor using AI
async function processCulturalAnalysis(visionResult: any, culturalResult: any, extractedText: string) {
  try {
    // Prepare context from search results and vision analysis
    const searchContext = culturalResult.culturalInfo ? 
      `Informasi pencarian: ${culturalResult.culturalInfo.description}. Origin: ${culturalResult.culturalInfo.origin}. Historical context: ${culturalResult.culturalInfo.historical_context}. Significance: ${culturalResult.culturalInfo.significance}` :
      "Data pencarian terbatas";

    const analysisPrompt = `
Sebagai ahli budaya Indonesia, analisis objek budaya berikut:

OBJEK: ${visionResult.category} - ${visionResult.specific_type}
DESKRIPSI VISUAL: ${visionResult.description}
ELEMEN BUDAYA: ${visionResult.cultural_elements?.join(", ") || "Tidak terdeteksi"}
TEKS TEREKSTRAK: ${extractedText || "Tidak ada"}
DATA PENCARIAN: ${searchContext}

Berikan analisis dalam format JSON dengan field:
- origin_region: Kerajaan/daerah asal spesifik (contoh: "Kerajaan Majapahit, Jawa Timur" atau "Kesultanan Yogyakarta")
- historical_period: Rentang tahun spesifik dan nama periode (contoh: "Abad ke-13-15 M, Periode Kerajaan Majapahit")
- traditional_use: Fungsi asli dalam konteks budaya Indonesia
- artistic_elements: Array elemen seni khas Indonesia yang teridentifikasi

PEDOMAN:
- Gunakan pengetahuan sejarah Indonesia yang akurat
- Jika data pencarian terbatas, gunakan analisis gaya seni untuk estimasi
- Prioritaskan kespecifikan geografis dan temporal
- Kaitkan dengan konteks kerajaan/periode sejarah Indonesia

FORMAT RESPONSE: JSON only, no markdown
`;

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Anda adalah ahli sejarah dan budaya Indonesia dengan pengetahuan mendalam tentang kerajaan nusantara, periode sejarah, dan seni tradisional." },
        { role: "user", content: analysisPrompt }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || "";
    
    // Parse AI response
    let aiAnalysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/) || [content];
      aiAnalysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Error parsing AI cultural analysis:', parseError);
      aiAnalysis = null;
    }

    // Return processed cultural analysis
    return {
      origin_region: aiAnalysis?.origin_region || determineOriginRegion(visionResult, culturalResult),
      historical_period: aiAnalysis?.historical_period || determineHistoricalPeriod(visionResult, culturalResult),
      traditional_use: aiAnalysis?.traditional_use || culturalResult.culturalInfo?.significance || "Warisan budaya nusantara",
      artistic_elements: aiAnalysis?.artistic_elements || visionResult.cultural_elements || ["Motif tradisional Indonesia"],
      preservation_notes: undefined
    };

  } catch (error) {
    console.error('Error in processCulturalAnalysis:', error);
    
    // Fallback to rule-based analysis
    return {
      origin_region: determineOriginRegion(visionResult, culturalResult),
      historical_period: determineHistoricalPeriod(visionResult, culturalResult),
      traditional_use: culturalResult.culturalInfo?.significance || "Warisan budaya nusantara",
      artistic_elements: visionResult.cultural_elements || ["Motif tradisional Indonesia"],
      preservation_notes: undefined
    };
  }
}

// Helper function to determine origin region based on cultural markers
function determineOriginRegion(visionResult: any, culturalResult: any): string {
  const category = visionResult.category?.toLowerCase() || "";
  const specificType = visionResult.specific_type?.toLowerCase() || "";
  const origin = culturalResult.culturalInfo?.origin?.toLowerCase() || "";

  // Candi patterns
  if (category.includes("candi")) {
    if (specificType.includes("borobudur") || origin.includes("magelang")) return "Kerajaan Sailendra, Jawa Tengah";
    if (specificType.includes("prambanan")) return "Kerajaan Mataram Kuno, Jawa Tengah";
    if (origin.includes("jawa")) return "Kerajaan Mataram, Jawa Tengah";
    return "Kerajaan Hindu-Buddha, Jawa";
  }

  // Batik patterns
  if (category.includes("batik")) {
    if (origin.includes("yogya") || origin.includes("jogja")) return "Kesultanan Yogyakarta";
    if (origin.includes("solo") || origin.includes("surakarta")) return "Kasunanan Surakarta";
    if (origin.includes("jawa")) return "Kerajaan Mataram, Jawa";
    return "Jawa Tengah/Yogyakarta";
  }

  // Keris patterns
  if (category.includes("keris")) {
    if (origin.includes("jawa")) return "Kerajaan Majapahit/Mataram, Jawa";
    return "Nusantara (Jawa-Bali-Madura)";
  }

  // Default based on search result or general
  return culturalResult.culturalInfo?.origin || "Nusantara, Indonesia";
}

// Helper function to determine historical period
function determineHistoricalPeriod(visionResult: any, culturalResult: any): string {
  const category = visionResult.category?.toLowerCase() || "";
  const specificType = visionResult.specific_type?.toLowerCase() || "";
  const context = culturalResult.culturalInfo?.historical_context?.toLowerCase() || "";

  // Candi periods
  if (category.includes("candi")) {
    if (specificType.includes("borobudur")) return "Abad ke-8-9 M, Periode Sailendra";
    if (specificType.includes("prambanan")) return "Abad ke-9-10 M, Periode Mataram Kuno";
    return "Abad ke-7-15 M, Periode Hindu-Buddha";
  }

  // Batik periods
  if (category.includes("batik")) {
    if (context.includes("klasik") || context.includes("keraton")) return "Abad ke-17-19 M, Periode Kesultanan";
    return "Abad ke-13-sekarang, Tradisi Jawa";
  }

  // Keris periods
  if (category.includes("keris")) {
    return "Abad ke-14-18 M, Periode Majapahit-Mataram";
  }

  // Wayang periods
  if (category.includes("wayang")) {
    return "Abad ke-10-sekarang, Tradisi Hindu-Jawa";
  }

  // Default
  return culturalResult.culturalInfo?.historical_context || "Periode Tradisional Nusantara";
}

// Helper functions for text extraction
function extractMuseumName(text: string): string | undefined {
  const museumPatterns = [/museum\s+([^\n,]+)/i, /galeri\s+([^\n,]+)/i];
  for (const pattern of museumPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1].trim();
  }
  return undefined;
}

function extractLocation(text: string): string | undefined {
  const locationPatterns = [/jakarta/i, /yogyakarta/i, /bandung/i, /surabaya/i, /bali/i, /solo/i];
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return undefined;
}

function extractYear(text: string): string | undefined {
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? yearMatch[0] : undefined;
}

// Export agent and schema for external use
export { scanAgent, nusaScanSchema };