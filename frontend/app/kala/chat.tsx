import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { router, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatStyles } from '@/constants/ChatStyles';
import { formatMessageText } from '@/utils/textUtils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUris?: string[];
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const STORAGE_KEY = 'kala_chat_messages';

  // Load messages from storage on component mount
  useEffect(() => {
    loadMessages();
  }, []);

  // Save messages to storage whenever messages change
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      saveMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading]);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } else {
        // Set default welcome message if no stored messages
        const welcomeMessage: Message = {
          id: '1',
          text: 'Hello! I\'m Kala, your AI assistant. How can I help you today?',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Set default welcome message on error
      const welcomeMessage: Message = {
        id: '1',
        text: 'Hello! I\'m Kala, your AI assistant. How can I help you today?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const clearChatHistory = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      const welcomeMessage: Message = {
        id: '1',
        text: 'Hello! I\'m Kala, your AI assistant. How can I help you today?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      // Also clear any selected images and input text
      setSelectedImages([]);
      setInputText('');
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  };

  const pickImage = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to access the photo library.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const sendMessage = () => {
    if (inputText.trim() === '' && selectedImages.length === 0) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      imageUris: selectedImages.length > 0 ? selectedImages : undefined,
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      let responseText = 'Halo aku Kala! Lutung serba tahu yang bisa membantumu. Adakah yang mau kamu tanyakan?';
      
      if (selectedImages.length > 0) {
        responseText = 'I can see your image! As Kala, I can help you identify plants, animals, or answer questions about what you\'ve shared. What would you like to know?';
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    // Clear input and selected image
    setInputText('');
    setSelectedImages([]);
  };

  const removeSelectedImage = (imageUri: string) => {
    setSelectedImages(prev => prev.filter(uri => uri !== imageUri));
  };

  const openImageModal = (imageUri: string) => {
    console.log('Opening image modal with URI:', imageUri);
    setSelectedImageUri(imageUri);
    setModalVisible(true);
    console.log('Modal should be visible now');
  };

  const closeImageModal = () => {
    console.log('Closing image modal');
    setModalVisible(false);
    setSelectedImageUri(null);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      ChatStyles.messageRow,
      item.isUser ? ChatStyles.userMessageRow : ChatStyles.aiMessageRow
    ]}>
      {/* Avatar - only for AI messages */}
      {!item.isUser && (
        <View style={ChatStyles.avatar}>
          <Image 
            source={require('@/assets/images/kala-avatar.png')} 
            style={ChatStyles.avatarImage}
            resizeMode="cover"
          />
        </View>
      )}
      
      <View style={{ flex: 1 }}>
        {/* Images if present - shown above the text bubble */}
        {item.imageUris && item.imageUris.length > 0 && (
          <View style={ChatStyles.messageImagesContainer}>
            {item.imageUris.map((uri, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => openImageModal(uri)}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri }} 
                  style={ChatStyles.messageImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Message Bubble - only show if there's text */}
        {item.text.trim() !== '' && (
          <View style={[
            ChatStyles.messageBubble,
            item.isUser ? ChatStyles.userMessage : ChatStyles.aiMessage
          ]}>
            <Text style={[
              ChatStyles.messageText,
              item.isUser ? ChatStyles.userText : ChatStyles.aiText
            ]}>
              {formatMessageText(item.text)}
            </Text>
            <Text style={ChatStyles.timestamp}>
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
        
        {/* If only images and no text, show timestamp separately */}
        {item.text.trim() === '' && item.imageUris && item.imageUris.length > 0 && (
          <Text style={[ChatStyles.timestamp, { marginTop: 4, textAlign: item.isUser ? 'right' : 'left' }]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={ChatStyles.container}>
      <KeyboardAvoidingView 
        style={ChatStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Header with Back Button */}
        <View style={ChatStyles.fullScreenHeader}>
          <TouchableOpacity 
            style={ChatStyles.backButton}
            onPress={() => router.navigate('/')}
            activeOpacity={0.7}
          >
            <Image
              source={require('@/assets/images/backarrow-icon.png')}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={ChatStyles.headerTitle}>Kala</Text>
          <TouchableOpacity 
            style={ChatStyles.clearButton}
            onPress={clearChatHistory}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={ChatStyles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading chat history...</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={ChatStyles.messagesList}
            contentContainerStyle={ChatStyles.messagesContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input Area */}
        <View style={ChatStyles.inputContainer}>
          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8, gap: 8 }}>
              {selectedImages.map((imageUri, index) => (
                <View key={index} style={ChatStyles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: imageUri }} 
                    style={ChatStyles.imagePreview}
                    resizeMode="cover"
                  />
                    <TouchableOpacity 
                    style={[
                      ChatStyles.removeImageButton, 
                      { justifyContent: 'center', alignItems: 'center', alignSelf: 'center', paddingTop: 0 }
                    ]}
                    onPress={() => removeSelectedImage(imageUri)}
                    >
                    <Text style={[ChatStyles.removeImageText, { textAlign: 'center', textAlignVertical: 'center', paddingTop: 0 }]}>×</Text>
                    </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          <View style={ChatStyles.inputRow}>
            <TouchableOpacity 
              style={[
              ChatStyles.imageButton, 
              { justifyContent: 'center', alignItems: 'center', alignSelf: 'center', paddingTop: 4 }
              ]}
              onPress={pickImage}
            >
              <Text style={{ fontSize: 28, color: '#555', textAlign: 'center', textAlignVertical: 'center', paddingTop: 0 }}>＋</Text>
            </TouchableOpacity>
            <TextInput
              style={ChatStyles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Tulis pesan anda..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[ChatStyles.sendButton, (inputText.trim() || selectedImages.length > 0) ? ChatStyles.sendButtonActive : null]}
              onPress={sendMessage}
              disabled={inputText.trim() === '' && selectedImages.length === 0}
            >
              <Text style={ChatStyles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>

    {/* Image Preview Modal */}
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeImageModal}
      statusBarTranslucent={true}
    >
      <View style={ChatStyles.modalOverlay}>
        <TouchableOpacity 
          style={ChatStyles.closeButton}
          onPress={closeImageModal}
        >
          <Text style={ChatStyles.closeButtonText}>×</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={ChatStyles.modalContainer}
          activeOpacity={1}
          onPress={closeImageModal}
        >
          {selectedImageUri ? (
            <Image
              source={{ uri: selectedImageUri }}
              style={ChatStyles.fullScreenImage}
              resizeMode="contain"
              onError={(error) => console.log('Image load error:', error)}
              onLoad={() => console.log('Image loaded successfully')}
            />
          ) : (
            <Text style={{ color: 'white', fontSize: 18 }}>No image selected</Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
    </>
  );
}
