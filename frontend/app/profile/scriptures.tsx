import React, { useState, useCallback } from 'react';
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

interface ScannedScripture {
  id: string;
  title: string;
  description: string;
  submissionDate: string;
  status: 'processing' | 'transliterating' | 'reviewing' | 'approved' | 'certified' | 'rejected';
  thumbnailUri?: string;
  progress: number;
}

export default function ScripturesScreen() {
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
  const [scannedScriptures] = useState<ScannedScripture[]>([
    {
      id: '1',
      title: 'Prasasti Candi Borobudur',
      description: 'Photographed ancient stone inscription from Borobudur temple',
      submissionDate: '2025-01-20',
      status: 'certified',
      progress: 100,
      thumbnailUri: 'https://picsum.photos/seed/borobudur/200/150'
    },
    {
      id: '2',
      title: 'Naskah Lontar Bali',
      description: 'Photographed traditional Balinese palm leaf manuscript',
      submissionDate: '2025-01-22',
      status: 'approved',
      progress: 100,
      thumbnailUri: 'https://picsum.photos/seed/lontar/200/150'
    },
    {
      id: '3',
      title: 'Batik Jawa Klasik',
      description: 'Photographed traditional Javanese batik patterns with text',
      submissionDate: '2025-01-24',
      status: 'transliterating',
      progress: 65,
      thumbnailUri: 'https://picsum.photos/seed/batik/200/150'
    },
    {
      id: '4',
      title: 'Prasasti Sukuh',
      description: 'Photographed stone inscription from Candi Sukuh',
      submissionDate: '2025-01-25',
      status: 'processing',
      progress: 25,
      thumbnailUri: 'https://picsum.photos/seed/sukuh/200/150'
    },
    {
      id: '5',
      title: 'Wayang Kulit Jawa',
      description: 'Photographed traditional Javanese shadow puppet with inscriptions',
      submissionDate: '2025-01-26',
      status: 'reviewing',
      progress: 80,
      thumbnailUri: 'https://picsum.photos/seed/wayang/200/150'
    },
    {
      id: '6',
      title: 'Candi Prambanan Relief',
      description: 'Photographed ancient relief carvings with Sanskrit inscriptions',
      submissionDate: '2025-01-27',
      status: 'approved',
      progress: 100,
      thumbnailUri: 'https://picsum.photos/seed/prambanan/200/150'
    },
    {
      id: '7',
      title: 'Kain Songket Palembang',
      description: 'Photographed traditional Palembang songket with woven text patterns',
      submissionDate: '2025-01-28',
      status: 'certified',
      progress: 100,
      thumbnailUri: 'https://picsum.photos/seed/songket/200/150'
    }
  ]);

  const getStatusDisplay = (status: ScannedScripture['status']) => {
    const statusConfig = {
      processing: { label: 'Processing Photo', icon: '⏳', color: '#FF9500' },
      transliterating: { label: 'Transliterating', icon: '🔤', color: '#007AFF' },
      reviewing: { label: 'Expert Review', icon: '👁️', color: '#5856D6' },
      approved: { label: 'Validated', icon: '✅', color: '#34C759' },
      certified: { label: 'Certified', icon: '🏆', color: '#FFD700' },
      rejected: { label: 'Rejected', icon: '❌', color: '#FF3B30' }
    };
    return statusConfig[status];
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
                {scripture.thumbnailUri && (
                  <Image 
                    source={{ uri: scripture.thumbnailUri }} 
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
                    Photographed on {formatDate(scripture.submissionDate)}
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
