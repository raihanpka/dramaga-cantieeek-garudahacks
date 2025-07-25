import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ProfileStyles } from '@/constants/ProfileStyles';
// import AsyncStorage from '@react-native-async-storage/async-storage';
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
  thumbnail_url?: string;
  image_urls: string[];
  progress: number;
}
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { user } = useAuth();

  // State untuk profile Supabase
  const [profile, setProfile] = useState<{ fullname?: string; username?: string; avatar_url?: string; updated_at?: string }>({});

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Chat Pertama',
      description: 'Memulai percakapan pertama dengan Kala',
      icon: '💬',
      unlocked: false,
      requirement: 1,
      progress: 0
    },
    {
      id: '2',
      title: 'Penjelajah Ingin Tahu',
      description: 'Mengajukan 10 pertanyaan',
      icon: '🔍',
      unlocked: false,
      requirement: 5,
      progress: 0
    },
    {
      id: '3',
      title: 'Penggemar Foto',
      description: 'Berbagi 5 gambar dengan Kala',
      icon: '📸',
      unlocked: false,
      requirement: 10,
      progress: 0
    },
    {
      id: '4',
      title: 'Master Konsistensi',
      description: 'Mempertahankan 7 hari berturut-turut chat',
      icon: '🔥',
      unlocked: false,
      requirement: 7,
      progress: 0
    },
    {
      id: '5',
      title: 'Ahli Budaya',
      description: 'Melakukan 25 percakapan dengan Kala',
      icon: '🌿',
      unlocked: false,
      requirement: 25,
      progress: 0
    }
  ]);

  const [scannedScriptures, setScannedScriptures] = useState<ScannedScripture[]>([]);
  const [dummyCommitted, setDummyCommitted] = useState(false);

  // Fetch profile dan scannedScriptures dari Supabase
  const fetchProfileAndScriptures = useCallback(async () => {
    if (!user?.id) return;
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('fullname, username, avatar_url, updated_at')
        .eq('id', user.id)
        .single();
      setProfile(profileData || {});

      // Fetch scannedScriptures
      const scriptures = await ScanService.getUserScriptures(user.id);
      // Transform data to match local interface
      const transformedScriptures: ScannedScripture[] = scriptures.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        submission_date: s.submission_date,
        status: s.status,
        thumbnail_url: s.thumbnail_url,
        image_urls: s.image_urls || [],
        progress: s.progress
      }));
      setScannedScriptures(transformedScriptures);
      updateAchievements(transformedScriptures.length);
    } catch (error) {
      console.error('Error fetching profile/scriptures:', error);
    }
  }, [user?.id]);

  // Fetch data dari Supabase saat user login
  useEffect(() => {
    fetchProfileAndScriptures();
  }, [fetchProfileAndScriptures]);

  const updateAchievements = (scriptureCount: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (["1","2","3"].includes(achievement.id)) {
        return {
          ...achievement,
          progress: Math.min(scriptureCount, achievement.requirement),
          unlocked: scriptureCount >= achievement.requirement
        };
      }
      return achievement;
    }));
  };

  // Hapus semua logic AsyncStorage dan dummy data

  const getProgressPercentage = (progress: number, requirement: number) => {
    return Math.min((progress / requirement) * 100, 100);
  };

  const getStatusDisplay = (status: ScannedScripture['status']) => {
    const statusConfig = {
      processing: { label: 'Memproses Foto', icon: '⏳', color: '#FF9500' },
      transliterating: { label: 'Menerjemahkan', icon: '🔤', color: '#007AFF' },
      reviewing: { label: 'Tinjauan Ahli', icon: '👁️', color: '#5856D6' },
      approved: { label: 'Tervalidasi', icon: '✅', color: '#34C759' },
      certified: { label: 'Tersertifikasi', icon: '🏆', color: '#FFD700' },
      rejected: { label: 'Ditolak', icon: '❌', color: '#FF3B30' }
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
    <SafeAreaView style={[ProfileStyles.container, {paddingTop: Platform.OS === 'android' ? 32 : 0, paddingBottom: 24}]}> 
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={ProfileStyles.header}>
          <TouchableOpacity 
            style={ProfileStyles.settingsButton}
            onPress={() => router.push('../profile/settings')}
          >
            <Text style={ProfileStyles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
          <View style={ProfileStyles.avatarContainer}>
            <Image 
              source={profile.avatar_url ? { uri: profile.avatar_url } : require('@/assets/images/kala-avatar-lg.png')} 
              style={ProfileStyles.avatar}
            />
          </View>
          <Text style={ProfileStyles.username}>{profile.fullname || 'Penjelajah Budaya'}</Text>
          <Text style={ProfileStyles.joinDate}>{profile.username || '-'}</Text>
        </View>

        {/* Achievements Section */}
        <View style={ProfileStyles.section}>
          <Text style={ProfileStyles.sectionTitle}>🏆 Pencapaian</Text>
          
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
          <Text style={ProfileStyles.viewAllText}>Lihat Semua Pencapaian</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Scanned Scripture Section */}
      <View style={ProfileStyles.section}>
        <Text style={ProfileStyles.sectionTitle}>📜 Arsip yang Difoto</Text>
        
        {scannedScriptures.slice(0, 3).map((scripture) => {
          const statusInfo = getStatusDisplay(scripture.status);
          const isClickable = scripture.status === 'certified' || scripture.status === 'approved';
          
          const handleScripturePress = () => {
            if (isClickable) {
              // Navigate to library detail page with the scripture ID
              router.push(`/(tabs)/library/${scripture.id}` as any);
            }
          };

          const ScriptureContent = (
            <View style={ProfileStyles.scriptureMainContent}>
          {scripture.thumbnail_url && (
            <Image 
              source={{ uri: scripture.thumbnail_url }} 
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
                  Difoto pada {formatDate(scripture.submission_date)}
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
                      {scripture.progress}% selesai
                    </Text>
                  </View>
                )}
                
                {/* Show clickable indicator for certified/approved scriptures */}
                {isClickable && (
                  <View style={ProfileStyles.clickableIndicator}>
                    <Text style={ProfileStyles.clickableText}>📖 Lihat di perpustakaan</Text>
                  </View>
                )}
              </View>
            </View>
          );

          return (
            <View key={scripture.id} style={ProfileStyles.scriptureCard}>
              {isClickable ? (
                <TouchableOpacity 
                  onPress={handleScripturePress}
                  style={ProfileStyles.clickableScripture}
                  activeOpacity={0.7}
                >
                  {ScriptureContent}
                </TouchableOpacity>
              ) : (
                ScriptureContent
              )}
            </View>
          );
        })}
        
        <TouchableOpacity 
          style={ProfileStyles.viewAllButton}
          onPress={() => router.push('/profile/scriptures')}
        >
          <Text style={ProfileStyles.viewAllText}>Lihat Semua Arsip</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={ProfileStyles.section}>
        <Text style={ProfileStyles.sectionTitle}>ℹ️ Tentang</Text>
        
        <TouchableOpacity 
          style={ProfileStyles.settingItem}
          onPress={() => router.push('../profile/contact-support')}
        >
          <Text style={ProfileStyles.settingText}>💌 Hubungi Dukungan</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <View style={ProfileStyles.versionContainer}>
          <Text style={ProfileStyles.versionText}>Versi 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}
