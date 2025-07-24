import { openai } from "@ai-sdk/openai";
import { SummarizationMetric } from "@mastra/evals/llm";

/**
 * Cultural Heritage Summarization Evaluator
 * Evaluates how well responses summarize Indonesian cultural heritage information
 */
export class CulturalSummarizationEvaluator {
  private summarizationMetric: SummarizationMetric;

  constructor() {
    this.summarizationMetric = new SummarizationMetric(openai("gpt-4o-mini"));
  }

  /**
   * Evaluate summarization quality for cultural heritage content
   */
  async evaluateCulturalSummary(
    originalText: string, 
    summary: string
  ): Promise<{
    score: number;
    info: {
      reason: string;
      alignmentScore: number;
      coverageScore: number;
      culturalAccuracy: string;
      keyElementsCovered: string[];
      missingElements: string[];
    };
    quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  }> {
    try {
      const result = await this.summarizationMetric.measure(originalText, summary);
      
      // Additional cultural heritage specific analysis
      const culturalAnalysis = await this.analyzeCulturalAccuracy(originalText, summary);
      
      const quality = this.determineQuality(result.score);
      
      return {
        score: result.score,
        info: {
          reason: result.info.reason,
          alignmentScore: result.info.alignmentScore,
          coverageScore: result.info.coverageScore,
          culturalAccuracy: culturalAnalysis.accuracy,
          keyElementsCovered: culturalAnalysis.keyElementsCovered,
          missingElements: culturalAnalysis.missingElements
        },
        quality
      };
    } catch (error) {
      console.error('Error evaluating cultural summary:', error);
      return {
        score: 0.5,
        info: {
          reason: 'Evaluation failed - manual review required',
          alignmentScore: 0.5,
          coverageScore: 0.5,
          culturalAccuracy: 'Unable to assess',
          keyElementsCovered: [],
          missingElements: []
        },
        quality: 'FAIR'
      };
    }
  }

  /**
   * Analyze cultural accuracy and completeness
   */
  private async analyzeCulturalAccuracy(original: string, summary: string): Promise<{
    accuracy: string;
    keyElementsCovered: string[];
    missingElements: string[];
  }> {
    // Key cultural elements to check for
    const culturalElements = {
      historical: ['tahun', 'abad', 'periode', 'sejarah', 'zaman', 'masa'],
      geographical: ['jawa', 'bali', 'sumatra', 'kalimantan', 'sulawesi', 'papua', 'nusantara', 'indonesia'],
      technical: ['teknik', 'cara', 'proses', 'metode', 'bahan', 'alat'],
      spiritual: ['spiritual', 'ritual', 'upacara', 'makna', 'filosofi', 'simbolis'],
      cultural: ['budaya', 'tradisi', 'adat', 'warisan', 'leluhur', 'masyarakat'],
      artistic: ['seni', 'motif', 'pola', 'desain', 'estetika', 'keindahan']
    };

    const keyElementsCovered: string[] = [];
    const missingElements: string[] = [];

    const originalLower = original.toLowerCase();
    const summaryLower = summary.toLowerCase();

    // Check coverage of each cultural element category
    for (const [category, keywords] of Object.entries(culturalElements)) {
      const originalHasCategory = keywords.some(keyword => originalLower.includes(keyword));
      const summaryHasCategory = keywords.some(keyword => summaryLower.includes(keyword));

      if (originalHasCategory) {
        if (summaryHasCategory) {
          keyElementsCovered.push(category);
        } else {
          missingElements.push(category);
        }
      }
    }

    // Determine accuracy level
    let accuracy = 'ACCURATE';
    if (missingElements.length > keyElementsCovered.length) {
      accuracy = 'INCOMPLETE';
    } else if (missingElements.length > 0) {
      accuracy = 'MOSTLY_ACCURATE';
    }

    return {
      accuracy,
      keyElementsCovered,
      missingElements
    };
  }

