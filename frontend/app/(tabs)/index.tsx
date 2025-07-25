import React from 'react';
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
} from 'react-native';
import KalaNusaLogo from '@/assets/images/KalaNusa-logo-sm-white.svg';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/book-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header with Search */}
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari di sini"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* White Bottom Card Container */}
          <View style={styles.bottomCardContainer}>
            {/* Welcome Card */}
            <ImageBackground
            source={require('@/assets/images/index-card-welcome.png')}
            style={styles.welcomeCard}
            imageStyle={{ borderRadius: 16 }}
            >
            <View style={styles.welcomeContent}>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeTitle}>Halo, Fulan! 👋</Text>
                <Text style={styles.welcomeSubtitle}>Selamat datang di</Text>
                <KalaNusaLogo width={175} height={60} />
              </View>
              <View style={styles.avatarContainer}>
              <Image
                source={require('@/assets/images/kala-avatar-lg.png')}
                style={styles.avatar}
              />
              </View>
            </View>
            </ImageBackground>

          {/* Page Indicator */}
          <View style={styles.pageIndicator}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

            {/* Peninggalan Raja Jawa Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Peninggalan Raja Jawa</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <TouchableOpacity style={styles.card}>
                  <ImageBackground
                    source={require('@/assets/images/book-bg.png')}
                    style={styles.cardBackground}
                    imageStyle={styles.cardImage}
                  >
                    <View style={styles.cardOverlay}>
                      <Text style={styles.cardTitle}>Peninggalan Raja Jawa</Text>
                      <View style={styles.cardBottom}>
                        <Text style={styles.cardCategory}>Jawa</Text>
                        <View style={styles.cardInfo}>
                          <Text style={styles.cardCount}>2</Text>
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}>
                  <ImageBackground
                    source={require('@/assets/images/book-bg.png')}
                    style={styles.cardBackground}
                    imageStyle={styles.cardImage}
                  >
                    <View style={styles.cardOverlay}>
                      <Text style={styles.cardTitle}>Peninggalan Raja Jawa</Text>
                      <View style={styles.cardBottom}>
                        <Text style={styles.cardCategory}>Jawa</Text>
                        <View style={styles.cardInfo}>
                          <Text style={styles.cardCount}>2</Text>
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}>
                  <ImageBackground
                    source={require('@/assets/images/book-bg.png')}
                    style={styles.cardBackground}
                    imageStyle={styles.cardImage}
                  >
                    <View style={styles.cardOverlay}>
                      <Text style={styles.cardTitle}>Peninggalan Raja Jawa</Text>
                      <View style={styles.cardBottom}>
                        <Text style={styles.cardCategory}>Jawa</Text>
                        <View style={styles.cardInfo}>
                          <Text style={styles.cardCount}>2</Text>
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Pindai Arsip Baru Section */}
            <View style={styles.section}>
              <TouchableOpacity style={styles.scanCard}>
                <Text style={styles.scanIcon}>+</Text>
                <Text style={styles.scanText}>Pindai Arsip Baru</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  welcomeCard: {
    backgroundColor: '#8B4513',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
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
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: 'white',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bottomCardContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 40,
    paddingTop: 24,
    minHeight: 900, // <-- Make taller by increasing minHeight
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 16,
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
    backgroundColor: '#8B4513',
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
});
