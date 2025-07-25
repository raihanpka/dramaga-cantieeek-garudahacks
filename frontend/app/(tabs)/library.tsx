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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // Sample data - replace with actual data from your API
  const historicalItems: HistoricalItem[] = [
    {
      id: '1',
      title: 'Peninggalan Raja Jawa',
      category: 'Jawa',
      imageUrl: 'https://example.com/image1.jpg',
      pageCount: 2,
    },
    {
      id: '2',
      title: 'Arsitektur Sunda Kuno',
      category: 'Sunda',
      imageUrl: 'https://example.com/image2.jpg',
      pageCount: 3,
    },
    {
      id: '3',
      title: 'Warisan Budaya Bali',
      category: 'Bali',
      imageUrl: 'https://example.com/image3.jpg',
      pageCount: 4,
    },
    {
      id: '4',
      title: 'Kerajaan Sumatra',
      category: 'Sumatra',
      imageUrl: 'https://example.com/image4.jpg',
      pageCount: 2,
    },
    {
      id: '5',
      title: 'Tradisi Kalimantan',
      category: 'Kalimantan',
      imageUrl: 'https://example.com/image5.jpg',
      pageCount: 5,
    },
    {
      id: '6',
      title: 'Candi Jawa Tengah',
      category: 'Jawa',
      imageUrl: 'https://example.com/image6.jpg',
      pageCount: 3,
    },
  ];

  React.useEffect(() => {
    // Filter items based on search text and selected filters
    let filtered = historicalItems;

    // Apply search filter
    if (searchText.trim() !== '') {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply region filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(
        item => selectedFilters.includes(item.category)
      );
    }

    setFilteredItems(filtered);
  }, [searchText, selectedFilters]);

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
    // Initialize with all items and load recent searches
    setFilteredItems(historicalItems);
    loadRecentSearches();

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, []);

  const renderHistoricalItem = ({ item }: { item: HistoricalItem }) => (
    <TouchableOpacity style={LibraryStyles.itemContainer}>
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
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header with Search */}
          <View style={styles.header}>
            <View style={styles.searchContainer}>
                <Image
                source={require('@/assets/images/search-lens-icon.png')}
                style={{ width: 20, height: 20, marginRight: 12 }}
                resizeMode="contain"
                />
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Cari di Perpustakaan"
                  placeholderTextColor="#999"
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
                  textContentType="none"
                  importantForAccessibility="no"
                />
              </View>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowFilterModal(true)}
              >
                <Image
                  source={require('@/assets/images/filter-icon.png')}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
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
            {/* Library Title */}
            <Text style={styles.libraryTitle}>Perpustakaan</Text>
            
            {/* Selected Filters Display */}
            {selectedFilters.length > 0 && (
              <View style={styles.selectedFiltersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
            <FlatList
              data={filteredItems}
              renderItem={renderHistoricalItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.gridContainer}
              columnWrapperStyle={styles.row}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
            
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
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
    color: '#666',
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
    outline: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
  } as any,
  filterButton: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 18,
    color: '#666',
  },
  bottomCardContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 40,
    paddingTop: 24,
    minHeight: 900,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  libraryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 20,
  },
  gridContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  bottomSpacing: {
    height: 100,
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
  // Filter-related styles
  selectedFiltersContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  selectedFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  selectedFilterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  removeFilterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeFilterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
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
