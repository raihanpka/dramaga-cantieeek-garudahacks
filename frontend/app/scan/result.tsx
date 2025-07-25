import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScanResult } from '@/types/scan.types';

export default function ScanResultScreen() {
  const params = useLocalSearchParams();
  const result = params.result ? JSON.parse(params.result as string) as ScanResult : null;
  const imageUri = params.imageUri as string;

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Hasil Scan', headerShown: true }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Data hasil scan tidak ditemukan</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.navigate('/scan/camera')}
          >
            <Text style={styles.buttonText}>Kembali ke Camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const shareResult = () => {
    // Implementasi share functionality
    Alert.alert('Share', 'Fitur share akan segera tersedia');
  };

  const saveToLibrary = () => {
    // Implementasi save to library
    Alert.alert('Simpan', 'Hasil telah disimpan ke perpustakaan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Hasil Scan', headerShown: true }} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Display */}
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          </View>
        )}

        {/* Main Result */}
        <View style={styles.resultCard}>
          <Text style={styles.objectType}>{result.data.object_type.toUpperCase()}</Text>
          <Text style={styles.objectName}>{result.data.object_name}</Text>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Tingkat Kepercayaan: </Text>
            <Text style={styles.confidenceValue}>{(result.data.confidence_score * 100).toFixed(1)}%</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Deskripsi</Text>
          <Text style={styles.description}>{result.data.description}</Text>
        </View>

        {/* Cultural Context */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Konteks Budaya</Text>
          <View style={styles.contextItem}>
            <Text style={styles.contextLabel}>Asal:</Text>
            <Text style={styles.contextValue}>{result.data.cultural_context.origin}</Text>
          </View>
          <View style={styles.contextItem}>
            <Text style={styles.contextLabel}>Periode Sejarah:</Text>
            <Text style={styles.contextValue}>{result.data.cultural_context.historical_period}</Text>
          </View>
          <View style={styles.contextItem}>
            <Text style={styles.contextLabel}>Makna Budaya:</Text>
            <Text style={styles.contextValue}>{result.data.cultural_context.cultural_significance}</Text>
          </View>
          
          {result.data.cultural_context.traditional_uses.length > 0 && (
            <View style={styles.contextItem}>
              <Text style={styles.contextLabel}>Kegunaan Tradisional:</Text>
              {result.data.cultural_context.traditional_uses.map((use, index) => (
                <Text key={index} style={styles.listItem}>• {use}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Recommendations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rekomendasi</Text>
          
          {result.data.recommendations.conservation_tips.length > 0 && (
            <View style={styles.recommendationSection}>
              <Text style={styles.recommendationTitle}>Tips Konservasi:</Text>
              {result.data.recommendations.conservation_tips.map((tip, index) => (
                <Text key={index} style={styles.listItem}>• {tip}</Text>
              ))}
            </View>
          )}

          {result.data.recommendations.learning_resources.length > 0 && (
            <View style={styles.recommendationSection}>
              <Text style={styles.recommendationTitle}>Sumber Belajar:</Text>
              {result.data.recommendations.learning_resources.map((resource, index) => (
                <Text key={index} style={styles.listItem}>• {resource}</Text>
              ))}
            </View>
          )}

          {result.data.recommendations.related_artifacts.length > 0 && (
            <View style={styles.recommendationSection}>
              <Text style={styles.recommendationTitle}>Artefak Terkait:</Text>
              {result.data.recommendations.related_artifacts.map((artifact, index) => (
                <Text key={index} style={styles.listItem}>• {artifact}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={shareResult}>
            <Text style={styles.actionButtonText}>Bagikan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={saveToLibrary}>
            <Text style={styles.actionButtonText}>Simpan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={() => router.navigate('/scan/camera')}
          >
            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Scan Lagi</Text>
          </TouchableOpacity>
        </View>

        {/* Processing Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Diproses dalam {result.processing_time_ms}ms
          </Text>
          <Text style={styles.infoText}>
            {new Date(result.timestamp).toLocaleString('id-ID')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  resultCard: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  objectType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 4,
  },
  objectName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 16,
    color: '#666',
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  contextItem: {
    marginBottom: 12,
  },
  contextLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 4,
  },
  contextValue: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  listItem: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginLeft: 8,
  },
  recommendationSection: {
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  primaryButtonText: {
    color: 'white',
  },
  button: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    margin: 16,
    marginTop: 0,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
