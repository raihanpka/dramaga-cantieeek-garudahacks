import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
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
      title: 'Peninggalan Raja Jawa',
      category: 'Jawa',
      imageUrl: 'https://example.com/image2.jpg',
      pageCount: 2,
    },
    {
      id: '3',
      title: 'Peninggalan Raja Jawa',
      category: 'Jawa',
      imageUrl: 'https://example.com/image3.jpg',
      pageCount: 2,
    },
    {
      id: '4',
      title: 'Peninggalan Raja Jawa',
      category: 'Jawa',
      imageUrl: 'https://example.com/image4.jpg',
      pageCount: 2,
    },
    {
      id: '5',
      title: 'Peninggalan Raja Jawa',
      category: 'Jawa',
      imageUrl: 'https://example.com/image5.jpg',
      pageCount: 2,
    },
    {
      id: '6',
      title: 'Peninggalan Raja Jawa',
      category: 'Jawa',
      imageUrl: 'https://example.com/image6.jpg',
      pageCount: 2,
    },
  ];

  React.useEffect(() => {
    // Filter items based on search text
    if (searchText.trim() === '') {
      setFilteredItems(historicalItems);
    } else {
      const filtered = historicalItems.filter(
        item =>
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.category.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchText]);

  React.useEffect(() => {
    // Initialize with all items
    setFilteredItems(historicalItems);
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
    <SafeAreaView style={GlobalStyles.container}>

      {/* Search Bar */}
      <View style={LibraryStyles.searchContainer}>
        <View style={LibraryStyles.searchBar}>
          <Text style={LibraryStyles.searchIcon}>🔍</Text>
          <View style={LibraryStyles.searchInputContainer}>
            <TextInput
              style={LibraryStyles.searchInput}
              placeholder="Cari di Perpustakaan"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              selectionColor={Colors.light.tint} 
              underlineColorAndroid="transparent" 
              autoCorrect={false} 
              autoCapitalize="none"
              selectTextOnFocus={false}
              caretHidden={false}
              importantForAccessibility="no"
              textContentType="none"
            />
          </View>
          <TouchableOpacity style={LibraryStyles.filterButton}>
            <Text style={LibraryStyles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Historical Items Grid */}
      <FlatList
        data={filteredItems}
        renderItem={renderHistoricalItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={LibraryStyles.gridContainer}
        columnWrapperStyle={LibraryStyles.row}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
