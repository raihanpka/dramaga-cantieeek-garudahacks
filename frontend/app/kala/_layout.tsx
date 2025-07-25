import { Stack } from 'expo-router';

export default function KalaLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="chat" 
        options={{ 
          title: 'Kala Chat',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}
