import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="welcome" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="login" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="signup" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
