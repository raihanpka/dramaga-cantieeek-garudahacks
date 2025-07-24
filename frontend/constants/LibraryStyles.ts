import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const LibraryStyles = StyleSheet.create({
  header: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 24, // Added extra top padding to lower the search bar
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 0, // Ensure no border
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
    color: '#666',
  },
  searchInputContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: -1, // Negative margin to crop out system borders
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    textDecorationLine: 'none',
  } as any,
  filterButton: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 18,
    color: '#666',
  },
  gridContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: '48%',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#8B4513', // Brown background like in the image
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
  },
  pageCount: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pageIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#666',
    marginRight: 4,
    borderRadius: 2,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
