import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const { access_token, refresh_token, type } = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
    type?: string;
  }>();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle email confirmation
        if (type === 'email_confirmation' && access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: access_token as string,
            refresh_token: refresh_token as string,
          });
          
          if (error) {
            console.error('Error setting session:', error);
          } else {
            console.log('Email confirmed successfully');
            // Redirect to main app
            router.replace('/(tabs)');
          }
        } else if (type === 'signup') {
          // Handle signup confirmation
          console.log('Signup confirmed');
          router.replace('/(tabs)');
        } else {
          // Unknown type or missing parameters
          router.replace('/');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/');
      }
    };

    if (type) {
      handleAuthCallback();
    } else {
      // No parameters, redirect to home
      router.replace('/');
    }
  }, [access_token, refresh_token, type]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Verifying your email...</Text>
    </View>
  );
}
