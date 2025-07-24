import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { router, Stack } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import LoadingScreen from '@/components/LoadingScreen';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
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
        });
        setPhoto(photoData.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const retakePicture = () => {
    setPhoto(null);
  };

  const usePicture = async () => {
    setIsUploading(true);
    
    try {
      // Create FormData for the API request
      const formData = new FormData();
      formData.append('image', {
        uri: photo,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);
      
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
        Alert.alert('Success', 'Photo uploaded successfully!', [
          { text: 'OK', onPress: () => router.navigate('/') }
        ]);
        // You could also navigate to a results page with the API response:
        // router.navigate('/results', { data: result });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.', [
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

  if (photo) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={GlobalStyles.darkContainer}>
          {/* Header with X button */}
          <View style={GlobalStyles.overlayHeader}>
            <TouchableOpacity 
              style={GlobalStyles.closeButton}
              onPress={() => router.navigate('/')}
            >
              <Text style={GlobalStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={GlobalStyles.headerTitle}>Photo Preview</Text>
            <View style={GlobalStyles.placeholder} />
          </View>

          {/* Photo Preview */}
          <View style={GlobalStyles.photoContainer}>
            <Image source={{ uri: photo }} style={GlobalStyles.photo} />
          </View>

          {/* Action Buttons */}
          <View style={GlobalStyles.actionButtons}>
            <TouchableOpacity 
              style={GlobalStyles.secondaryButton} 
              onPress={retakePicture}
            >
              <Text style={GlobalStyles.secondaryButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={GlobalStyles.actionButton} 
              onPress={usePicture}
            >
              <Text style={GlobalStyles.actionButtonText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={GlobalStyles.darkContainer}>
        {/* Header with X button */}
        <View style={GlobalStyles.overlayHeader}>
          <TouchableOpacity 
            style={GlobalStyles.closeButton}
            onPress={() => router.navigate('/')}
          >
            <Text style={GlobalStyles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={GlobalStyles.headerTitle}>Camera</Text>
          <View style={GlobalStyles.placeholder} />
        </View>

        {/* Camera View */}
        <CameraView 
          style={GlobalStyles.camera} 
          facing={facing}
          ref={cameraRef}
        >
          {/* Camera Controls */}
          <View style={GlobalStyles.cameraButtonContainer}>
            <TouchableOpacity style={GlobalStyles.flipButton} onPress={toggleCameraFacing}>
              <Text style={GlobalStyles.flipButtonText}>🔄</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={GlobalStyles.captureButton} onPress={takePicture}>
              <View style={GlobalStyles.captureButtonInner} />
            </TouchableOpacity>
            
            <View style={GlobalStyles.placeholder} />
          </View>
        </CameraView>
      </SafeAreaView>
    </>
  );
}
