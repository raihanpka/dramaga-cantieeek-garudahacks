import React from 'react';
import SignIn from '@/components/SignIn';
import { router } from 'expo-router';

export default function SignInPage() {
  return <SignIn onSuccess={() => router.replace('/(tabs)')} />;
}
