import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const culturalSearchTool = createTool({
  id: "cultural-search",
  description: "Search for Indonesian cultural information and artifacts",
  inputSchema: z.object({
    query: z.string().describe("Search query about Indonesian culture"),
    category: z.string().optional().describe("Category like batik, keris, candi, wayang")
  }),
  outputSchema: z.object({
    found: z.boolean(),
    data: z.object({
      name: z.string(),
      description: z.string(),
      origin: z.string(),
      cultural_significance: z.string(),
      historical_context: z.string()
    }).optional(),
    message: z.string()
  }),
  
  execute: async ({ context }) => {
    try {
      let { query, category } = context;
      // Pastikan tidak undefined
      if (typeof query !== 'string') query = '';
      if (typeof category !== 'string') category = '';
      console.log('🔍 Cultural search tool called with:', { query, category });

      // Simple knowledge base for testing
      const culturalData: { [key: string]: any } = {
        "batik": {
          name: "Batik Indonesia",
          description: "Teknik pewarnaan kain dengan menggunakan lilin sebagai perintang warna",
          origin: "Indonesia, terutama Jawa dan Bali",
          cultural_significance: "Simbol identitas budaya Indonesia, diakui UNESCO sebagai Warisan Budaya Takbenda",
          historical_context: "Berkembang sejak abad ke-6, dipengaruhi budaya Hindu-Buddha dan Islam"
        },
        "keris": {
          name: "Keris",
          description: "Senjata tradisional Indonesia yang berbentuk belati dengan lekukan khas",
          origin: "Jawa, kemudian menyebar ke seluruh Nusantara",
          cultural_significance: "Pusaka spiritual, simbol kekuatan dan perlindungan",
          historical_context: "Berkembang sejak abad ke-9, setiap bentuk memiliki makna filosofis"
        },
        "candi": {
          name: "Candi",
          description: "Bangunan suci peninggalan masa Hindu-Buddha di Indonesia",
          origin: "Tersebar di Jawa, Sumatra, dan wilayah Indonesia lainnya",
          cultural_significance: "Pusat keagamaan dan simbol kemegahan peradaban masa lalu",
          historical_context: "Dibangun antara abad ke-7 hingga ke-15, mencerminkan kejayaan kerajaan-kerajaan Nusantara"
        },
        "wayang": {
          name: "Wayang",
          description: "Seni pertunjukan tradisional Indonesia menggunakan boneka kulit atau kayu",
          origin: "Jawa, kemudian berkembang ke berbagai daerah",
          cultural_significance: "Media pendidikan moral dan spiritual, sarana dakwah",
          historical_context: "Berkembang sejak abad ke-9, memadukan nilai-nilai Hindu, Buddha, dan Islam"
        }
      };

      // Find matching cultural item
      const queryLower = query.toLowerCase();
      const categoryLower = category.toLowerCase();
      let matchedData = null;
      for (const [key, data] of Object.entries(culturalData)) {
        if (queryLower.includes(key) || categoryLower.includes(key)) {
          matchedData = data;
          break;
        }
      }

      if (matchedData) {
        return {
          found: true,
          data: matchedData,
          message: "Informasi budaya ditemukan"
        };
      }

      // Generic response for unknown queries
      return {
        found: false,
        message: `Informasi tentang "${query}" tidak ditemukan dalam database budaya lokal. Silakan coba kata kunci seperti: batik, keris, candi, atau wayang.`
      };

    } catch (error) {
      console.error('❌ Cultural search tool error:', error);
      return {
        found: false,
        message: "Terjadi kesalahan saat mencari informasi budaya"
      };
    }
  }
});// Bias-aware query construction
function buildUnbiasedQuery(type: string, name?: string, region?: string, keywords?: string[]) {
  const base = `${type} ${name || ''} Indonesia warisan budaya`;
  
  // Avoid leading questions
  const neutralKeywords = [
    "sejarah akurat", 
    "berbagai sumber", 
    "perspektif lokal", 
    "evidence-based",
    region ? `asal ${region}` : "seluruh nusantara"
  ];
  
  const query = [base, ...neutralKeywords, ...(keywords || [])].join(' ');
  
  return query.replace(/\b(terbaik|terkenal|paling)\b/g, ''); // Remove superlatives
}

// Multi-perspective prompt generation
function createResearchPrompt(query: string, perspectives: string[], region?: string) {
  return `Lakukan penelitian budaya yang komprehensif dan netral:

**OBJEK**: ${query}

**PENDEKATAN MULTI-SUMBER**:
${perspectives.map(p => `- ${p}`).join('\n')}

**INSTRUKSI KHUSUS**:
1. Sertakan perspektif berbeda (lokal, akademik, museum)
2. Sebutkan sumber dan tingkat kepercayaan
3. Catat perbedaan interpretasi antar ahli
4. Hindari generalisasi berlebihan
5. Sertakan konteks lokal spesifik

**FORMAT OUTPUT**:
{
  "name": "nama spesifik",
  "origin": {"region": "daerah", "sources": ["sumber1", "sumber2"], "confidence": 0.8},
  "historical": {"period": "masa", "evidence": ["bukti1"], "alternatives": ["alternatif1"]},
  "cultural": {
    "meanings": [{"source": "komunitas", "interpretation": "makna"}, {"source": "akademisi", "interpretation": "makna lain"}],
    "uses": [{"context": "upacara", "description": "fungsi"}, {"context": "sehari-hari", "description": "fungsi"}]
  },
  "artistic": {"elements": ["elemen1"], "techniques": ["teknik1"], "variations": ["variasi1"]}
}`;
}

