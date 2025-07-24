import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Image,
} from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/book-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Logo and Welcome Text */}
          <View style={styles.welcomeCard}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/KalaNusa-logo-md.png')}
                style={{ width: 240, height: 60, resizeMode: 'contain' }}
              />
            </View>
            
            <Text style={styles.welcomeTitle}>Selamat Datang!</Text>
            <Text style={styles.welcomeSubtitle}>
              Jelajahi kekayaan budaya Indonesia melalui sastra dan tradisi yang terpelihara
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Link href="/auth/login" asChild>
                <TouchableOpacity style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Masuk</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/auth/signup" asChild>
                <TouchableOpacity style={styles.signupButton}>
                  <Text style={styles.signupButtonText}>Daftar</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#472800',
  },
  backgroundImage: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 12,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#8B4513',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B4513',
    width: '100%',
  },
  signupButtonText: {
    color: '#8B4513',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
