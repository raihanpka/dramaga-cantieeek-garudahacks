import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { CameraStyles } from '@/constants/CameraStyles';

interface CameraControlsProps {
  photos: string[];
  onTakePicture: () => void;
  onFinishTakingPhotos: () => void;
  onPickImages: () => void;
}

export default function CameraControls({
  photos,
  onTakePicture,
  onFinishTakingPhotos,
  onPickImages
}: CameraControlsProps) {
  return (
    <View style={GlobalStyles.customCameraButtonContainer}>
      {/* Photo Preview & Count */}
      <TouchableOpacity 
        style={CameraStyles.photoPreviewContainer} 
        onPress={() => photos.length > 0 && onFinishTakingPhotos()}
        disabled={photos.length === 0}
      >
        {photos.length > 0 ? (
          <>
            <Image 
              source={{ uri: photos[photos.length - 1] }} 
              style={CameraStyles.previewThumbnail} 
            />
            <View style={CameraStyles.photoBadge}>
              <Text style={CameraStyles.photoBadgeText}>{photos.length}</Text>
            </View>
          </>
        ) : (
          <View style={CameraStyles.emptyPreview}>
            <Text style={CameraStyles.emptyPreviewText}>📷</Text>
          </View>
        )}
      </TouchableOpacity>
      
      {/* Capture Button */}
      <TouchableOpacity style={GlobalStyles.captureButton} onPress={onTakePicture}>
        <View style={GlobalStyles.captureButtonInner} />
      </TouchableOpacity>
      
      {/* Import Button */}
      <TouchableOpacity 
        style={CameraStyles.finishButton} 
        onPress={photos.length > 0 ? onFinishTakingPhotos : onPickImages}
      >
        <Image
          source={require('@/assets/images/image-stack-icon.png')}
          style={CameraStyles.importIcon}
        />
        <Text style={CameraStyles.finishButtonText}>Import</Text>
      </TouchableOpacity>
    </View>
  );
}