  /**
   * Determine overall quality based on score
   */
  private determineQuality(score: number): 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' {
    if (score >= 0.9) return 'EXCELLENT';
    if (score >= 0.7) return 'GOOD';
    if (score >= 0.5) return 'FAIR';
    return 'POOR';
  }

  /**
   * Evaluate memory messages from vector database
   */
  async evaluateMemoryMessages(
    memoryMessages: Array<{
      vector_id: string;
      metadata: string;
      originalContent?: string;
      summarizedContent?: string;
    }>
  ): Promise<{
    overallQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    evaluations: Array<{
      vector_id: string;
      score: number;
      quality: string;
      culturalAccuracy: string;
    }>;
    recommendations: string[];
  }> {
    const evaluations = [];
    let totalScore = 0;
    let validEvaluations = 0;

    for (const message of memoryMessages) {
      if (message.originalContent && message.summarizedContent) {
        const evaluation = await this.evaluateCulturalSummary(
          message.originalContent,
          message.summarizedContent
        );

        evaluations.push({
          vector_id: message.vector_id,
          score: evaluation.score,
          quality: evaluation.quality,
          culturalAccuracy: evaluation.info.culturalAccuracy
        });

        totalScore += evaluation.score;
        validEvaluations++;
      }
    }

    const averageScore = validEvaluations > 0 ? totalScore / validEvaluations : 0;
    const overallQuality = this.determineQuality(averageScore);

    // Generate recommendations
    const recommendations = this.generateRecommendations(evaluations);

    return {
      overallQuality,
      evaluations,
      recommendations
    };
  }

  /**
   * Generate recommendations based on evaluation results
   */
  private generateRecommendations(evaluations: Array<{
    score: number;
    quality: string;
    culturalAccuracy: string;
  }>): string[] {
    const recommendations: string[] = [];
    
    const poorQualityCount = evaluations.filter(e => e.quality === 'POOR').length;
    const inaccurateCount = evaluations.filter(e => e.culturalAccuracy === 'INCOMPLETE').length;

    if (poorQualityCount > evaluations.length * 0.3) {
      recommendations.push(
        'Improve summarization quality by ensuring key cultural information is preserved',
        'Review and update summarization prompts to better capture cultural nuances'
      );
    }

    if (inaccurateCount > evaluations.length * 0.2) {
      recommendations.push(
        'Enhance cultural accuracy by including domain-specific validation',
        'Add cultural heritage expert review for sensitive content'
      );
    }

    if (evaluations.length < 5) {
      recommendations.push(
        'Increase sample size for more comprehensive evaluation',
        'Collect more diverse cultural heritage examples for testing'
      );
    }

    return recommendations;
  }
}

/**
 * Example usage for testing cultural summarization evaluation
 */
export async function testCulturalSummarizationEvaluation() {
  const evaluator = new CulturalSummarizationEvaluator();

  const testCases = [
    {
      original: `Batik adalah seni kain tradisional Indonesia yang menggunakan teknik lilin (wax-resist dyeing). 
        Proses pembuatan batik dimulai dengan menggambar pola pada kain menggunakan canting, alat khusus yang berisi lilin panas. 
        Setelah itu, kain dicelup ke dalam pewarna alami seperti indigo untuk warna biru atau soga untuk warna coklat. 
        Batik memiliki makna filosofis yang mendalam, dengan setiap motif menceritakan nilai-nilai budaya Jawa. 
        Pada tahun 2009, UNESCO mengakui batik sebagai Warisan Budaya Takbenda Dunia dari Indonesia.`,
      summary: `Batik adalah seni tradisional Indonesia menggunakan teknik lilin dan pewarna alami. 
        Setiap motif memiliki makna filosofis budaya Jawa. UNESCO mengakui batik sebagai Warisan Dunia pada 2009.`
    },
    {
      original: `Keris adalah senjata tradisional asimetris khas Nusantara yang memiliki nilai spiritual tinggi. 
        Pembuatan keris melibatkan proses spiritual yang panjang oleh empu (pandai besi keris). 
        Teknik pamor (pola logam) diciptakan melalui pelipatan logam berulang kali. 
        Keris tidak hanya berfungsi sebagai senjata, tetapi juga sebagai pusaka yang dipercaya memiliki kekuatan magis. 
        Bentuk keris yang berlekuk memiliki jumlah luk (lekukan) yang bermakna simbolis tertentu.`,
      summary: `Keris adalah senjata tradisional Nusantara dengan nilai spiritual. Dibuat oleh empu dengan teknik pamor khusus.`
    }
  ];

  console.log('📝 Testing Cultural Summarization Evaluation...\n');

  for (const testCase of testCases) {
    const result = await evaluator.evaluateCulturalSummary(
      testCase.original, 
      testCase.summary
    );
    
    console.log(`Original length: ${testCase.original.length} chars`);
    console.log(`Summary length: ${testCase.summary.length} chars`);
    console.log(`Quality: ${result.quality}`);
    console.log(`Score: ${result.score}`);
    console.log(`Cultural Accuracy: ${result.info.culturalAccuracy}`);
    console.log(`Key Elements Covered: ${result.info.keyElementsCovered.join(', ')}`);
    console.log(`Missing Elements: ${result.info.missingElements.join(', ')}`);
    console.log('---\n');
  }
}
