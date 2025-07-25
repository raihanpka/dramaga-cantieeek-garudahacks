import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import { router, Stack } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { CameraStyles } from '@/constants/CameraStyles';
import LoadingScreen from '@/components/LoadingScreen';
import ReviewPhotos from '@/components/ReviewPhotos';
import SubmitPhotos from '@/components/SubmitPhotos';
import CameraControls from '@/components/CameraControls';
import { ScanService } from '@/services/scanService';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentViewMode, setCurrentViewMode] = useState<'camera' | 'review' | 'submit'>('camera');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { user } = useAuth();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={GlobalStyles.centeredContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={GlobalStyles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={GlobalStyles.primaryButton} onPress={requestPermission}>
          <Text style={GlobalStyles.primaryButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }



  const openInfoModal = () => {
    setShowInfoModal(true);
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
          exif: false,
        });
        setPhotos(prev => [...prev, photoData.uri]);
        // Stay in camera mode instead of switching to review
      } catch {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const deletePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    if (photos.length === 1) {
      setCurrentViewMode('camera');
    } else {
      setSelectedPhotoIndex(Math.max(0, index - 1));
    }
  };

  const finishTakingPhotos = () => {
    if (photos.length > 0) {
      setCurrentViewMode('review');
      setSelectedPhotoIndex(0);
    }
  };

  const pickImages = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your photos to import images.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10, // Limit to 10 photos
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.map((asset: any) => asset.uri);
      setPhotos(prev => [...prev, ...newPhotos]);
      
      // If we have photos now, go to review mode
      if (newPhotos.length > 0) {
        setCurrentViewMode('review');
        setSelectedPhotoIndex(0);
      }
    }
  };

  const continueToSubmit = () => {
    setCurrentViewMode('submit');
  };

  const usePicture = async () => {
    if (photos.length === 0 || !title.trim()) {
      Alert.alert('Error', 'Please add photos and a title');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsUploading(true);
    
    try {
      const result = await ScanService.submitForAnalysis(
        photos,
        title,
        description,
        user.id
      );
      
      if (result.success) {
        Alert.alert(
          'Success', 
          'Photos submitted successfully! You can track the progress in your profile.',
          [
            { 
              text: 'View Progress', 
              onPress: () => router.navigate('/(tabs)/profile') 
            },
            { 
              text: 'Scan More', 
              onPress: () => {
                // Reset form
                setPhotos([]);
                setTitle('');
                setDescription('');
                setCurrentViewMode('camera');
                router.navigate('/scan/camera');
              }
            }
          ]
        );
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to submit photos. Please try again.', [
        { text: 'Retry', onPress: usePicture },
        { text: 'Cancel', style: 'cancel', onPress: () => setIsUploading(false) }
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  // Show loading screen when uploading
  if (isUploading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingScreen 
          message="Mengunggah Foto" 
          subMessage="Tunggu sebentar ya.." 
        />
      </>
    );
  }

  // Submit view with title and description
  if (currentViewMode === 'submit') {
    return (
      <SubmitPhotos
        photos={photos}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        onBack={() => setCurrentViewMode('review')}
        onSubmit={usePicture}
      />
    );
  }

  // Review photos view
  if (currentViewMode === 'review' && photos.length > 0) {
    return (
      <ReviewPhotos
        photos={photos}
        selectedPhotoIndex={selectedPhotoIndex}
        setSelectedPhotoIndex={setSelectedPhotoIndex}
        onBackToCamera={() => setCurrentViewMode('camera')}
        onDeletePhoto={deletePhoto}
        onContinue={continueToSubmit}
      />
    );
  }

  // Main camera view
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[GlobalStyles.darkContainer, {paddingTop: Platform.OS === 'android' ? 32 : 0, paddingBottom: 24}]}> 
        {/* Header with X button */}
        <View style={[GlobalStyles.overlayHeader, { backgroundColor: '#472800', opacity: 1, height: 60, paddingTop: Platform.OS === 'android' ? 16 : 12 }]}> 
          <TouchableOpacity 
            style={GlobalStyles.closeButton}
            onPress={() => router.back()}
          >
            <Text style={[GlobalStyles.closeButtonText, { color: '#fff' }]}>✕</Text>
          </TouchableOpacity>
          <Text style={GlobalStyles.headerTitle}>NusaScan</Text>
          <TouchableOpacity style={GlobalStyles.closeButton} onPress={openInfoModal}>
            <Text style={GlobalStyles.closeButtonText}>ℹ</Text>
          </TouchableOpacity>
        </View>

        {/* Camera Layout: camera preview with maxHeight, controls always at bottom */}
        <View style={{flex: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'center'}}>
          <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', maxHeight: Dimensions.get('window').height * 0.6, marginTop: 40}}>
            <CameraView 
              style={{aspectRatio: 3/4, width: '90%', maxHeight: Dimensions.get('window').height * 0.6, borderRadius: 16, overflow: 'hidden', backgroundColor: 'black', alignSelf: 'center'}} 
              facing={facing}
              ref={cameraRef}
            />
          </View>
          {/* Camera Controls Overlay always at bottom */}
          <View style={{width: '100%', position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 16, backgroundColor: 'transparent', alignItems: 'center'}}>
            <CameraControls
              photos={photos}
              onTakePicture={takePicture}
              onFinishTakingPhotos={finishTakingPhotos}
              onPickImages={pickImages}
            />
          </View>
        </View>

        {/* Information Modal */}
        <Modal
          visible={showInfoModal}
          transparent={true}
          animationType="slide"
          onRequestClose={closeInfoModal}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeInfoModal}
          >
            <TouchableOpacity 
              style={styles.modalContent}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tentang NusaScan</Text>
                <TouchableOpacity onPress={closeInfoModal}>
                  <Text style={styles.closeModalButton}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>NusaScan</Text> adalah fitur yang memungkinkan Anda berkontribusi dalam digitalisasi arsip budaya dan prasasti bersejarah Indonesia.
                </Text>
                
                <Text style={styles.sectionTitle}>🏛️ Apa itu Digitalisasi Arsip Budaya?</Text>
                <Text style={styles.modalText}>
                  Digitalisasi arsip budaya adalah proses mengubah dokumen fisik bersejarah menjadi format digital agar dapat:
                  {'\n'}• Dipelajari dan diakses oleh generasi mendatang
                  {'\n'}• Dicari dan ditemukan dengan mudah
                  {'\n'}• Dilindungi dari kerusakan waktu
                  {'\n'}• Dibagikan kepada peneliti dan masyarakat
                </Text>

                <Text style={styles.sectionTitle}>📱 Cara Berkontribusi</Text>
                <Text style={styles.modalText}>
                  1. <Text style={styles.boldText}>Foto Naskah:</Text> Ambil foto naskah, prasasti, atau dokumen bersejarah dengan jelas
                  {'\n'}2. <Text style={styles.boldText}>Berikan Informasi:</Text> Tambahkan judul dan deskripsi yang relevan
                  {'\n'}3. <Text style={styles.boldText}>Kirim:</Text> Upload kontribusi Anda untuk diproses
                </Text>

                <Text style={styles.sectionTitle}>🎯 Tips Foto yang Baik</Text>
                <Text style={styles.modalText}>
                  • Pastikan pencahayaan cukup dan merata
                  {'\n'}• Hindari bayangan yang menghalangi teks
                  {'\n'}• Ambil foto dari berbagai sudut jika diperlukan
                  {'\n'}• Fokus pada detail penting seperti teks atau simbol
                </Text>

                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Terima kasih</Text> telah membantu melestarikan warisan budaya Indonesia! 🇮🇩
                </Text>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxHeight: '100%',
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeModalButton: {
    fontSize: 20,
    color: '#999',
    padding: 4,
  },
  modalBody: {
    padding: 16,
    paddingBottom: 20,
    maxHeight: 400,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#8B4513',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#472800',
    marginTop: 8,
    marginBottom: 8,
  },
});
