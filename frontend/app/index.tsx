import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import Auth from '@/components/Auth';
import Account from '@/components/Account';
import { Redirect } from 'expo-router';

export default function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  // If user is authenticated, redirect to main app
  if (session && session.user) {
    return <Redirect href="/(tabs)" />;
  }

  // If user is not authenticated, show auth screen
  return <Auth />;
}
