import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { router, Stack } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { CameraStyles } from '@/constants/CameraStyles';
import LoadingScreen from '@/components/LoadingScreen';
import ReviewPhotos from '@/components/ReviewPhotos';
import SubmitPhotos from '@/components/SubmitPhotos';
import CameraControls from '@/components/CameraControls';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentViewMode, setCurrentViewMode] = useState<'camera' | 'review' | 'submit'>('camera');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

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

  function toggleCameraFacing() {
    setFacing((current: CameraType) => (current === 'back' ? 'front' : 'back'));
  }

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
      } catch (error) {
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

    setIsUploading(true);
    
    try {
      // Create FormData for the API request
      const formData = new FormData();
      
      // Add all photos
      photos.forEach((photoUri, index) => {
        formData.append('images', {
          uri: photoUri,
          type: 'image/jpeg',
          name: `photo_${index}.jpg`,
        } as any);
      });
      
      // Add title and description
      formData.append('title', title);
      formData.append('description', description);
      
      // Make API call to your backend
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add any authentication headers if needed
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE',
        },
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        // Handle successful upload
        Alert.alert('Success', 'Photos uploaded successfully!', [
          { text: 'OK', onPress: () => router.navigate('/') }
        ]);
        // You could also navigate to a results page with the API response:
        // router.navigate('/results', { data: result });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload photos. Please try again.', [
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
      <SafeAreaView style={GlobalStyles.darkContainer}>
        {/* Header with X button */}
        <View style={[GlobalStyles.overlayHeader, { backgroundColor: '#000', opacity: 1 }]}>
          <TouchableOpacity 
            style={GlobalStyles.closeButton}
            onPress={() => router.navigate('/')}
          >
            <Text style={GlobalStyles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={GlobalStyles.headerTitle}>Camera</Text>
          <TouchableOpacity style={GlobalStyles.closeButton} onPress={toggleCameraFacing}>
            <Text style={GlobalStyles.closeButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Camera View */}
        <View style={CameraStyles.cameraContainer}>
          <CameraView 
            style={GlobalStyles.camera} 
            facing={facing}
            ref={cameraRef}
          />
          {/* Camera Controls Overlay */}
          <CameraControls
            photos={photos}
            onTakePicture={takePicture}
            onFinishTakingPhotos={finishTakingPhotos}
            onPickImages={pickImages}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
