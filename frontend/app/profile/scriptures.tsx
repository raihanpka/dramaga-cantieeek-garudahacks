import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StyleSheet,
  BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { ProfileStyles } from '@/constants/ProfileStyles';
import { supabase } from '@/lib/supabase';

interface ScannedScripture {
  id: string;
  title: string;
  description: string;
  submission_date: string;
  status: string;
  progress: number;
  thumbnail_url?: string;
  image_urls: string[];
  analysis_result?: any;
}


export default function ScripturesScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  // Handle Android hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (router.canGoBack && router.canGoBack()) {
          router.back();
          return true;
        }
        // Prevent error: do nothing if can't go back
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );
  const [scannedScriptures, setScannedScriptures] = useState<ScannedScripture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch userId from Supabase Auth on mount
  useEffect(() => {
    const getUserId = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user?.id) {
        setUserId(data.user.id);
      } else {
        setUserId(null);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchScriptures = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('scanned_scriptures')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setScannedScriptures(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchScriptures();
  }, [userId]);

  const getStatusDisplay = (status: string) => {
    const statusConfig: any = {
      processing: { label: 'Processing Photo', icon: '⏳', color: '#FF9500' },
      transliterating: { label: 'Transliterating', icon: '🔤', color: '#007AFF' },
      reviewing: { label: 'Expert Review', icon: '👁️', color: '#5856D6' },
      approved: { label: 'Validated', icon: '✅', color: '#34C759' },
      certified: { label: 'Certified', icon: '🏆', color: '#FFD700' },
      rejected: { label: 'Rejected', icon: '❌', color: '#FF3B30' }
    };
    return statusConfig[status] || { label: status, icon: '', color: '#888' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      {loading && <Text style={{ textAlign: 'center', marginTop: 30 }}>Loading...</Text>}
      {error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 30 }}>{error}</Text>}
      {/* Header with SafeAreaView for top only */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.light.tint }}>
        <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          if (router.canGoBack && router.canGoBack()) {
            router.back();
          }
        }}>
            <Image
              source={require('@/assets/images/backarrow-icon.png')}
              style={{ width: 24, height: 24, tintColor: 'white' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Scriptures</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      {/* Progress Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📜 Your Scriptures</Text>
        <Text style={styles.summaryText}>
          {scannedScriptures.filter(s => s.status === 'certified' || s.status === 'approved').length} of {scannedScriptures.length} scriptures processed
        </Text>
        <View style={styles.overallProgress}>
          <View style={styles.overallProgressBar}>
            <View style={[
              styles.overallProgressFill,
              { width: `${(scannedScriptures.filter(s => s.status === 'certified' || s.status === 'approved').length / scannedScriptures.length) * 100}%` }
            ]} />
          </View>
          <Text style={styles.overallProgressText}>
            {Math.round((scannedScriptures.filter(s => s.status === 'certified' || s.status === 'approved').length / scannedScriptures.length) * 100)}%
          </Text>
        </View>
      </View>

      {/* Scriptures List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scripturesList}>
          {scannedScriptures.map((scripture) => {
            const statusInfo = getStatusDisplay(scripture.status);
            const isClickable = scripture.status === 'certified' || scripture.status === 'approved';
            
            const handleScripturePress = () => {
              if (isClickable) {
                // Navigate to library detail page with the scripture ID
                router.push({
                  pathname: '/library/[id]',
                  params: { id: scripture.id }
                });
              }
            };

            const ScriptureContent = (
              <View style={ProfileStyles.scriptureMainContent}>
                {scripture.thumbnail_url && (
                  <Image 
                    source={{ uri: scripture.thumbnail_url }} 
                    style={ProfileStyles.scriptureThumbnail}
                  />
                )}
                <View style={ProfileStyles.scriptureInfo}>
                  <View style={ProfileStyles.scriptureHeader}>
                    <Text style={ProfileStyles.scriptureTitle}>{scripture.title}</Text>
                    <View style={[ProfileStyles.statusBadge, { backgroundColor: statusInfo.color }]}>
                      <Text style={ProfileStyles.statusText}>{statusInfo.label}</Text>
                    </View>
                  </View>
                  
                  <Text style={ProfileStyles.scriptureDescription}>{scripture.description}</Text>
                  <Text style={ProfileStyles.scriptureDate}>
                    Photographed on {formatDate(scripture.submission_date)}
                  </Text>
                  
                  {scripture.progress < 100 && (
                    <View style={ProfileStyles.progressContainer}>
                      <View style={ProfileStyles.progressBar}>
                        <View 
                          style={[
                            ProfileStyles.progressFill, 
                            { 
                              width: `${scripture.progress}%`,
                              backgroundColor: statusInfo.color 
                            }
                          ]} 
                        />
                      </View>
                      <Text style={ProfileStyles.progressText}>
                        {scripture.progress}% complete
                      </Text>
                    </View>
                  )}
                  
                  {/* Show clickable indicator for certified/approved scriptures */}
                  {isClickable && (
                    <View style={ProfileStyles.clickableIndicator}>
                      <Text style={ProfileStyles.clickableText}>📖 Tap to view in library</Text>
                    </View>
                  )}
                </View>
              </View>
            );

            return (
              <View key={scripture.id} style={ProfileStyles.scriptureCard}>
                {isClickable ? (
                  <TouchableOpacity 
                    onPress={handleScripturePress}
                    style={ProfileStyles.clickableScripture}
                    activeOpacity={0.7}
                  >
                    {ScriptureContent}
                  </TouchableOpacity>
                ) : (
                  ScriptureContent
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: Colors.light.tint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  overallProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overallProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: Colors.light.tint,
    borderRadius: 4,
  },
  overallProgressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.tint,
    minWidth: 40,
  },
  scrollView: {
    flex: 1,
  },
  scripturesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
