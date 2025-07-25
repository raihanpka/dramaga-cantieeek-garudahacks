import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ProfileStyles } from '@/constants/ProfileStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanService } from '@/services/scanService';

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

interface ScannedScripture {
  id: string;
  title: string;
  description: string;
  submission_date: string;
  status: 'processing' | 'transliterating' | 'reviewing' | 'approved' | 'certified' | 'rejected';
  thumbnailUrl?: string;
  progress: number;
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    totalChats: 0,
    questionsAsked: 0,
    imagesShared: 0,
    joinDate: new Date().toLocaleDateString()
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Scan',
      description: 'Upload your first cultural heritage photo',
      icon: '�',
      unlocked: false,
      requirement: 1,
      progress: 0
    },
    {
      id: '2',
      title: 'Cultural Explorer',
      description: 'Upload 5 different cultural artifacts',
      icon: '🏛️',
      unlocked: false,
      requirement: 5,
      progress: 0
    },
    {
      id: '3',
      title: 'Heritage Curator',
      description: 'Upload 10 cultural heritage items',
      icon: '🏺',
      unlocked: false,
      requirement: 10,
      progress: 0
    },
    {
      id: '4',
      title: 'Knowledge Seeker',
      description: 'Ask 25 questions to Kala',
      icon: '🌿',
      unlocked: false,
      requirement: 25,
      progress: 0
    }
  ]);

  const [scannedScriptures, setScannedScriptures] = useState<ScannedScripture[]>([]);

  // Load scriptures from Supabase
  const loadScriptures = useCallback(async () => {
    if (user?.id) {
      try {
        const scriptures = await ScanService.getUserScriptures(user.id);
        // Transform data to match local interface
        const transformedScriptures: ScannedScripture[] = scriptures.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          submission_date: s.submission_date,
          status: s.status,
          thumbnailUrl: s.thumbnail_url,
          progress: s.progress
        }));
        setScannedScriptures(transformedScriptures);
        updateAchievements(transformedScriptures.length);
      } catch (error) {
        console.error('Error loading scriptures:', error);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadScriptures();
      
      // Subscribe to real-time updates
      const subscription = ScanService.subscribeToScriptureUpdates(
        user.id,
        (updatedScriptures) => {
          const transformedScriptures: ScannedScripture[] = updatedScriptures.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            submission_date: s.submission_date,
            status: s.status,
            thumbnailUrl: s.thumbnail_url,
            progress: s.progress
          }));
          setScannedScriptures(transformedScriptures);
          updateAchievements(transformedScriptures.length);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id, loadScriptures]);

  const updateAchievements = (scriptureCount: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === '1') {
        return {
          ...achievement,
          progress: Math.min(scriptureCount, achievement.requirement),
          unlocked: scriptureCount >= achievement.requirement
        };
      }
      if (achievement.id === '2') {
        return {
          ...achievement,
          progress: Math.min(scriptureCount, achievement.requirement),
          unlocked: scriptureCount >= achievement.requirement
        };
      }
      if (achievement.id === '3') {
        return {
          ...achievement,
          progress: Math.min(scriptureCount, achievement.requirement),
          unlocked: scriptureCount >= achievement.requirement
        };
      }
      return achievement;
    }));
  };

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

  const getStatusDisplay = (status: ScannedScripture['status']) => {
    const statusConfig = {
      processing: { label: 'Processing Photo', icon: '⏳', color: '#FF9500' },
      transliterating: { label: 'Transliterating', icon: '🔤', color: '#007AFF' },
      reviewing: { label: 'Expert Review', icon: '👁️', color: '#5856D6' },
      approved: { label: 'Validated', icon: '✅', color: '#34C759' },
      certified: { label: 'Certified', icon: '🏆', color: '#FFD700' },
      rejected: { label: 'Rejected', icon: '❌', color: '#FF3B30' }
    };
    return statusConfig[status];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
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

      {/* Scanned Scripture Section */}
      <View style={ProfileStyles.section}>
        <Text style={ProfileStyles.sectionTitle}>📜 Photographed Scriptures</Text>
        
        {scannedScriptures.slice(0, 3).map((scripture) => {
          const statusInfo = getStatusDisplay(scripture.status);
          return (
            <View key={scripture.id} style={ProfileStyles.scriptureCard}>
              <View style={ProfileStyles.scriptureMainContent}>
                {scripture.thumbnailUrl && (
                  <Image
                    source={{ uri: scripture.thumbnailUrl }}
                    style={ProfileStyles.scriptureThumbnail}
                  />
                )}
                <View style={ProfileStyles.scriptureInfo}>
                  <View style={ProfileStyles.scriptureHeader}>
                    <Text style={ProfileStyles.scriptureTitle}>{scripture.title}</Text>
                    <View style={[ProfileStyles.statusBadge, { backgroundColor: statusInfo.color }]}>
                      <Text style={ProfileStyles.statusText}>{statusInfo.label}</Text>
                    </View>
                  </View>
                  
                  <Text style={ProfileStyles.scriptureDescription}>{scripture.description}</Text>
                  <Text style={ProfileStyles.scriptureDate}>
                    Photographed on {formatDate(scripture.submission_date)}
                  </Text>
                  
                  {scripture.progress < 100 && (
                    <View style={ProfileStyles.progressContainer}>
                      <View style={ProfileStyles.progressBar}>
                        <View 
                          style={[
                            ProfileStyles.progressFill, 
                            { 
                              width: `${scripture.progress}%`,
                              backgroundColor: statusInfo.color 
                            }
                          ]} 
                        />
                      </View>
                      <Text style={ProfileStyles.progressText}>
                        {scripture.progress}% complete
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
        
        <TouchableOpacity 
          style={ProfileStyles.viewAllButton}
          onPress={() => router.push('/profile/scriptures')}
        >
          <Text style={ProfileStyles.viewAllText}>View All Scriptures</Text>
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
