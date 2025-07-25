// Interface untuk response API scan
export interface ScanResult {
  success: boolean;
  data: {
    object_type: string;
    object_name: string;
    confidence_score: number;
    cultural_context: {
      origin: string;
      historical_period: string;
      cultural_significance: string;
      traditional_uses: string[];
    };
    description: string;
    recommendations: {
      conservation_tips: string[];
      learning_resources: string[];
      related_artifacts: string[];
    };
  };
  processing_time_ms: number;
  timestamp: string;
  message: string;
}

export interface ScanError {
  success: false;
  error: string;
  message: string;
  processing_time_ms: number;
  timestamp: string;
}
