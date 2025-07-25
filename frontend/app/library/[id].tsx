import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import LoadingScreen from '@/components/LoadingScreen';

interface ScripturePageData {
  id: string;
  pageNumber: number;
  imageUrl: string;
  analysis?: {
    object_recognition: {
      category: string;
      specific_type: string;
      confidence: number;
      cultural_significance: string;
    };
    text_extraction: {
      extracted_text: string;
      metadata: {
        museum_name?: string;
        location?: string;
        year?: string;
        additional_info?: string;
      };
    };
    cultural_analysis: {
      origin_region: string;
      historical_period: string;
      traditional_use: string;
      artistic_elements: string[];
      preservation_notes?: string;
    };
    educational_content: {
      fun_facts: string[];
      related_culture: string;
      modern_relevance: string;
    };
  };
}

interface HistoricalItemDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  pages: ScripturePageData[];
}

export default function LibraryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<HistoricalItemDetail | null>(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Animated header
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 110; // Header height including safe area
  const minHeaderHeight = 80; // Minimum header height when sticky

  // Sample data - replace with actual API call
  const sampleData: Record<string, HistoricalItemDetail> = {
    '1': {
      id: '1',
      title: 'Peninggalan Raja Jawa',
      category: 'Jawa',
      description: 'Koleksi prasasti dan artefak dari era Kerajaan Majapahit yang memberikan wawasan mendalam tentang sistem pemerintahan dan budaya masyarakat Jawa pada abad ke-13-15.',
      pages: [
        {
          id: 'p1',
          pageNumber: 1,
          imageUrl: 'https://picsum.photos/seed/jawa1/400/600',
          analysis: {
            object_recognition: {
              category: 'Prasasti Batu',
              specific_type: 'Prasasti Kerajaan Majapahit',
              confidence: 0.92,
              cultural_significance: 'Dokumen penting yang mencatat peristiwa bersejarah dan sistem pemerintahan Majapahit'
            },
            text_extraction: {
              extracted_text: 'Swasti Śri Śaka warṣa 1215 kārttika māsa tithi pañcami śuklapakṣa...',
              metadata: {
                museum_name: 'Museum Nasional Indonesia',
                location: 'Trowulan, Jawa Timur',
                year: '1293 M',
                additional_info: 'Prasasti pendirian candi'
              }
            },
            cultural_analysis: {
              origin_region: 'Kerajaan Majapahit, Jawa Timur',
              historical_period: 'Abad ke-13-15 M, Periode Kerajaan Majapahit',
              traditional_use: 'Dokumen resmi kerajaan untuk mencatat peristiwa penting',
              artistic_elements: ['Aksara Kawi', 'Ornamen floral', 'Motif geometris'],
              preservation_notes: 'Dalam kondisi baik dengan beberapa bagian yang aus'
            },
            educational_content: {
              fun_facts: [
                'Prasasti ini menggunakan sistem penanggalan Saka',
                'Ditulis dalam bahasa Jawa Kuno dengan aksara Kawi',
                'Menandai pembangunan candi yang membutuhkan waktu 15 tahun'
              ],
              related_culture: 'Tradisi penulisan prasasti pada era Hindu-Buddha di Nusantara',
              modern_relevance: 'Memberikan pemahaman tentang sistem administrasi dan kepercayaan masyarakat Jawa pada masa lalu'
            }
          }
        },
        {
          id: 'p2',
          pageNumber: 2,
          imageUrl: 'https://picsum.photos/seed/jawa2/400/600',
          analysis: {
            object_recognition: {
              category: 'Relief Candi',
              specific_type: 'Relief Naratif Majapahit',
              confidence: 0.88,
              cultural_significance: 'Representasi visual dari cerita epik dan kehidupan sosial masyarakat Majapahit'
            },
            text_extraction: {
              extracted_text: 'Gambar relief menunjukkan prosesi kerajaan dan aktivitas ritual...',
              metadata: {
                location: 'Candi Tikus, Trowulan',
                year: 'Abad ke-14 M',
                additional_info: 'Relief bagian dari kompleks candi Majapahit'
              }
            },
            cultural_analysis: {
              origin_region: 'Kerajaan Majapahit, Jawa Timur',
              historical_period: 'Abad ke-14 M, Masa Kejayaan Majapahit',
              traditional_use: 'Media edukasi dan dokumentasi cerita keagamaan',
              artistic_elements: ['Teknik ukir rendah', 'Komposisi naratif', 'Ornamen tradisional Jawa'],
            },
            educational_content: {
              fun_facts: [
                'Relief ini menggambarkan kehidupan istana Majapahit',
                'Teknik ukir yang digunakan mencerminkan kemahiran seniman Jawa',
                'Setiap detail relief memiliki makna simbolis yang mendalam'
              ],
              related_culture: 'Seni relief candi Indonesia yang terpengaruh budaya Hindu-Buddha',
              modern_relevance: 'Inspirasi untuk seni ukir dan arsitektur modern Indonesia'
            }
          }
        }
      ]
    },
    '2': {
      id: '2',
      title: 'Arsitektur Sunda Kuno',
      category: 'Sunda',
      description: 'Dokumentasi arsitektur tradisional Sunda yang menampilkan keunikan desain dan filosofi bangunan yang harmonis dengan alam.',
      pages: [
        {
          id: 'p1',
          pageNumber: 1,
          imageUrl: 'https://picsum.photos/seed/sunda1/400/600',
        },
        {
          id: 'p2',
          pageNumber: 2,
          imageUrl: 'https://picsum.photos/seed/sunda2/400/600',
        },
        {
          id: 'p3',
          pageNumber: 3,
          imageUrl: 'https://picsum.photos/seed/sunda3/400/600',
        }
      ]
    }
  };

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API URL
        const response = await fetch(`http://localhost:4000/library/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setItem(result.data);
        } else {
          console.error('Failed to fetch scripture data:', result.error);
        }
      } catch (error) {
        console.error('API fetch error:', error);
        // Fallback to sample data for development
        if (id && sampleData[id]) {
          setItem(sampleData[id]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const currentPage = item?.pages[selectedPageIndex];

  // Animated header transforms
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight + minHeaderHeight],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [1, 1, 1], // Keep solid opacity
    extrapolate: 'clamp',
  });

  // Header title appears only when scrolled past the original title
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight + 50, headerHeight + 100], // Adjust these values as needed
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  if (loading) {
    return (
      <LoadingScreen 
        message="Memuat naskah..." 
        subMessage="Mengambil data analisis budaya"
      />
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Item tidak ditemukan</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.animatedHeader,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          }
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButtonHeader}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Image
              source={require('@/assets/images/backarrow-icon.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          
          <Animated.View 
            style={[
              styles.headerTitleContainer,
              { opacity: headerTitleOpacity }
            ]}
          >
            <Text 
              style={styles.headerTitle} 
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
          </Animated.View>
          
          <View style={styles.headerSpacer} />
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 110 }}
      >
        {/* Item Info */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.itemDescription}>{item.description}</Text>
        </View>

        {/* Page Navigation */}
        <View style={styles.pageNavigation}>
          <Text style={styles.pageTitle}>Halaman ({item.pages.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pageScroll}>
            {item.pages.map((page, index) => (
              <TouchableOpacity
                key={page.id}
                onPress={() => setSelectedPageIndex(index)}
                style={[
                  styles.pageButton,
                  selectedPageIndex === index && styles.pageButtonActive
                ]}
              >
                <Text style={[
                  styles.pageButtonText,
                  selectedPageIndex === index && styles.pageButtonTextActive
                ]}>
                  {page.pageNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Current Page Display */}
        {currentPage && (
          <View style={styles.currentPageContainer}>
            <TouchableOpacity onPress={() => setShowFullImage(true)} style={styles.imageContainer}>
              <Image source={{ uri: currentPage.imageUrl }} style={styles.pageImage} />
              <View style={styles.expandHint}>
                <Text style={styles.expandHintText}>Tap untuk memperbesar</Text>
              </View>
            </TouchableOpacity>

            {/* Analysis Information */}
            {currentPage.analysis && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisTitle}>Analisis Naskah</Text>

                {/* Object Recognition */}
                <View style={styles.analysisSection}>
                  <Text style={styles.sectionTitle}>Identifikasi Objek</Text>
                  <Text style={styles.sectionText}>
                    <Text style={styles.label}>Kategori: </Text>
                    {currentPage.analysis.object_recognition.category}
                  </Text>
                  <Text style={styles.sectionText}>
                    <Text style={styles.label}>Jenis: </Text>
                    {currentPage.analysis.object_recognition.specific_type}
                  </Text>
                  <Text style={styles.sectionText}>
                    <Text style={styles.label}>Tingkat Kepercayaan: </Text>
                    {(currentPage.analysis.object_recognition.confidence * 100).toFixed(0)}%
                  </Text>
                  <Text style={styles.culturalText}>
                    {currentPage.analysis.object_recognition.cultural_significance}
                  </Text>
                </View>

                {/* Extracted Text */}
                {currentPage.analysis.text_extraction.extracted_text && (
                  <View style={styles.analysisSection}>
                    <Text style={styles.sectionTitle}>Teks Terekstrak</Text>
                    <View style={styles.textContainer}>
                      <Text style={styles.extractedText}>
                        {currentPage.analysis.text_extraction.extracted_text}
                      </Text>
                    </View>
                    {currentPage.analysis.text_extraction.metadata.museum_name && (
                      <Text style={styles.metadataText}>
                        📍 {currentPage.analysis.text_extraction.metadata.museum_name}
                      </Text>
                    )}
                    {currentPage.analysis.text_extraction.metadata.year && (
                      <Text style={styles.metadataText}>
                        📅 {currentPage.analysis.text_extraction.metadata.year}
                      </Text>
                    )}
                  </View>
                )}

                {/* Cultural Analysis */}
                <View style={styles.analysisSection}>
                  <Text style={styles.sectionTitle}>Analisis Budaya</Text>
                  <Text style={styles.sectionText}>
                    <Text style={styles.label}>Asal Daerah: </Text>
                    {currentPage.analysis.cultural_analysis.origin_region}
                  </Text>
                  <Text style={styles.sectionText}>
                    <Text style={styles.label}>Periode: </Text>
                    {currentPage.analysis.cultural_analysis.historical_period}
                  </Text>
                  <Text style={styles.sectionText}>
                    <Text style={styles.label}>Fungsi Tradisional: </Text>
                    {currentPage.analysis.cultural_analysis.traditional_use}
                  </Text>
                  
                  {currentPage.analysis.cultural_analysis.artistic_elements.length > 0 && (
                    <View style={styles.elementsContainer}>
                      <Text style={styles.label}>Elemen Seni:</Text>
                      {currentPage.analysis.cultural_analysis.artistic_elements.map((element, idx) => (
                        <Text key={idx} style={styles.elementItem}>• {element}</Text>
                      ))}
                    </View>
                  )}
                </View>

                {/* Educational Content */}
                <View style={styles.analysisSection}>
                  <Text style={styles.sectionTitle}>Konten Edukatif</Text>
                  
                  <View style={styles.factsContainer}>
                    <Text style={styles.label}>Fakta Menarik:</Text>
                    {currentPage.analysis.educational_content.fun_facts.map((fact, idx) => (
                      <Text key={idx} style={styles.factItem}>🌟 {fact}</Text>
                    ))}
                  </View>

                  <Text style={styles.sectionText}>
                    <Text style={styles.label}>Budaya Terkait: </Text>
                    {currentPage.analysis.educational_content.related_culture}
                  </Text>
                  
                  <Text style={styles.sectionText}>
                    <Text style={styles.label}>Relevansi Modern: </Text>
                    {currentPage.analysis.educational_content.modern_relevance}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Full Image Modal */}
      <Modal
        visible={showFullImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFullImage(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalClose}
            onPress={() => setShowFullImage(false)}
            activeOpacity={1}
          >
            <View style={styles.modalImageContainer}>
              <Image 
                source={{ uri: currentPage?.imageUrl }} 
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowFullImage(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
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
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    color: '#ffffff',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 20,
    paddingBottom: 10,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#472800',
    paddingTop: 50,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44, // Same width as back button to balance
  },
  backButtonHeader: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  itemInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  itemTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  itemDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  pageNavigation: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pageTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  pageScroll: {
    flexDirection: 'row',
  },
  pageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  currentPageContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    minHeight: 600,
  },
  imageContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  pageImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  expandHint: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  expandHintText: {
    color: 'white',
    fontSize: 12,
  },
  analysisContainer: {
    paddingHorizontal: 20,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  analysisSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#472800',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  label: {
    fontWeight: '600',
    color: '#472800',
  },
  culturalText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 20,
  },
  textContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#472800',
    marginBottom: 8,
  },
  extractedText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  metadataText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  elementsContainer: {
    marginTop: 8,
  },
  elementItem: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    marginBottom: 4,
  },
  factsContainer: {
    marginBottom: 12,
  },
  factItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalImageContainer: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});
