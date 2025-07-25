
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

interface AnalysisResult {
  origin_region?: string;
  historical_period?: string;
  traditional_use?: string;
  artistic_elements?: string[];
}

interface HistoricalItemDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  image_urls: string[];
  analysis_result?: AnalysisResult;
}

export default function LibraryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<HistoricalItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase
          .from('scanned_scriptures')
          .select('*')
          .eq('id', id)
          .single();
        if (error || !data) throw error || new Error('Data tidak ditemukan');
        let analysis_result: AnalysisResult | undefined = undefined;
        if (data.analysis_result) {
          try {
            analysis_result = typeof data.analysis_result === 'string'
              ? JSON.parse(data.analysis_result)
              : data.analysis_result;
          } catch (e) {
            // ignore parse error
          }
        }
        setItem({
          id: data.id,
          title: data.title,
          category: data.category,
          description: data.description,
          image_urls: data.image_urls || [],
          analysis_result,
        });
      } catch (e: any) {
        setError('Gagal memuat detail arsip.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const images = item?.image_urls || [];
  const currentImage = images[selectedPageIndex] || images[0];

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Memuat detail arsip...</Text>
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Data tidak ditemukan.'}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonHeader}>
          <Text style={styles.backButtonHeaderText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{item.title}</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Info */}
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        {item.description && <Text style={styles.description}>{item.description}</Text>}
        {/* Page Navigation */}
        {images.length > 1 && (
          <View style={styles.pageNav}>
            <Text style={styles.pageNavTitle}>Halaman ({images.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.pageButton, selectedPageIndex === idx && styles.pageButtonActive]}
                  onPress={() => setSelectedPageIndex(idx)}
                >
                  <Text style={[styles.pageButtonText, selectedPageIndex === idx && styles.pageButtonTextActive]}>{idx + 1}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {/* Image */}
        {currentImage && (
          <TouchableOpacity style={styles.imageContainer} onPress={() => setShowFullImage(true)}>
            <Image source={{ uri: currentImage }} style={styles.pageImage} resizeMode="cover" />
            <Text style={styles.expandHint}>Tap untuk memperbesar</Text>
          </TouchableOpacity>
        )}

        {/* Analysis Section */}
        {item.analysis_result && (
          <View style={styles.analysisContainer}>
            <Text style={styles.analysisTitle}>Analisis Budaya</Text>
            {item.analysis_result.origin_region && (
              <Text style={styles.analysisText}><Text style={styles.label}>Asal Daerah: </Text>{item.analysis_result.origin_region}</Text>
            )}
            {item.analysis_result.historical_period && (
              <Text style={styles.analysisText}><Text style={styles.label}>Periode: </Text>{item.analysis_result.historical_period}</Text>
            )}
            {item.analysis_result.traditional_use && (
              <Text style={styles.analysisText}><Text style={styles.label}>Fungsi Tradisional: </Text>{item.analysis_result.traditional_use}</Text>
            )}
            {item.analysis_result.artistic_elements && item.analysis_result.artistic_elements.length > 0 && (
              <View style={styles.elementsContainer}>
                <Text style={styles.label}>Elemen Seni:</Text>
                {item.analysis_result.artistic_elements.map((el, idx) => (
                  <Text key={idx} style={styles.elementItem}>• {el}</Text>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      {/* Modal Full Image */}
      <Modal visible={showFullImage} transparent animationType="fade" onRequestClose={() => setShowFullImage(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setShowFullImage(false)}>
            <Image source={{ uri: currentImage }} style={styles.modalImage} resizeMode="contain" />
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#472800',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#472800',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#472800',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#472800',
    zIndex: 10,
  },
  backButtonHeader: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backButtonHeaderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  pageNav: {
    marginBottom: 20,
  },
  pageNavTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  pageButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  pageButtonActive: {
    backgroundColor: 'white',
  },
  pageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  pageButtonTextActive: {
    color: '#472800',
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  // --- Analysis section styles moved out ---
  analysisContainer: {
    marginTop: 24,
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#472800',
    marginBottom: 16,
    textAlign: 'left',
  },
  analysisText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  label: {
    fontWeight: '600',
    color: '#472800',
  },
  elementsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  elementItem: {
    fontSize: 15,
    color: '#555',
    marginLeft: 8,
    marginBottom: 4,
  },
  // --- End analysis section ---
  pageImage: {
    width: screenWidth * 0.8,
    height: 320,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  expandHint: {
    color: '#472800',
    fontSize: 12,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.7,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    position: 'absolute',
    top: 40,
    right: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
}) as any;
