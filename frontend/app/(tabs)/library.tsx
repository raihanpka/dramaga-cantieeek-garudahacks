import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Colors } from '@/constants/Colors';
import { LibraryStyles } from '@/constants/LibraryStyles';

interface HistoricalItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  pageCount: number;
}

export default function LibraryScreen() {
  const params = useLocalSearchParams();
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState<HistoricalItem[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Storage key for recent searches
  const RECENT_SEARCHES_KEY = '@library_recent_searches';

  // Available filter options
  const filterOptions = ['Sunda', 'Jawa', 'Bali', 'Sumatra', 'Kalimantan', 'Sulawesi', 'Papua'];


  // State untuk semua arsip budaya dari Supabase
  const [allItems, setAllItems] = useState<HistoricalItem[]>([]);

  // Fetch data dari Supabase saat mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase
          .from('scanned_scriptures')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        // Map ke format HistoricalItem
        const mapped: HistoricalItem[] = (data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category || 'Lainnya',
          imageUrl: item.thumbnail_url || (item.image_urls && item.image_urls[0]) || 'https://placehold.co/300x400',
          pageCount: item.image_urls ? item.image_urls.length : 1,
        }));
        setAllItems(mapped);
        setFilteredItems(mapped);
      } catch (e) {
        setAllItems([]);
        setFilteredItems([]);
      }
    };
    fetchData();
  }, []);

  // Filtering dan search
  React.useEffect(() => {
    let filtered = allItems;
    if (searchText.trim() !== '') {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(
        item => selectedFilters.includes(item.category)
      );
    }
    setFilteredItems(filtered);
  }, [searchText, selectedFilters, allItems]);

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
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
    setSearchText(searchTerm);
    setShowRecentSearches(false);
    // Also add this search to recent searches to bump it to top
    addToRecentSearches(searchTerm);
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

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim() !== '') {
      addToRecentSearches(searchText.trim());
    }
    setShowRecentSearches(false);
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout to save search after user stops typing for 2 seconds
    if (text.trim().length > 2) {
      const timeout = setTimeout(() => {
        addToRecentSearches(text.trim());
      }, 2000);
      setSearchTimeout(timeout);
    }
  };

  React.useEffect(() => {
    // Load recent searches
    loadRecentSearches();

    // Check if ada search query dari params
    if (params.searchQuery && typeof params.searchQuery === 'string') {
      setSearchText(params.searchQuery);
      addToRecentSearches(params.searchQuery);
    }

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [params.searchQuery]);

  const renderHistoricalItem = ({ item }: { item: HistoricalItem }) => (
    <TouchableOpacity 
      style={LibraryStyles.itemContainer}
      onPress={() => router.push(`/(tabs)/library/${item.id}` as any)}
    >
      {/* Item Image */}
      <View style={LibraryStyles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={LibraryStyles.itemImage}
          defaultSource={require('@/assets/images/react-logo.png')} // Fallback image
        />
        
        {/* Overlay Content */}
        <View style={LibraryStyles.overlay}>
          <Text style={LibraryStyles.itemTitle}>{item.title}</Text>
        </View>
        
        {/* Category Badge */}
        <View style={LibraryStyles.categoryBadge}>
          <Text style={LibraryStyles.categoryText}>{item.category}</Text>
        </View>
        
        {/* Page Count */}
        <View style={LibraryStyles.pageCount}>
          <View style={LibraryStyles.pageIcon} />
          <Text style={LibraryStyles.pageText}>{item.pageCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, {paddingTop: Platform.OS === 'android' ? 32 : 0, paddingBottom: 24}]}> 
      <ImageBackground
        source={require('@/assets/images/book-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header with Search */}
          <View style={[styles.header, {paddingTop: 0}]}> 
            <View style={styles.searchContainer}>
              <Image
                source={require('@/assets/images/search-lens-icon.png')}
                style={styles.searchIcon}
                resizeMode="contain"
              />
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Cari di Perpsutakaan..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={searchText}
                  onChangeText={handleSearchChange}
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
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowFilterModal(true)}
              >
                <Image
                  source={require('@/assets/images/filter-icon.png')}
                  style={styles.filterIcon}
                  resizeMode="contain"
                />
                {selectedFilters.length > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{selectedFilters.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
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
                      style={styles.recentSearchIcon}
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
            {/* Library Header */}
            <View style={styles.libraryHeader}>
              <View>
                <Text style={styles.libraryTitle}>Perpustakaan Budaya Digital</Text>
                <Text style={styles.librarySubtitle}>
                  {filteredItems.length} arsip budaya ditemukan
                </Text>
              </View>
              <View style={styles.headerIcon}>
                <Text style={styles.headerIconText}>📚</Text>
              </View>
            </View>
            
            {/* Selected Filters Display */}
            {selectedFilters.length > 0 && (
              <View style={styles.selectedFiltersContainer}>
                <Text style={styles.filterSectionTitle}>Filter Aktif:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
                  {selectedFilters.map((filter) => (
                    <View key={filter} style={styles.selectedFilterTag}>
                      <Text style={styles.selectedFilterText}>{filter}</Text>
                      <TouchableOpacity 
                        onPress={() => removeFilter(filter)}
                        style={styles.removeFilterButton}
                      >
                        <Text style={styles.removeFilterText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
            
            {/* Historical Items Grid */}
            <View style={styles.gridSection}>
              <FlatList
                data={filteredItems}
                renderItem={renderHistoricalItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              />
            </View>
            
            {/* Empty State */}
            {filteredItems.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🔍</Text>
                <Text style={styles.emptyStateTitle}>Tidak ada hasil</Text>
                <Text style={styles.emptyStateText}>
                  Coba ubah kata kunci pencarian atau hapus filter
                </Text>
              </View>
            )}
            
            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </View>

          {/* Filter Modal */}
          <Modal
            visible={showFilterModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowFilterModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Daerah</Text>
                  <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                    <Text style={styles.closeButton}>×</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.filterOptionsContainer}>
                  {filterOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        selectedFilters.includes(option) && styles.filterOptionSelected
                      ]}
                      onPress={() => toggleFilter(option)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedFilters.includes(option) && styles.filterOptionTextSelected
                      ]}>
                        {option}
                      </Text>
                      {selectedFilters.includes(option) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={clearAllFilters}
                  >
                    <Text style={styles.clearButtonText}>Hapus Semua</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.applyButton}
                    onPress={() => setShowFilterModal(false)}
                  >
                    <Text style={styles.applyButtonText}>Terapkan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
    backgroundColor: 'rgba(71, 40, 0, 0.95)',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  searchIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
    tintColor: 'rgba(255, 255, 255, 0.8)',
  },
  searchInputContainer: {
    flex: 1,
  },
  searchInput: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 0,
    fontWeight: '500',
  } as any,
  filterButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomCardContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 20,
    paddingTop: 32,
    minHeight: 900,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  libraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 69, 19, 0.1)',
  },
  libraryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  librarySubtitle: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '500',
  },
  headerIcon: {
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    borderRadius: 20,
    padding: 12,
  },
  headerIconText: {
    fontSize: 24,
  },
  gridSection: {
    paddingHorizontal: 24,
  },
  gridContainer: {
    gap: 16,
  },
  row: {
    justifyContent: 'space-between',
    gap: 16,
  },
  bottomSpacing: {
    height: 100,
  },
  // Recent searches styles
  recentSearchesContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 12,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  recentSearchesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B4513',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  clearSearchesText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B6B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  recentSearchIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
    opacity: 0.6,
    tintColor: '#8B4513',
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  // Filter-related styles
  selectedFiltersContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 12,
  },
  filterScrollView: {
    marginTop: 8,
  },
  selectedFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedFilterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  removeFilterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeFilterText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  // Empty state styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
    padding: 8,
  },
  filterOptionsContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  filterOptionSelected: {
    backgroundColor: '#8B4513',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: 'white',
  },
  checkmark: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#8B4513',
    borderRadius: 12,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
