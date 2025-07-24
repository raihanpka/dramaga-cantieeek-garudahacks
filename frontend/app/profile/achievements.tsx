import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { ProfileStyles } from '@/constants/ProfileStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  progress: number;
}

export default function AchievementsScreen() {
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
    },
    {
      id: '6',
      title: 'Early Bird',
      description: 'Chatted with Kala before 8 AM',
      icon: '🌅',
      unlocked: false,
      requirement: 1,
      progress: 0
    },
    {
      id: '7',
      title: 'Night Owl',
      description: 'Chatted with Kala after 10 PM',
      icon: '🦉',
      unlocked: false,
      requirement: 1,
      progress: 0
    },
    {
      id: '8',
      title: 'Helpful Helper',
      description: 'Asked 50 questions about nature',
      icon: '🌱',
      unlocked: false,
      requirement: 50,
      progress: 0
    },
    {
      id: '9',
      title: 'Image Master',
      description: 'Shared 20 images with Kala',
      icon: '🖼️',
      unlocked: false,
      requirement: 20,
      progress: 0
    },
    {
      id: '10',
      title: 'Conversation King',
      description: 'Had 100 conversations with Kala',
      icon: '👑',
      unlocked: false,
      requirement: 100,
      progress: 0
    }
  ]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const achievementsData = await AsyncStorage.getItem('user_achievements');
      if (achievementsData) {
        setAchievements(JSON.parse(achievementsData));
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const getProgressPercentage = (progress: number, requirement: number) => {
    return Math.min((progress / requirement) * 100, 100);
  };

  const unlockedCount = achievements.filter(achievement => achievement.unlocked).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image
            source={require('@/assets/images/backarrow-icon.png')}
            style={{ width: 24, height: 24, tintColor: 'white' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Achievements</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>🏆 Your Progress</Text>
        <Text style={styles.summaryText}>
          {unlockedCount} of {achievements.length} achievements unlocked
        </Text>
        <View style={styles.overallProgress}>
          <View style={styles.overallProgressBar}>
            <View style={[
              styles.overallProgressFill,
              { width: `${(unlockedCount / achievements.length) * 100}%` }
            ]} />
          </View>
          <Text style={styles.overallProgressText}>
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </Text>
        </View>
      </View>

      {/* Achievements List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.achievementsList}>
          {achievements.map((achievement) => (
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: Colors.light.tint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  overallProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overallProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: Colors.light.tint,
    borderRadius: 4,
  },
  overallProgressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.tint,
    minWidth: 40,
  },
  scrollView: {
    flex: 1,
  },
  achievementsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
