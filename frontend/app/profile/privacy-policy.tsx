import React, { useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StyleSheet,
  BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

export default function PrivacyPolicyScreen() {
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
          <Text style={styles.headerTitle}>Kebijakan Privasi</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Last Updated */}
          <View style={styles.lastUpdatedContainer}>
            <Text style={styles.lastUpdatedText}>Last updated: January 25, 2025</Text>
          </View>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.paragraph}>
              Welcome to Kala Cultural Heritage Assistant (we, our, or us). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
            </Text>
          </View>

          {/* Information We Collect */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information We Collect</Text>
            
            <Text style={styles.subsectionTitle}>Personal Information</Text>
            <Text style={styles.paragraph}>
              We may collect personal information that you voluntarily provide to us when you:
            </Text>
            <Text style={styles.bulletPoint}>• Create an account</Text>
            <Text style={styles.bulletPoint}>• Use our chat features</Text>
            <Text style={styles.bulletPoint}>• Submit photographs of cultural artifacts</Text>
            <Text style={styles.bulletPoint}>• Contact us for support</Text>

            <Text style={styles.subsectionTitle}>Automatically Collected Information</Text>
            <Text style={styles.paragraph}>
              When you use our app, we may automatically collect:
            </Text>
            <Text style={styles.bulletPoint}>• Device information (model, operating system)</Text>
            <Text style={styles.bulletPoint}>• Usage data (features accessed, time spent)</Text>
            <Text style={styles.bulletPoint}>• App diagnostics and performance data</Text>
          </View>

          {/* How We Use Your Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              We use the information we collect to:
            </Text>
            <Text style={styles.bulletPoint}>• Provide and maintain our services</Text>
            <Text style={styles.bulletPoint}>• Process and analyze cultural artifacts</Text>
            <Text style={styles.bulletPoint}>• Improve our AI and machine learning capabilities</Text>
            <Text style={styles.bulletPoint}>• Send you notifications and updates</Text>
            <Text style={styles.bulletPoint}>• Provide customer support</Text>
            <Text style={styles.bulletPoint}>• Ensure security and prevent fraud</Text>
          </View>

          {/* Cultural Heritage Data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cultural Heritage Data</Text>
            <Text style={styles.paragraph}>
              When you photograph cultural artifacts or historical documents:
            </Text>
            <Text style={styles.bulletPoint}>• Images are processed using AI for text recognition and cultural analysis</Text>
            <Text style={styles.bulletPoint}>• Processed data may be used to improve our cultural database</Text>
            <Text style={styles.bulletPoint}>• You retain ownership of your original photographs</Text>
            <Text style={styles.bulletPoint}>• Anonymized data may be shared with cultural institutions for research</Text>
          </View>

          {/* Data Sharing and Disclosure */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Sharing and Disclosure</Text>
            <Text style={styles.paragraph}>
              We do not sell, trade, or rent your personal information. We may share information in these situations:
            </Text>
            <Text style={styles.bulletPoint}>• With your explicit consent</Text>
            <Text style={styles.bulletPoint}>• For legal compliance or protection of rights</Text>
            <Text style={styles.bulletPoint}>• With service providers who assist our operations</Text>
            <Text style={styles.bulletPoint}>• In case of business transfer or merger</Text>
          </View>

          {/* Data Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Security</Text>
            <Text style={styles.paragraph}>
              We implement appropriate security measures to protect your information:
            </Text>
            <Text style={styles.bulletPoint}>• Encryption of data in transit and at rest</Text>
            <Text style={styles.bulletPoint}>• Regular security assessments</Text>
            <Text style={styles.bulletPoint}>• Limited access to personal data</Text>
            <Text style={styles.bulletPoint}>• Secure cloud storage infrastructure</Text>
          </View>

          {/* Your Rights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to:
            </Text>
            <Text style={styles.bulletPoint}>• Access your personal information</Text>
            <Text style={styles.bulletPoint}>• Correct inaccurate data</Text>
            <Text style={styles.bulletPoint}>• Delete your account and data</Text>
            <Text style={styles.bulletPoint}>• Export your data</Text>
            <Text style={styles.bulletPoint}>• Opt-out of certain data processing</Text>
          </View>

          {/* Children's Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Children&#39;s Privacy</Text>
            <Text style={styles.paragraph}>
              Our app is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.
            </Text>
          </View>

          {/* Changes to This Policy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to This Policy</Text>
            <Text style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </Text>
          </View>

          {/* Contact Us */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about this Privacy Policy, please contact us:
            </Text>
            <Text style={styles.contactInfo}>📧 privacy@kala-heritage.app</Text>
            <Text style={styles.contactInfo}>📱 +62 123 456 7890</Text>
            <Text style={styles.contactInfo}>📍 Jakarta, Indonesia</Text>
          </View>
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
  content: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lastUpdatedContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#472800',
  },
  lastUpdatedText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#472800',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 6,
  },
  contactInfo: {
    fontSize: 16,
    color: '#472800',
    lineHeight: 24,
    marginBottom: 6,
    fontWeight: '500',
  },
});
