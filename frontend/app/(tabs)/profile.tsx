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

interface ScannedScripture {
  id: string;
  title: string;
  description: string;
  submissionDate: string;
  status: 'processing' | 'transliterating' | 'reviewing' | 'approved' | 'certified' | 'rejected';
  thumbnailUri?: string;
  progress: number; // required field from 0 to 100
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
      requirement: 10,
      progress: 0
    },
    {
      id: '3',
      title: 'Penggemar Foto',
      description: 'Berbagi 5 gambar dengan Kala',
      icon: '📸',
      unlocked: false,
      requirement: 5,
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

  const [scannedScriptures, setScannedScriptures] = useState<ScannedScripture[]>([
    {
      id: '1',
      title: 'Prasasti Candi Borobudur',
      description: 'Photographed ancient stone inscription from Borobudur temple',
      submissionDate: '2025-01-20',
      status: 'certified',
      progress: 100,
      thumbnailUri: 'https://picsum.photos/seed/borobudur/200/150'
    },
    {
      id: '2',
      title: 'Naskah Lontar Bali',
      description: 'Photographed traditional Balinese palm leaf manuscript',
      submissionDate: '2025-01-22',
      status: 'approved',
      progress: 100,
      thumbnailUri: 'https://picsum.photos/seed/lontar/200/150'
    },
    {
      id: '3',
      title: 'Batik Jawa Klasik',
      description: 'Photographed traditional Javanese batik patterns with text',
      submissionDate: '2025-01-24',
      status: 'transliterating',
      progress: 65,
      thumbnailUri: 'https://picsum.photos/seed/batik/200/150'
    },
    {
      id: '4',
      title: 'Prasasti Sukuh',
      description: 'Photographed stone inscription from Candi Sukuh',
      submissionDate: '2025-01-25',
      status: 'processing',
      progress: 25,
      thumbnailUri: 'https://picsum.photos/seed/sukuh/200/150'
    },
    {
      id: '5',
      title: 'Wayang Kulit Jawa',
      description: 'Photographed traditional Javanese shadow puppet with inscriptions',
      submissionDate: '2025-01-26',
      status: 'reviewing',
      progress: 80,
      thumbnailUri: 'https://picsum.photos/seed/wayang/200/150'
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
    <ScrollView style={ProfileStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={ProfileStyles.header}>
        <TouchableOpacity 
          style={ProfileStyles.settingsButton}
          onPress={() => router.push('/profile/settings')}
        >
          <Text style={ProfileStyles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
        
        <View style={ProfileStyles.avatarContainer}>
          <Image 
            source={require('@/assets/images/kala-avatar-lg.png')} 
            style={ProfileStyles.avatar}
          />
        </View>
        <Text style={ProfileStyles.username}>Penjelajah Budaya</Text>
        <Text style={ProfileStyles.joinDate}>Anggota sejak {userStats.joinDate}</Text>
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
        <Text style={ProfileStyles.sectionTitle}>📜 Naskah yang Difoto</Text>
        
        {scannedScriptures.slice(0, 3).map((scripture) => {
          const statusInfo = getStatusDisplay(scripture.status);
          const isClickable = scripture.status === 'certified' || scripture.status === 'approved';
          
          const handleScripturePress = () => {
            if (isClickable) {
              // Navigate to library detail page with the scripture ID
              router.push({
                pathname: '/library/[id]',
                params: { id: scripture.id }
              });
            }
          };

          const ScriptureContent = (
            <View style={ProfileStyles.scriptureMainContent}>
              {scripture.thumbnailUri && (
                <Image 
                  source={{ uri: scripture.thumbnailUri }} 
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
                  Difoto pada {formatDate(scripture.submissionDate)}
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
          <Text style={ProfileStyles.viewAllText}>Lihat Semua Naskah</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={ProfileStyles.section}>
        <Text style={ProfileStyles.sectionTitle}>ℹ️ Tentang</Text>
        
        <TouchableOpacity 
          style={ProfileStyles.settingItem}
          onPress={() => router.push('/profile/contact-support')}
        >
          <Text style={ProfileStyles.settingText}>💌 Hubungi Dukungan</Text>
          <Text style={ProfileStyles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <View style={ProfileStyles.versionContainer}>
          <Text style={ProfileStyles.versionText}>Versi 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}
