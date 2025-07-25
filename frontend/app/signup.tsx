import React from 'react';
import SignUp from '@/components/SignUp';
import { router } from 'expo-router';

export default function SignUpPage() {
  return <SignUp onSuccess={() => router.replace('/(tabs)')} />;
}
