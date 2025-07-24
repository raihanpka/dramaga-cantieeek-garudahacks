import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { ProfileStyles } from '@/constants/ProfileStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStats {
  totalChats: number;
  questionsAsked: number;
  imagesShared: number;
  joinDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  progress: number;
}

export default function ProfileScreen() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalChats: 0,
    questionsAsked: 0,
    imagesShared: 0,
    joinDate: new Date().toLocaleDateString()
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Chat',
      description: 'Started your first conversation with Kala',
      icon: '💬',
      unlocked: false,
      requirement: 1,
      progress: 0
    },
    {
      id: '2',
      title: 'Curious Explorer',
      description: 'Asked 10 questions',
      icon: '🔍',
      unlocked: false,
      requirement: 10,
      progress: 0
    },
    {
      id: '3',
      title: 'Photo Enthusiast',
      description: 'Shared 5 images with Kala',
      icon: '📸',
      unlocked: false,
      requirement: 5,
      progress: 0
    },
    {
      id: '4',
      title: 'Streak Master',
      description: 'Maintain a 7-day chat streak',
      icon: '🔥',
      unlocked: false,
      requirement: 7,
      progress: 0
    },
    {
      id: '5',
      title: 'Nature Expert',
      description: 'Had 25 conversations with Kala',
      icon: '🌿',
      unlocked: false,
      requirement: 25,
      progress: 0
    }
  ]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const stats = await AsyncStorage.getItem('user_stats');
      if (stats) {
        setUserStats(JSON.parse(stats));
      }
      
      const achievementsData = await AsyncStorage.getItem('user_achievements');
      if (achievementsData) {
        setAchievements(JSON.parse(achievementsData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const getProgressPercentage = (progress: number, requirement: number) => {
    return Math.min((progress / requirement) * 100, 100);
  };

  return (
    <ScrollView style={ProfileStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={ProfileStyles.header}>
        <View style={ProfileStyles.avatarContainer}>
          <Image 
            source={require('@/assets/images/kala-avatar-lg.png')} 
            style={ProfileStyles.avatar}
          />
        </View>
        <Text style={ProfileStyles.username}>Nature Explorer</Text>
        <Text style={ProfileStyles.joinDate}>Member since {userStats.joinDate}</Text>
      </View>

      {/* Stats Cards */}
      <View style={ProfileStyles.statsContainer}>
        <View style={ProfileStyles.statCard}>
          <Text style={ProfileStyles.statNumber}>{userStats.totalChats}</Text>
          <Text style={ProfileStyles.statLabel}>Conversations</Text>
        </View>
        <View style={ProfileStyles.statCard}>
          <Text style={ProfileStyles.statNumber}>{userStats.questionsAsked}</Text>
          <Text style={ProfileStyles.statLabel}>Questions</Text>
        </View>
        <View style={ProfileStyles.statCard}>
          <Text style={ProfileStyles.statNumber}>{userStats.imagesShared}</Text>
          <Text style={ProfileStyles.statLabel}>Images Shared</Text>
        </View>
      </View>

      {/* Achievements Section */}
      <View style={ProfileStyles.section}>
        <Text style={ProfileStyles.sectionTitle}>🏆 Achievements</Text>
        
        {achievements.slice(0, 3).map((achievement) => (
          <View key={achievement.id} style={[
            ProfileStyles.achievementCard,
            achievement.unlocked && ProfileStyles.achievementUnlocked
          ]}>
            <View style={ProfileStyles.achievementLeft}>
              <Text style={[
                ProfileStyles.achievementIcon,
                !achievement.unlocked && ProfileStyles.achievementIconLocked
              ]}>
                {achievement.icon}
              </Text>
              <View style={ProfileStyles.achievementInfo}>
                <Text style={[
                  ProfileStyles.achievementTitle,
                  !achievement.unlocked && ProfileStyles.textMuted
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  ProfileStyles.achievementDescription,
                  !achievement.unlocked && ProfileStyles.textMuted
                ]}>
                  {achievement.description}
                </Text>
                {!achievement.unlocked && (
                  <View style={ProfileStyles.progressContainer}>
                    <View style={ProfileStyles.progressBar}>
                      <View style={[
                        ProfileStyles.progressFill,
                        { width: `${getProgressPercentage(achievement.progress, achievement.requirement)}%` }
                      ]} />
                    </View>
                    <Text style={ProfileStyles.progressText}>
                      {achievement.progress}/{achievement.requirement}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {achievement.unlocked && (
              <Text style={ProfileStyles.unlockedBadge}>✓</Text>
            )}
          </View>
        ))}
        
        <TouchableOpacity 
          style={ProfileStyles.viewAllButton}
          onPress={() => router.push('/profile/achievements')}
        >
          <Text style={ProfileStyles.viewAllText}>View All Achievements</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <View style={ProfileStyles.section}>
        <Text style={ProfileStyles.sectionTitle}>⚙️ Settings</Text>
        
        <TouchableOpacity style={ProfileStyles.settingItem}>
          <Text style={ProfileStyles.settingText}>🔔 Notifications</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={ProfileStyles.settingItem}>
          <Text style={ProfileStyles.settingText}>📱 Language</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={ProfileStyles.settingItem}>
          <Text style={ProfileStyles.settingText}>🚪 Logout</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={ProfileStyles.section}>
        <Text style={ProfileStyles.sectionTitle}>ℹ️ About</Text>
        
        <TouchableOpacity style={ProfileStyles.settingItem}>
          <Text style={ProfileStyles.settingText}>📄 Privacy Policy</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={ProfileStyles.settingItem}>
          <Text style={ProfileStyles.settingText}>📋 Terms of Service</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={ProfileStyles.settingItem}>
          <Text style={ProfileStyles.settingText}>💌 Contact Support</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <View style={ProfileStyles.versionContainer}>
          <Text style={ProfileStyles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}
