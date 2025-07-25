import { Stack } from 'expo-router';

export default function ScanLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="camera" 
        options={{ 
          title: 'Scan',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}
