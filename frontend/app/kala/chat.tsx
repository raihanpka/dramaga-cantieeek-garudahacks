import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ChatStyles } from '@/constants/ChatStyles';
import { formatMessageText } from '@/utils/textUtils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Kala, your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Halo aku Kala! Lutung serba tahu yang bisa membantumu. Adakah yang mau kamu tanyakan?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputText('');
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
      
      {/* Message Bubble */}
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
          >
            <Text style={ChatStyles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={ChatStyles.headerTitle}>Kala</Text>
          <View style={ChatStyles.placeholder} />
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={ChatStyles.messagesList}
          contentContainerStyle={ChatStyles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View style={ChatStyles.inputContainer}>
          <TextInput
            style={ChatStyles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[ChatStyles.sendButton, inputText.trim() ? ChatStyles.sendButtonActive : null]}
            onPress={sendMessage}
            disabled={inputText.trim() === ''}
          >
            <Text style={ChatStyles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>
  );
}
