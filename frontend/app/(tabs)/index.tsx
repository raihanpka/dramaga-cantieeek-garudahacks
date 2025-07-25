import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  Dimensions,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KalaNusaLogo from '@/assets/images/KalaNusa-logo-sm-white.svg';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  // Storage key for recent searches (same as library)
  const RECENT_SEARCHES_KEY = '@library_recent_searches';

  const { user } = useAuth();
  const [firstName, setFirstName] = useState<string>('Fulan');

  useEffect(() => {
    const fetchName = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from('profiles')
        .select('fullname')
        .eq('id', user.id)
        .single();
      if (data?.fullname) {
        setFirstName(data.fullname.split(' ')[0]);
      }
    };
    fetchName();
  }, [user?.id]);

  const cardData = [
    {
      type: 'welcome',
      title: `Halo, ${firstName}! 👋`,
      subtitle: 'Selamat datang di',
      showLogo: true,
    },
    {
      type: 'fact',
      title: 'Tahukah Kamu? 🏛️',
      subtitle: 'Candi Borobudur dibangun dengan 2 juta batu tanpa menggunakan semen!',
      showLogo: false,
    },
    {
      type: 'fact',
      title: 'Fakta Menarik! 📜',
      subtitle: 'Aksara Jawa memiliki 20 huruf dasar dan 8 huruf pasangan.',
      showLogo: false,
    },
  ];

  // Recent scriptures data
  const recentScriptures = [
    {
      id: '1',
      title: 'Serat Centhini',
      category: 'Jawa',
      count: 12,
      image: require('@/assets/images/book-bg.png'),
    },
    {
      id: '2',
      title: 'Kitab Sutasoma',
      category: 'Jawa Kuno',
      count: 8,
      image: require('@/assets/images/book-bg.png'),
    },
    {
      id: '3',
      title: 'Babad Tanah Jawi',
      category: 'Jawa',
      count: 15,
      image: require('@/assets/images/book-bg.png'),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentCardIndex + 1) % cardData.length;
      setCurrentCardIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ 
        index: nextIndex, 
        animated: true 
      });
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, [currentCardIndex]);

  useEffect(() => {
    // Load recent searches when component mounts
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const storedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      } else {
        // If no stored searches, add some initial sample searches for demo
        const initialSearches = ['Candi Borobudur', 'Batik Tradisional'];
        setRecentSearches(initialSearches);
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(initialSearches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const addToRecentSearches = async (searchTerm: string) => {
    if (searchTerm.trim() === '') return;
    
    try {
      const updatedSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 2);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const handleSearchFocus = () => {
    setShowRecentSearches(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow tap on recent search
    setTimeout(() => {
      setShowRecentSearches(false);
    }, 150);
  };

  const handleRecentSearchSelect = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    setShowRecentSearches(false);
    // Navigate to library with the selected search term
    router.push({
      pathname: '/(tabs)/library',
      params: { searchQuery: searchTerm }
    });
  };

  const handleCardScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const cardWidth = screenWidth; // Full screen width per card
    const index = Math.round(contentOffsetX / cardWidth);
    setCurrentCardIndex(index);
  };

  const renderWelcomeCard = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.welcomeCardContainer}>
      <ImageBackground
        source={require('@/assets/images/index-card-welcome.png')}
        style={styles.welcomeCard}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>{item.title}</Text>
            <Text style={styles.welcomeSubtitle}>{item.subtitle}</Text>
            {item.showLogo && <KalaNusaLogo width={175} height={60} />}
          </View>
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/kala-avatar-lg.png')}
              style={styles.avatar}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  const handleScripturePress = (scriptureId: string) => {
    router.push(`/library/${scriptureId}` as any);
  };

  const handleScanPress = () => {
    router.push('/(tabs)/scan');
  };

  const handleSeeAllPress = () => {
    router.push('/(tabs)/library');
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery.trim());
      // Navigate to library with search query as state
      router.push({
        pathname: '/(tabs)/library',
        params: { searchQuery: searchQuery.trim() }
      });
    } else {
      router.push('/(tabs)/library');
    }
    setShowRecentSearches(false);
  };
  return (
    <SafeAreaView style={[styles.container, {paddingTop: Platform.OS === 'android' ? 32 : 0, paddingBottom: 24}]}> 
      <ImageBackground
        source={require('@/assets/images/book-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header with Search */}
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <Image
                source={require('@/assets/images/search-lens-icon.png')}
                style={{ width: 20, height: 20, marginRight: 12, marginTop: 10 }}
                resizeMode="contain"
              />
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Cari di sini"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onSubmitEditing={handleSearchSubmit}
                  returnKeyType="search"
                  underlineColorAndroid="transparent"
                  selectionColor="#fff"
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Recent Searches Dropdown */}
            {showRecentSearches && recentSearches.length > 0 && (
              <View style={styles.recentSearchesContainer}>
                <View style={styles.recentSearchesHeader}>
                  <Text style={styles.recentSearchesTitle}>Pencarian Terkini</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearSearchesText}>Hapus</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((searchTerm, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentSearchItem}
                    onPress={() => handleRecentSearchSelect(searchTerm)}
                  >
                    <Image
                      source={require('@/assets/images/search-lens-icon.png')}
                      style={{ width: 16, height: 16, marginRight: 12, opacity: 0.6 }}
                      resizeMode="contain"
                    />
                    <Text style={styles.recentSearchText}>{searchTerm}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* White Bottom Card Container */}
          <View style={styles.bottomCardContainer}>
            {/* Welcome Card Carousel */}
            <View style={styles.carouselContainer}>
              <FlatList
                ref={flatListRef}
                data={cardData}
                renderItem={renderWelcomeCard}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleCardScroll}
                snapToInterval={screenWidth}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContent}
              />
            </View>

          {/* Page Indicator */}
          <View style={styles.pageIndicator}>
            {cardData.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.dot, 
                  index === currentCardIndex ? styles.activeDot : null
                ]} 
              />
            ))}
          </View>

            {/* Recent Scriptures Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Arsip Terbaru</Text>
                <TouchableOpacity onPress={handleSeeAllPress}>
                  <Text style={styles.seeAllText}>Lihat Semua</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {recentScriptures.map((scripture) => (
                  <TouchableOpacity 
                    key={scripture.id}
                    style={styles.card}
                    onPress={() => handleScripturePress(scripture.id)}
                  >
                    <ImageBackground
                      source={scripture.image}
                      style={styles.cardBackground}
                      imageStyle={styles.cardImage}
                    >
                      <View style={styles.cardOverlay}>
                        <Text style={styles.cardTitle}>{scripture.title}</Text>
                        <View style={styles.cardBottom}>
                          <Text style={styles.cardCategory}>{scripture.category}</Text>
                          <View style={styles.cardInfo}>
                            <Text style={styles.cardCount}>{scripture.count}</Text>
                          </View>
                        </View>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Pindai Arsip Baru Section */}
            <View style={styles.section}>
                <TouchableOpacity style={styles.scanCard} onPress={handleScanPress}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text style={styles.scanIcon}>+</Text>
                  <Text style={styles.scanText}>Pindai Arsip Baru</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#472800',
  },
  backgroundImage: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(71, 40, 0, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderWidth: 1,
    borderColor: '#fff',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInputContainer: {
    borderWidth: 0,
    borderColor: 'transparent',
    flex: 1,
  },
  searchInput: {
    fontSize: 16,
    borderWidth: 0,
    color: '#fff',
    paddingVertical: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  } as any,
  welcomeCard: {
    backgroundColor: '#8B4513',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    flex: 1,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  avatarContainer: {
    marginLeft: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
  },
  activeDot: {
    backgroundColor: '#8B4513',
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  bottomCardContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 20,
    paddingTop: 24,
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  card: {
    width: 160,
    height: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardImage: {
    borderRadius: 12,
  },
  cardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    justifyContent: 'space-between',
    height: '100%',
  },
  cardTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCategory: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  cardInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scanCard: {
    backgroundColor: '#91522A',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  scanIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 12,
  },
  scanText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomSpacing: {
    height: 100,
  },
  carouselContainer: {
    marginBottom: 16,
  },
  carouselContent: {
    alignItems: 'center',
  },
  welcomeCardContainer: {
    width: screenWidth,
    paddingHorizontal: 20,
  },
  // Recent searches styles
  recentSearchesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentSearchesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearSearchesText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B4513',
    textTransform: 'uppercase',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});
