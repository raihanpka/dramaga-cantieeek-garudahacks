import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  ScrollView,
  TextInput
} from 'react-native';
import { Stack } from 'expo-router';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { CameraStyles } from '@/constants/CameraStyles';

interface SubmitPhotosProps {
  photos: string[];
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function SubmitPhotos({
  photos,
  title,
  setTitle,
  description,
  setDescription,
  onBack,
  onSubmit
}: SubmitPhotosProps) {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={GlobalStyles.darkContainer}>
        {/* Header */}
        <View style={GlobalStyles.overlayHeader}>
          <TouchableOpacity 
            style={GlobalStyles.closeButton}
            onPress={onBack}
          >
            <Text style={GlobalStyles.closeButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={GlobalStyles.headerTitle}>Add Details</Text>
          <View style={GlobalStyles.placeholder} />
        </View>

        <ScrollView style={CameraStyles.submitContainer}>
          {/* Photo Gallery */}
          <View style={CameraStyles.photoGallery}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {photos.map((photoUri, index) => (
                <Image 
                  key={index}
                  source={{ uri: photoUri }} 
                  style={CameraStyles.galleryPhoto} 
                />
              ))}
            </ScrollView>
          </View>

          {/* Input Fields */}
          <View style={CameraStyles.inputContainer}>
            <Text style={CameraStyles.inputLabel}>Title *</Text>
            <TextInput
              style={CameraStyles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a title for your photos"
              placeholderTextColor="#666"
              multiline={false}
            />

            <Text style={CameraStyles.inputLabel}>Description</Text>
            <TextInput
              style={CameraStyles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Add a description (optional)"
              placeholderTextColor="#666"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={GlobalStyles.actionButtons}>
          <TouchableOpacity 
            style={[GlobalStyles.actionButton, !title.trim() && CameraStyles.disabledButton]} 
            onPress={onSubmit}
            disabled={!title.trim()}
          >
            <Text style={GlobalStyles.actionButtonText}>
              Submit ({photos.length} photo{photos.length !== 1 ? 's' : ''})
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
