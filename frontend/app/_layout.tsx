import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { View, Text, StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

const styles = StyleSheet.create({
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    errorTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#d32f2f',
      marginBottom: 10,
    },
    errorText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 10,
    },
    errorSubtext: {
      fontSize: 14,
      color: '#999',
      textAlign: 'center',
    },
  });

// Clerk publishable key
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Configuration Error</Text>
        <Text style={styles.errorText}>
          Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable.
        </Text>
        <Text style={styles.errorSubtext}>
          Please add your Clerk publishable key to .env file.
        </Text>
      </View>
    );
  }
  
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="profile/achievements" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ClerkProvider>
  );
}
