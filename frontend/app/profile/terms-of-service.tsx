import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StyleSheet
} from 'react-native';
import { router } from 'expo-router';

export default function TermsOfServiceScreen() {
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
        <Text style={styles.headerTitle}>Syarat dan Ketentuan</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Last Updated */}
          <View style={styles.lastUpdatedContainer}>
            <Text style={styles.lastUpdatedText}>Last updated: January 25, 2025</Text>
          </View>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agreement to Terms</Text>
            <Text style={styles.paragraph}>
              These Terms of Service ("Terms") govern your use of the Kala Cultural Heritage Assistant mobile application ("Service") operated by our team ("us," "we," or "our").
            </Text>
            <Text style={styles.paragraph}>
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
            </Text>
          </View>

          {/* Acceptable Use */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acceptable Use</Text>
            <Text style={styles.paragraph}>
              You may use our Service for lawful purposes only. You agree not to use the Service:
            </Text>
            <Text style={styles.bulletPoint}>• In any way that violates applicable laws or regulations</Text>
            <Text style={styles.bulletPoint}>• To submit false, misleading, or fraudulent information</Text>
            <Text style={styles.bulletPoint}>• To upload content that infringes on intellectual property rights</Text>
            <Text style={styles.bulletPoint}>• To transmit malicious code or viruses</Text>
            <Text style={styles.bulletPoint}>• To attempt to gain unauthorized access to our systems</Text>
          </View>

          {/* Cultural Heritage Content */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cultural Heritage Content</Text>
            <Text style={styles.paragraph}>
              When you submit photographs of cultural artifacts or historical documents:
            </Text>
            <Text style={styles.bulletPoint}>• You must have the right to photograph and share the content</Text>
            <Text style={styles.bulletPoint}>• You should respect cultural sensitivities and sacred objects</Text>
            <Text style={styles.bulletPoint}>• You grant us a license to process and analyze the content</Text>
            <Text style={styles.bulletPoint}>• You acknowledge that processed data may contribute to our cultural database</Text>
            <Text style={styles.bulletPoint}>• You retain ownership of your original photographs</Text>
          </View>

          {/* Intellectual Property */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intellectual Property Rights</Text>
            <Text style={styles.paragraph}>
              The Service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </Text>
            <Text style={styles.subsectionTitle}>Your Content</Text>
            <Text style={styles.paragraph}>
              You retain ownership of content you submit. However, by submitting content, you grant us:
            </Text>
            <Text style={styles.bulletPoint}>• A worldwide, non-exclusive license to use, process, and analyze your content</Text>
            <Text style={styles.bulletPoint}>• The right to create derivative works for cultural preservation purposes</Text>
            <Text style={styles.bulletPoint}>• Permission to share anonymized data with cultural institutions</Text>
          </View>

          {/* User Accounts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Accounts</Text>
            <Text style={styles.paragraph}>
              When you create an account with us, you must provide accurate and complete information. You are responsible for:
            </Text>
            <Text style={styles.bulletPoint}>• Safeguarding your account password</Text>
            <Text style={styles.bulletPoint}>• All activities that occur under your account</Text>
            <Text style={styles.bulletPoint}>• Notifying us immediately of any unauthorized use</Text>
            <Text style={styles.bulletPoint}>• Maintaining the security of your account</Text>
          </View>

          {/* AI and Machine Learning */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI and Machine Learning Services</Text>
            <Text style={styles.paragraph}>
              Our Service uses artificial intelligence and machine learning to:
            </Text>
            <Text style={styles.bulletPoint}>• Analyze and interpret cultural artifacts</Text>
            <Text style={styles.bulletPoint}>• Provide text recognition and translation</Text>
            <Text style={styles.bulletPoint}>• Offer cultural insights and educational content</Text>
            <Text style={styles.paragraph}>
              You acknowledge that AI-generated content may not always be accurate and should be verified with cultural experts when necessary.
            </Text>
          </View>

          {/* Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy</Text>
            <Text style={styles.paragraph}>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </Text>
          </View>

          {/* Service Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Availability</Text>
            <Text style={styles.paragraph}>
              We strive to provide continuous service but cannot guarantee uninterrupted access. We reserve the right to:
            </Text>
            <Text style={styles.bulletPoint}>• Modify or discontinue the Service with notice</Text>
            <Text style={styles.bulletPoint}>• Temporarily suspend the Service for maintenance</Text>
            <Text style={styles.bulletPoint}>• Update features and functionality</Text>
            <Text style={styles.bulletPoint}>• Change pricing or introduce fees with notice</Text>
          </View>

          {/* Limitation of Liability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </Text>
          </View>

          {/* Termination */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Termination</Text>
            <Text style={styles.paragraph}>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach the Terms.
            </Text>
            <Text style={styles.paragraph}>
              Upon termination, your right to use the Service will cease immediately. However, provisions that should survive termination will remain in effect.
            </Text>
          </View>

          {/* Governing Law */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Governing Law</Text>
            <Text style={styles.paragraph}>
              These Terms shall be interpreted and governed by the laws of the Republic of Indonesia, without regard to its conflict of law provisions.
            </Text>
          </View>

          {/* Changes to Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to Terms</Text>
            <Text style={styles.paragraph}>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </Text>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about these Terms of Service, please contact us:
            </Text>
            <Text style={styles.contactInfo}>📧 legal@kala-heritage.app</Text>
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
