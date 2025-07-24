import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

export default function ScanScreen() {
  useEffect(() => {
    // Automatically redirect to camera when this screen is accessed
    router.replace('/scan/camera');
  }, []);

  // Return empty view since we're immediately redirecting
  return <View />;
}


