import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Memory Messages Evaluator
 * Analyzes the quality and bias of stored memory messages from vector database
 */
export class MemoryMessagesEvaluator {
  /**
   * Load and parse memory messages from JSON file
   */
  loadMemoryMessages(filePath: string): Array<{
    id: string | null;
    vector_id: string;
    embedding: object;
    metadata: {
      message_id: string;
      thread_id: string;
      resource_id: string;
    };
  }> {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const messages = JSON.parse(fileContent);
      
      return messages.map((msg: any) => ({
        id: msg.id,
        vector_id: msg.vector_id,
        embedding: msg.embedding,
        metadata: JSON.parse(msg.metadata)
      }));
    } catch (error) {
      console.error('Error loading memory messages:', error);
      return [];
    }
  }

  /**
   * Analyze memory message patterns and quality
   */
  analyzeMemoryMessages(messages: Array<{
    vector_id: string;
    metadata: {
      message_id: string;
      thread_id: string;
      resource_id: string;
    };
  }>): {
    totalMessages: number;
    threadAnalysis: {
      [thread_id: string]: {
        messageCount: number;
        topics: string[];
      };
    };
    topicDistribution: {
      batik: number;
      keris: number;
      other: number;
    };
    recommendations: string[];
  } {
    const threadAnalysis: { [thread_id: string]: { messageCount: number; topics: string[] } } = {};
    const topicDistribution = { batik: 0, keris: 0, other: 0 };

    // Group messages by thread
    messages.forEach(message => {
      const threadId = message.metadata.thread_id;
      
      if (!threadAnalysis[threadId]) {
        threadAnalysis[threadId] = {
          messageCount: 0,
          topics: []
        };
      }
      
      threadAnalysis[threadId].messageCount++;
      
      // Identify topics based on thread ID
      if (threadId.includes('batik')) {
        topicDistribution.batik++;
        if (!threadAnalysis[threadId].topics.includes('batik')) {
          threadAnalysis[threadId].topics.push('batik');
        }
      } else if (threadId.includes('keris')) {
        topicDistribution.keris++;
        if (!threadAnalysis[threadId].topics.includes('keris')) {
          threadAnalysis[threadId].topics.push('keris');
        }
      } else {
        topicDistribution.other++;
        if (!threadAnalysis[threadId].topics.includes('general')) {
          threadAnalysis[threadId].topics.push('general');
        }
      }
    });

    // Generate recommendations
    const recommendations = this.generateMemoryRecommendations(
      messages.length, 
      threadAnalysis, 
      topicDistribution
    );

    return {
      totalMessages: messages.length,
      threadAnalysis,
      topicDistribution,
      recommendations
    };
  }

  /**
   * Generate recommendations for memory optimization
   */
  private generateMemoryRecommendations(
    totalMessages: number,
    threadAnalysis: { [thread_id: string]: { messageCount: number; topics: string[] } },
    topicDistribution: { batik: number; keris: number; other: number }
  ): string[] {
    const recommendations: string[] = [];

    // Check message volume
    if (totalMessages < 10) {
      recommendations.push(
        'Low message count - consider adding more diverse cultural heritage conversations',
        'Increase user engagement to build better memory context'
      );
    } else if (totalMessages > 1000) {
      recommendations.push(
        'High message volume - implement memory pruning strategy',
        'Consider archiving older conversations to improve performance'
      );
    }

    // Check topic balance
    const totalTopicMessages = topicDistribution.batik + topicDistribution.keris + topicDistribution.other;
    if (totalTopicMessages > 0) {
      const batikPercentage = (topicDistribution.batik / totalTopicMessages) * 100;
      const kerisPercentage = (topicDistribution.keris / totalTopicMessages) * 100;
      const otherPercentage = (topicDistribution.other / totalTopicMessages) * 100;

      if (batikPercentage > 70) {
        recommendations.push(
          'Heavy focus on batik topics - consider encouraging more diverse cultural discussions',
          'Add more content about other Indonesian cultural heritage items'
        );
      }

      if (kerisPercentage < 10 && topicDistribution.keris > 0) {
        recommendations.push(
          'Limited keris discussions - enhance keris-related content and engagement'
        );
      }

      if (otherPercentage > 50) {
        recommendations.push(
          'Many general conversations - guide users toward specific cultural heritage topics'
        );
      }
    }

    // Check thread depth
    const threadCounts = Object.values(threadAnalysis).map(t => t.messageCount);
    const avgMessagesPerThread = threadCounts.reduce((a, b) => a + b, 0) / threadCounts.length;

    if (avgMessagesPerThread < 3) {
      recommendations.push(
        'Shallow conversations - encourage deeper cultural discussions',
        'Implement follow-up questions to extend cultural heritage conversations'
      );
    }

    return recommendations;
  }

  /**
   * Evaluate memory quality for bias and cultural sensitivity
   */
  async evaluateMemoryQuality(messages: Array<{
    vector_id: string;
    metadata: {
      message_id: string;
      thread_id: string;
      resource_id: string;
    };
  }>): Promise<{
    overallQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    culturalTopics: {
      [topic: string]: {
        messageCount: number;
        threadCount: number;
        quality: 'HIGH' | 'MEDIUM' | 'LOW';
      };
    };
    diversityScore: number;
    recommendations: string[];
  }> {
    // Analyze cultural topic diversity
    const culturalTopics: { [topic: string]: { messageCount: number; threadCount: number; quality: 'HIGH' | 'MEDIUM' | 'LOW' } } = {};
    const uniqueThreads = new Set<string>();

    messages.forEach(message => {
      const threadId = message.metadata.thread_id;
      uniqueThreads.add(threadId);

      // Extract cultural topics from thread IDs
      const topics = this.extractCulturalTopics(threadId);
      topics.forEach(topic => {
        if (!culturalTopics[topic]) {
          culturalTopics[topic] = {
            messageCount: 0,
            threadCount: 0,
            quality: 'MEDIUM'
          };
        }
        culturalTopics[topic].messageCount++;
      });
    });

    // Count unique threads per topic
    uniqueThreads.forEach(threadId => {
      const topics = this.extractCulturalTopics(threadId);
      topics.forEach(topic => {
        if (culturalTopics[topic]) {
          culturalTopics[topic].threadCount++;
        }
      });
    });

    // Calculate diversity score
    const topicCount = Object.keys(culturalTopics).length;
    const expectedTopics = ['batik', 'keris', 'wayang', 'candi', 'gamelan'];
    const diversityScore = Math.min(topicCount / expectedTopics.length, 1.0);

    // Determine overall quality
    let overallQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' = 'FAIR';
    if (diversityScore >= 0.8 && messages.length >= 20) {
      overallQuality = 'EXCELLENT';
    } else if (diversityScore >= 0.6 && messages.length >= 10) {
      overallQuality = 'GOOD';
    } else if (messages.length < 5) {
      overallQuality = 'POOR';
    }

    const recommendations = this.generateQualityRecommendations(
      overallQuality,
      diversityScore,
      culturalTopics,
      messages.length
    );

    return {
      overallQuality,
      culturalTopics,
      diversityScore,
      recommendations
    };
  }

  /**
   * Extract cultural topics from thread ID or content
   */
  private extractCulturalTopics(threadId: string): string[] {
    const topics: string[] = [];
    const lowerThreadId = threadId.toLowerCase();

    const topicKeywords = {
      batik: ['batik'],
      keris: ['keris', 'kris'],
      wayang: ['wayang', 'puppet'],
      candi: ['candi', 'temple', 'borobudur', 'prambanan'],
      gamelan: ['gamelan', 'music'],
      dance: ['dance', 'tari', 'saman', 'kecak'],
      craft: ['craft', 'kerajinan', 'anyaman']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerThreadId.includes(keyword))) {
        topics.push(topic);
      }
    }

    return topics.length > 0 ? topics : ['general'];
  }

  /**
   * Generate quality improvement recommendations
   */
  private generateQualityRecommendations(
    overallQuality: string,
    diversityScore: number,
    culturalTopics: { [topic: string]: any },
    messageCount: number
  ): string[] {
    const recommendations: string[] = [];

    if (overallQuality === 'POOR') {
      recommendations.push(
        'Critical: Very limited cultural heritage conversations',
        'Implement targeted prompts to encourage cultural discussions',
        'Add cultural heritage onboarding flow for new users'
      );
    }

    if (diversityScore < 0.5) {
      recommendations.push(
        'Low topic diversity - introduce conversations about various cultural items',
        'Create topic rotation system to ensure balanced cultural coverage'
      );
    }

    if (messageCount < 10) {
      recommendations.push(
        'Insufficient conversation data for reliable bias evaluation',
        'Encourage longer conversations about cultural heritage topics'
      );
    }

    const topicCounts = Object.values(culturalTopics).map((t: any) => t.messageCount);
    const maxCount = Math.max(...topicCounts);
    const minCount = Math.min(...topicCounts);

    if (maxCount > minCount * 3) {
      recommendations.push(
        'Unbalanced topic distribution - some cultural areas are under-represented',
        'Implement topic balancing in conversation flow'
      );
    }

    return recommendations;
  }
}

