import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StyleSheet,
  Switch,
  Alert
} from 'react-native';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [scriptureUpdates, setScriptureUpdates] = useState(true);
  const [achievementNotifications, setAchievementNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={require('@/assets/images/backarrow-icon.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Push Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Notifikasi Push</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingText}>Aktifkan Notifikasi Push</Text>
              <Text style={styles.settingDescription}>Terima notifikasi di perangkat Anda</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#E5E5E5', true: '#472800' }}
              thumbColor={pushNotifications ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingText}>Notifikasi Chat</Text>
              <Text style={styles.settingDescription}>Dapatkan notifikasi saat Kala merespons</Text>
            </View>
            <Switch
              value={chatNotifications}
              onValueChange={setChatNotifications}
              trackColor={{ false: '#E5E5E5', true: '#472800' }}
              thumbColor={chatNotifications ? '#fff' : '#f4f3f4'}
              disabled={!pushNotifications}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingText}>Pembaruan Naskah</Text>
              <Text style={styles.settingDescription}>Pembaruan untuk naskah yang Anda kirim</Text>
            </View>
            <Switch
              value={scriptureUpdates}
              onValueChange={setScriptureUpdates}
              trackColor={{ false: '#E5E5E5', true: '#472800' }}
              thumbColor={scriptureUpdates ? '#fff' : '#f4f3f4'}
              disabled={!pushNotifications}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingText}>Pencapaian Terbuka</Text>
              <Text style={styles.settingDescription}>Saat Anda membuka pencapaian baru</Text>
            </View>
            <Switch
              value={achievementNotifications}
              onValueChange={setAchievementNotifications}
              trackColor={{ false: '#E5E5E5', true: '#472800' }}
              thumbColor={achievementNotifications ? '#fff' : '#f4f3f4'}
              disabled={!pushNotifications}
            />
          </View>
        </View>

        {/* Email Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📧 Notifikasi Email</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingText}>Aktifkan Notifikasi Email</Text>
              <Text style={styles.settingDescription}>Terima pembaruan melalui email</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#E5E5E5', true: '#472800' }}
              thumbColor={emailNotifications ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingText}>Weekly Digest</Text>
              <Text style={styles.settingDescription}>Summary of your weekly activity</Text>
            </View>
            <Switch
              value={weeklyDigest}
              onValueChange={setWeeklyDigest}
              trackColor={{ false: '#E5E5E5', true: '#472800' }}
              thumbColor={weeklyDigest ? '#fff' : '#f4f3f4'}
              disabled={!emailNotifications}
            />
          </View>
        </View>

        {/* Sound & Vibration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 Sound & Vibration</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingText}>Suara Notifikasi</Text>
              <Text style={styles.settingDescription}>Putar suara untuk notifikasi</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#E5E5E5', true: '#472800' }}
              thumbColor={soundEnabled ? '#fff' : '#f4f3f4'}
              disabled={!pushNotifications}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingText}>Getaran</Text>
              <Text style={styles.settingDescription}>Getarkan untuk notifikasi</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: '#E5E5E5', true: '#472800' }}
              thumbColor={vibrationEnabled ? '#fff' : '#f4f3f4'}
              disabled={!pushNotifications}
            />
          </View>
        </View>

        {/* Quiet Hours Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌙 Jam Tenang</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingText}>Jangan Ganggu</Text>
              <Text style={styles.settingDescription}>Jadwalkan jam tenang</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            💡 Anda selalu dapat mengelola izin notifikasi di pengaturan perangkat.
          </Text>
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
    paddingTop: 50,
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
  settingLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    lineHeight: 18,
  },
  settingArrow: {
    fontSize: 20,
    color: '#999',
    fontWeight: '300',
  },
  infoContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#472800',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
