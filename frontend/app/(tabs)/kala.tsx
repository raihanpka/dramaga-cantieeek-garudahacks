import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

export default function KalaScreen() {
  useEffect(() => {
    router.replace('/kala/chat');
  }, []);

  return <View />;
}


