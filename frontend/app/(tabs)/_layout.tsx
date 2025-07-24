import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          default: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 0,
          },
        }),
        tabBarItemStyle: {
          borderTopWidth: 3,
          borderTopColor: 'transparent',
        },
        tabBarLabelStyle: {
          fontSize: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={({ route, navigation }) => {
          const focused = navigation.isFocused();
          return {
            title: '',  
            tabBarIcon: ({ color, focused }) => (
              <Image 
                source={require('@/assets/TabIcon/home.png')} 
                style={{ 
                  width: 28, 
                  height: 28, 
                  tintColor: focused ? color : '#000' 
                }} 
              />
            ),
            tabBarItemStyle: {
              borderTopWidth: 3,
              borderTopColor: focused ? Colors[colorScheme ?? 'light'].tint : 'transparent',
            },
          };
        }}
      />
      <Tabs.Screen
        name="kala"
        options={({ route, navigation }) => {
          const focused = navigation.isFocused();
          return {
            title: '',  
            tabBarIcon: ({ color, focused }) => (
              <Image 
                source={require('@/assets/TabIcon/kala.png')} 
                style={{ 
                  width: 28, 
                  height: 28, 
                  tintColor: focused ? color : '#000' 
                }} 
              />
            ),
            tabBarItemStyle: {
              borderTopWidth: 3,
              borderTopColor: focused ? Colors[colorScheme ?? 'light'].tint : 'transparent',
            },
          };
        }}
      />
      <Tabs.Screen
        name="scan"
        options={({ route, navigation }) => {
          const focused = navigation.isFocused();
          return {
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require('@/assets/TabIcon/scan.png')}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: focused ? color : '#000'
                }}
              />
            ),
            tabBarItemStyle: {
              borderTopWidth: 3,
              borderTopColor: focused ? Colors[colorScheme ?? 'light'].tint : 'transparent',
            },
          };
        }}
      />
      <Tabs.Screen
        name="library"
        options={({ route, navigation }) => {
          const focused = navigation.isFocused();
          return {
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require('@/assets/TabIcon/library.png')}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: focused ? color : '#000'
                }}
              />
            ),
            tabBarItemStyle: {
              borderTopWidth: 3,
              borderTopColor: focused ? Colors[colorScheme ?? 'light'].tint : 'transparent',
            },
          };
        }}
      />
      <Tabs.Screen
        name="profile"
        options={({ route, navigation }) => {
          const focused = navigation.isFocused();
          return {
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require('@/assets/TabIcon/profile.png')}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: focused ? color : '#000'
                }}
              />
            ),
            tabBarItemStyle: {
              borderTopWidth: 3,
              borderTopColor: focused ? Colors[colorScheme ?? 'light'].tint : 'transparent',
            },
          };
        }}
      />
    </Tabs>
  );
}
