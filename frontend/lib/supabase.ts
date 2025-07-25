import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // We'll handle this manually in React Native
  },
});

// Database types for TypeScript
export interface ScannedScripture {
  id: string;
  title: string;
  description: string;
  user_id: string;
  submission_date: string;
  status: 'processing' | 'transliterating' | 'reviewing' | 'approved' | 'certified' | 'rejected';
  progress: number;
  thumbnail_url?: string;
  image_urls: string[];
  analysis_result?: any;
  created_at: string;
  updated_at: string;
}

export interface ScanResult {
  success: boolean;
  data?: any;
  processing_time_ms?: number;
  timestamp?: string;
  message?: string;
}
