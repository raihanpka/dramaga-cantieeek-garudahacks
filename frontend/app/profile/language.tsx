import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StyleSheet
} from 'react-native';
import { router } from 'expo-router';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages: Language[] = [
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'jv', name: 'Javanese', nativeName: 'ꦧꦱꦗꦮ', flag: '🏛️' },
    { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', flag: '🌺' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇱🇰' },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Here you would typically save the language preference
    // and trigger a language change in your app
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={require('@/assets/images/backarrow-icon.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
                <Text style={styles.headerTitle}>Pengaturan Bahasa</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current Language */}
        <View style={styles.currentLanguageContainer}>
          <Text style={styles.currentLanguageTitle}>Bahasa Saat Ini</Text>
          <View style={styles.currentLanguageCard}>
            <Text style={styles.currentLanguageFlag}>
              {languages.find(lang => lang.code === selectedLanguage)?.flag}
            </Text>
            <View style={styles.currentLanguageInfo}>
              <Text style={styles.currentLanguageName}>
                {languages.find(lang => lang.code === selectedLanguage)?.name}
              </Text>
              <Text style={styles.currentLanguageNative}>
                {languages.find(lang => lang.code === selectedLanguage)?.nativeName}
              </Text>
            </View>
          </View>
        </View>

        {/* Available Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bahasa yang Tersedia</Text>
          
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageItem,
                selectedLanguage === language.code && styles.selectedLanguageItem
              ]}
              onPress={() => handleLanguageSelect(language.code)}
            >
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <View style={styles.languageInfo}>
                <Text style={[
                  styles.languageName,
                  selectedLanguage === language.code && styles.selectedLanguageText
                ]}>
                  {language.name}
                </Text>
                <Text style={[
                  styles.languageNative,
                  selectedLanguage === language.code && styles.selectedLanguageNative
                ]}>
                  {language.nativeName}
                </Text>
              </View>
              {selectedLanguage === language.code && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>📝 Tentang Dukungan Bahasa</Text>
          <Text style={styles.infoText}>
            • Pengenalan naskah bersejarah bekerja paling baik dengan Bahasa Indonesia dan Inggris
          </Text>
          <Text style={styles.infoText}>
            • Bahasa tradisional (Jawa, Sunda) didukung untuk konten budaya
          </Text>
          <Text style={styles.infoText}>
            • App interface will be translated to selected language
          </Text>
          <Text style={styles.infoText}>
            • Some features may have limited support in certain languages
          </Text>
        </View>

        {/* Coming Soon */}
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonTitle}>🚀 Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            • Balinese (ᬩᬲᬩᬮᬶ)
          </Text>
          <Text style={styles.comingSoonText}>
            • Minangkabau
          </Text>
          <Text style={styles.comingSoonText}>
            • Batak
          </Text>
          <Text style={styles.comingSoonText}>
            • Real-time translation for ancient scripts
          </Text>
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
    backgroundColor: '#472800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  currentLanguageContainer: {
    padding: 20,
  },
  currentLanguageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#472800',
    marginBottom: 12,
  },
  currentLanguageCard: {
    backgroundColor: '#472800',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currentLanguageFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  currentLanguageInfo: {
    flex: 1,
  },
  currentLanguageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  currentLanguageNative: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#472800',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  selectedLanguageItem: {
    backgroundColor: '#f8f6f3',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
    width: 30,
    textAlign: 'center',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedLanguageText: {
    color: '#472800',
    fontWeight: '600',
  },
  languageNative: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedLanguageNative: {
    color: '#8B4513',
  },
  checkmark: {
    fontSize: 18,
    color: '#472800',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#472800',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#472800',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  comingSoonContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
});
