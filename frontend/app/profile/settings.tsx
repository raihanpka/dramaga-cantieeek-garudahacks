import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StyleSheet,
  Switch,
  Alert,
  BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { ProfileStyles } from '@/constants/ProfileStyles';

export default function SettingsScreen() {
  // Handle Android hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (router.canGoBack && router.canGoBack()) {
          router.back();
        } else {
          router.replace && router.replace('/');
        }
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            console.log('User logged out');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with SafeAreaView for top only */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: '#472800' }}>
        <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack && router.canGoBack()) {
              router.back();
            } else {
              router.replace && router.replace('/');
            }
          }}
        >
            <Image
              source={require('@/assets/images/backarrow-icon.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pengaturan</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={[styles.section, styles.firstSection]}>
          <Text style={styles.sectionTitle}>🔔 Notifikasi</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/profile/notifications' as any)}
          >
            <Text style={styles.settingText}>Pengaturan Notifikasi</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.settingItemWithSwitch}>
            <Text style={styles.settingText}>Notifikasi Push</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#E5E5E5', true: '#472800' }}
              thumbColor={pushNotifications ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItemWithSwitch}>
            <Text style={styles.settingText}>Notifikasi Email</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#E5E5E5', true: '#472800' }}
              thumbColor={emailNotifications ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Language & Region Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 Bahasa & Wilayah</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/profile/language' as any)}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingText}>Bahasa</Text>
              <Text style={styles.settingSubtext}>Bahasa Indonesia</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingText}>Wilayah</Text>
              <Text style={styles.settingSubtext}>Indonesia</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy & Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Privasi & Keamanan</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/profile/privacy-policy' as any)}
          >
            <Text style={styles.settingText}>Kebijakan Privasi</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/profile/terms-of-service' as any)}
          >
            <Text style={styles.settingText}>Syarat dan Ketentuan</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Ekspor Data</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Dukungan</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/profile/contact-support' as any)}
          >
            <Text style={styles.settingText}>Hubungi Dukungan</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Pusat Bantuan</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Kirim Masukan</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Akun</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.settingText, styles.logoutText]}>🚪 Keluar</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versi 1.0.0</Text>
          <Text style={styles.buildText}>Build 2025.1.25</Text>
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
    backgroundColor: '#472800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 8,
  },
  firstSection: {
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#472800',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  settingItemWithSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  settingLeft: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  settingArrow: {
    fontSize: 20,
    color: '#999',
    fontWeight: '300',
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF3B30',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  buildText: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
});