/**
 * Test function for memory messages evaluation
 */
export async function testMemoryMessagesEvaluation() {
  const evaluator = new MemoryMessagesEvaluator();
  
  // Load actual memory messages from the JSON file
  const memoryFilePath = join(process.cwd(), 'memory_messages_384.json');
  
  console.log('📁 Loading memory messages from:', memoryFilePath);
  
  try {
    const messages = evaluator.loadMemoryMessages(memoryFilePath);
    console.log(`✅ Loaded ${messages.length} memory messages\n`);

    // Analyze message patterns
    const analysis = evaluator.analyzeMemoryMessages(messages);
    console.log('📊 Memory Messages Analysis:');
    console.log(`Total Messages: ${analysis.totalMessages}`);
    console.log(`Threads: ${Object.keys(analysis.threadAnalysis).length}`);
    console.log('Topic Distribution:');
    console.log(`  - Batik: ${analysis.topicDistribution.batik} messages`);
    console.log(`  - Keris: ${analysis.topicDistribution.keris} messages`);
    console.log(`  - Other: ${analysis.topicDistribution.other} messages`);
    
    console.log('\n🧵 Thread Analysis:');
    Object.entries(analysis.threadAnalysis).forEach(([threadId, data]) => {
      console.log(`  ${threadId}: ${data.messageCount} messages, topics: ${data.topics.join(', ')}`);
    });

    // Evaluate memory quality
    const qualityEvaluation = await evaluator.evaluateMemoryQuality(messages);
    console.log(`\n🎯 Overall Quality: ${qualityEvaluation.overallQuality}`);
    console.log(`🌈 Diversity Score: ${(qualityEvaluation.diversityScore * 100).toFixed(1)}%`);
    
    console.log('\n📚 Cultural Topics Coverage:');
    Object.entries(qualityEvaluation.culturalTopics).forEach(([topic, data]) => {
      console.log(`  ${topic}: ${data.messageCount} messages across ${data.threadCount} threads`);
    });

    console.log('\n💡 Recommendations:');
    [...analysis.recommendations, ...qualityEvaluation.recommendations].forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });

  } catch (error) {
    console.error('❌ Error during evaluation:', error);
  }
}

// Auto-run if called directly
if (import.meta.main) {
  testMemoryMessagesEvaluation().catch(console.error);
}
