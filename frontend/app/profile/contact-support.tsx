import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StyleSheet,
  TextInput,
  Alert,
  Linking,
  BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

export default function ContactSupportScreen() {
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');

  // Support categories for the form
  const supportCategories = [
    { id: 'general', title: 'General', icon: '📋' },
    { id: 'technical', title: 'Technical', icon: '🛠️' },
    { id: 'feedback', title: 'Feedback', icon: '💡' },
    { id: 'account', title: 'Account', icon: '👤' },
    { id: 'other', title: 'Other', icon: '❓' },
  ];

  // FAQ items
  const faqItems = [
    {
      question: 'How accurate is the cultural artifact recognition?',
      answer: 'Our AI model has been trained on thousands of cultural artifacts and achieves approximately 85-90% accuracy. However, we recommend consulting with cultural experts for important identifications.'
    },
    {
      question: 'Can I use the app offline?',
      answer: 'Basic functionality works offline, but AI analysis and chat features require an internet connection. Previously analyzed content can be viewed offline.'
    },
    {
      question: 'How do you protect cultural heritage data?',
      answer: 'We use industry-standard encryption and work with cultural institutions to ensure respectful handling of heritage data. See our Privacy Policy for details.'
    },
    {
      question: 'Why can\'t I scan certain artifacts?',
      answer: 'Some artifacts may be protected, damaged, or in poor lighting. Ensure good lighting and try different angles. Contact us if issues persist.'
    },
    {
      question: 'How can I contribute to the cultural database?',
      answer: 'By scanning artifacts with permission, you contribute to our database. We also accept expert contributions and corrections from cultural institutions.'
    },
    {
      question: 'Is my personal data shared with third parties?',
      answer: 'We do not sell personal data. We may share anonymized cultural data with research institutions for preservation purposes. See our Privacy Policy.'
    }
  ];

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

  const handleSendMessage = () => {
    if (!selectedCategory || !message.trim() || !email.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Simulate sending message
    Alert.alert(
      'Message Sent',
      'Thank you for contacting us! We\'ll respond within 24-48 hours.',
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedCategory('');
            setMessage('');
            setEmail('');
          }
        }
      ]
    );
  };

  const openEmail = () => {
    Linking.openURL('mailto:support@kala-heritage.app');
  };

  const openPhone = () => {
    Linking.openURL('tel:+6212345678990');
  };

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/6212345678990');
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
          <Text style={styles.headerTitle}>Hubungi Dukungan</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* ...existing code for content... */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.contactMethodsContainer}>
            <TouchableOpacity style={styles.contactMethod} onPress={openEmail}>
              <Text style={styles.contactMethodIcon}>📧</Text>
              <View style={styles.contactMethodContent}>
                <Text style={styles.contactMethodTitle}>Email Support</Text>
                <Text style={styles.contactMethodSubtitle}>support@kala-heritage.app</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactMethod} onPress={openPhone}>
              <Text style={styles.contactMethodIcon}>📞</Text>
              <View style={styles.contactMethodContent}>
                <Text style={styles.contactMethodTitle}>Phone Support</Text>
                <Text style={styles.contactMethodSubtitle}>+62 123 456 7890</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactMethod} onPress={openWhatsApp}>
              <Text style={styles.contactMethodIcon}>💬</Text>
              <View style={styles.contactMethodContent}>
                <Text style={styles.contactMethodTitle}>WhatsApp</Text>
                <Text style={styles.contactMethodSubtitle}>Quick chat support</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Email *</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category *</Text>
              <View style={styles.categoryGrid}>
                {supportCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.categoryButtonSelected
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryTitle,
                      selectedCategory === category.id && styles.categoryTitleSelected
                    ]}>
                      {category.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Message Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message *</Text>
              <TextInput
                style={[styles.textInput, styles.messageInput]}
                value={message}
                onChangeText={setMessage}
                placeholder="Describe your issue or question in detail..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {/* Send Button */}
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Support Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support Hours</Text>
          <View style={styles.supportHoursContainer}>
            <View style={styles.supportHourItem}>
              <Text style={styles.supportHourDay}>Monday - Friday</Text>
              <Text style={styles.supportHourTime}>9:00 AM - 6:00 PM WIB</Text>
            </View>
            <View style={styles.supportHourItem}>
              <Text style={styles.supportHourDay}>Saturday</Text>
              <Text style={styles.supportHourTime}>10:00 AM - 4:00 PM WIB</Text>
            </View>
            <View style={styles.supportHourItem}>
              <Text style={styles.supportHourDay}>Sunday</Text>
              <Text style={styles.supportHourTime}>Closed</Text>
            </View>
          </View>
          <Text style={styles.responseTimeNote}>
            📝 Email responses typically within 24-48 hours
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
    margin: 16,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#472800',
    marginBottom: 16,
  },
  contactMethodsContainer: {
    gap: 12,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  contactMethodIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  contactMethodContent: {
    flex: 1,
  },
  contactMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactMethodSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  messageInput: {
    height: 120,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    minWidth: '45%',
  },
  categoryButtonSelected: {
    backgroundColor: '#472800',
    borderColor: '#472800',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  categoryTitleSelected: {
    color: 'white',
  },
  sendButton: {
    backgroundColor: '#472800',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqContainer: {
    gap: 16,
  },
  faqItem: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#472800',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  supportHoursContainer: {
    gap: 12,
  },
  supportHourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  supportHourDay: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  supportHourTime: {
    fontSize: 16,
    color: '#666',
  },
  responseTimeNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
});
