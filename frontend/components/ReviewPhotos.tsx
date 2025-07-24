import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  ScrollView
} from 'react-native';
import { Stack } from 'expo-router';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { CameraStyles } from '@/constants/CameraStyles';

interface ReviewPhotosProps {
  photos: string[];
  selectedPhotoIndex: number;
  setSelectedPhotoIndex: (index: number) => void;
  onBackToCamera: () => void;
  onDeletePhoto: (index: number) => void;
  onContinue: () => void;
}

export default function ReviewPhotos({
  photos,
  selectedPhotoIndex,
  setSelectedPhotoIndex,
  onBackToCamera,
  onDeletePhoto,
  onContinue
}: ReviewPhotosProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={GlobalStyles.darkContainer}>
        {/* Header */}
        <View style={GlobalStyles.overlayHeader}>
          <TouchableOpacity 
            style={GlobalStyles.closeButton}
            onPress={onBackToCamera}
          >
            <Text style={GlobalStyles.closeButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={GlobalStyles.headerTitle}>
            Photo {selectedPhotoIndex + 1} of {photos.length}
          </Text>
          <TouchableOpacity 
            style={GlobalStyles.closeButton}
            onPress={() => onDeletePhoto(selectedPhotoIndex)}
          >
            <Text style={GlobalStyles.closeButtonText}>🗑</Text>
          </TouchableOpacity>
        </View>

        {/* Photo Preview */}
        <View style={GlobalStyles.photoContainer}>
          <Image 
            source={{ uri: photos[selectedPhotoIndex] }} 
            style={GlobalStyles.photo} 
          />
        </View>

        {/* Photo Navigation */}
        {photos.length > 1 && (
          <View style={CameraStyles.photoNavigation}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {photos.map((photoUri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedPhotoIndex(index)}
                  style={[
                    CameraStyles.thumbnailContainer,
                    selectedPhotoIndex === index && CameraStyles.selectedThumbnail
                  ]}
                >
                  <Image 
                    source={{ uri: photoUri }} 
                    style={CameraStyles.thumbnail} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Action Buttons */}
        <View style={GlobalStyles.actionButtons}>
          <TouchableOpacity 
            style={GlobalStyles.secondaryButton} 
            onPress={onBackToCamera}
          >
            <Text style={GlobalStyles.secondaryButtonText}>Take More</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={GlobalStyles.actionButton} 
            onPress={onContinue}
          >
            <Text style={GlobalStyles.actionButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