// Helper to extract structured data from LLM output (basic JSON block extraction)
function extractStructuredData(lines: string[]): any {
  const jsonStart = lines.findIndex(line => line.trim().startsWith('{'));
  const jsonEnd = lines.slice(jsonStart).findIndex(line => line.trim().endsWith('}'));
  if (jsonStart === -1 || jsonEnd === -1) return {};
  const jsonString = lines.slice(jsonStart, jsonStart + jsonEnd + 1).join('\n');
  try {
    return JSON.parse(jsonString);
  } catch {
    return {};
  }
}

// Sophisticated parsing with bias detection
function parseUnbiasedResponse(text: string, type: string, name?: string, region?: string) {
  try {
    const lines = text.split('\n');
    const data = extractStructuredData(lines);
    
    // Validate confidence based on source diversity
    const sourceCount = data.sources?.length || 1;
    const perspectiveCount = new Set(data.meanings?.map((m: any) => m.source)).size || 1;
    
    const overallConfidence = Math.min((sourceCount * 0.2 + perspectiveCount * 0.3), 1);
    const biasScore = calculateBiasScore(data);
    
    return {
      found: true,
      data: {
        name: data.name || `${type} ${name || ''}`,
        origin: {
          region: data.region || region || 'Indonesia',
          sources: data.sources || ['Sumber budaya lokal'],
          confidence: data.origin_confidence || 0.7
        },
        historical: {
          period: data.period || 'Warisan budaya',
          evidence: data.evidence || ['Tradisi lisan'],
          alternatives: data.alternatives || []
        },
        cultural: {
          meanings: data.meanings || [{ source: 'Komunitas', interpretation: 'Warisan budaya' }],
          uses: data.uses || [{ context: 'Tradisional', description: 'Pelestarian budaya' }]
        },
        artistic: {
          elements: data.elements || ['Motif tradisional'],
          techniques: data.techniques || ['Teknik warisan'],
          variations: data.variations || ['Variasi lokal']
        }
      },
      sources: data.sources?.map((s: string) => ({ type: 'cultural_expert', url: s })) || [],
      confidence: {
        overall: overallConfidence,
        bias_score: biasScore
      }
    };
  } catch (error) {
    return getUnbiasedFallback(type, name);
  }
}

// Bias score calculation
function calculateBiasScore(data: any): number {
  let score = 0;
  
  // Check for diverse perspectives
  const sources = data.sources || [];
  const localSources = sources.filter((s: string) => s.includes('lokal') || s.includes('komunitas')).length;
  const academicSources = sources.filter((s: string) => s.includes('universitas') || s.includes('museum')).length;
  
  if (localSources > 0 && academicSources > 0) score -= 0.2; // Less biased
  if (sources.length > 3) score -= 0.1; // Multiple sources
  
  // Check for balanced interpretations
  const meanings = data.meanings || [];
  const uniqueInterpretations = new Set(meanings.map((m: any) => m.interpretation)).size;
  if (uniqueInterpretations > 1) score -= 0.1;
  
  return Math.max(0, score); // Ensure non-negative
}

// Dynamic perspective generation
function generatePerspectives(type: string, region?: string, options?: any) {
  const base = [
    "Sebagai ahli warisan budaya setempat",
    "Sebagai peneliti museum nasional"
  ];
  
  const regional = region ? [`Sebagai sejarawan ${region}`] : [];
  const academic = ["Sebagai akademisi universitas ternama"];
  
  return [...base, ...regional, ...academic];
}

// Enhanced fallback with source transparency
function getUnbiasedFallback(type: string, name?: string) {
  const fallbackData = getMinimalCulturalData(type, name);
  
  return {
    found: false,
    data: fallbackData,
    sources: [{ type: "fallback", url: "sistem fallback budaya" }],
    confidence: { overall: 0.5, bias_score: 0.3 }
  };
}

// Minimal unbiased fallback data
function getMinimalCulturalData(type: string, name?: string) {
  const data: { [key: string]: {
    name: string;
    origin: { region: string; sources: string[]; confidence: number; };
    historical: { period: string; evidence: string[]; alternatives: string[]; };
    cultural: { meanings: { source: string; interpretation: string; }[]; uses: { context: string; description: string; }[]; };
    artistic: { elements: string[]; techniques: string[]; variations: string[]; };
  } } = {
    batik: {
      name: name || "Batik Indonesia",
      origin: { region: "Jawa (dengan variasi lokal)", sources: ["Warisan budaya"], confidence: 0.6 },
      historical: { period: "Abad ke-6 - sekarang", evidence: ["Prasasti dan artefak"], alternatives: ["Perkembangan regional"] },
      cultural: {
        meanings: [
          { source: "Komunitas pengrajin", interpretation: "Identitas dan status" },
          { source: "Ahli budaya", interpretation: "Warisan filosofis" }
        ],
        uses: [
          { context: "Upacara adat", description: "Pakaian formal" },
          { context: "Kehidupan sehari-hari", description: "Identitas budaya" }
        ]
      },
      artistic: {
        elements: ["Motif geometris", "Simbol alam"],
        techniques: ["Canting lilin", "Pewarnaan alami"],
        variations: ["Regional patterns"]
      }
    }
  };
  
  return data[type] || {
    name: type,
    origin: { region: "Nusantara", sources: ["Tradisi lokal"], confidence: 0.5 },
    historical: { period: "Warisan budaya", evidence: ["Tradisi lisan"], alternatives: [] },
    cultural: { meanings: [], uses: [] },
    artistic: { elements: [], techniques: [], variations: [] }
  };
}