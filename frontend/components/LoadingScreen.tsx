import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Animated,
  Image,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingScreen({ 
  message = "Tunggu sebentar ya..", 
  subMessage = "Sedang memproses foto Anda" 
}: LoadingScreenProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const createRandomMovement = () => {
      const randomX = (Math.random() - 0.5) * 40; // Increased movement range (±20px)
      const randomY = (Math.random() - 0.5) * 40; // Increased movement range (±20px)
      const randomScale = 0.9 + Math.random() * 0.2; // Bigger scale variation (0.9 to 1.1)
      const duration = 500 + Math.random() * 800; // Faster duration (0.5s to 1.3s)

      Animated.parallel([
        Animated.timing(translateX, {
          toValue: randomX,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: randomY,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: randomScale,
          duration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // When animation completes, start a new random movement immediately
        createRandomMovement();
      });
    };

    createRandomMovement();
  }, [translateX, translateY, scale]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Framed Character Container */}
        <View style={styles.frameContainer}>
          {/* Background Image within Frame */}
          <Image 
            source={require('@/assets/images/kala-loading-bg.png')} 
            style={styles.backgroundImageFramed}
            resizeMode="cover"
          />
          
          {/* Character/Mascot Area with Animation */}
          <Animated.View 
            style={[
              styles.characterWrapper,
              {
                width: 200, // Increased width
                height: 200, // Increased height
                bottom: -25, // Adjusted to fit within the frame
                transform: [
                  { translateX },
                  { translateY },
                  { scale },
                ],
              },
            ]}
          >
            <Image 
              source={require('@/assets/images/kala-loading.png')} 
              style={[styles.characterImage, { width: 200, height: 200 }]} // Increased image size
              resizeMode="contain"
            />
          </Animated.View>
        </View>
        
        {/* Loading Text Below Frame */}
        <Text style={styles.message}>{message}</Text>
        
        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light gray background like in the image
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  frameContainer: {
    width: 300,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 8,
    borderColor: '#8B4513', // Brown frame color
    overflow: 'hidden',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  backgroundImageFramed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  characterWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterImage: {
    width: 100,
    height: 100,
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    marginTop: 20,
  },
});
