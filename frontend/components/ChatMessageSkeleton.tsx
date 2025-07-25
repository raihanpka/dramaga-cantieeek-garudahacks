import React from 'react';
import { View, Image } from 'react-native';
import { ChatStyles } from '@/constants/ChatStyles';
import { TypingIndicator } from './SkeletonLoader';

export default function ChatMessageSkeleton() {
  return (
    <View style={[ChatStyles.messageRow, ChatStyles.aiMessageRow]}>
      {/* Avatar for AI message */}
      <View style={ChatStyles.avatar}>
        <Image 
          source={require('@/assets/images/kala-avatar.png')} 
          style={ChatStyles.avatarImage}
          resizeMode="cover"
        />
      </View>
      
      <View style={{ flex: 1 }}>
        {/* Message Bubble with typing indicator */}
        <View style={[ChatStyles.messageBubble, ChatStyles.aiMessage, { paddingVertical: 16 }]}>
          {/* Simple typing indicator with three dots */}
          <TypingIndicator />
        </View>
      </View>
    </View>
  );
}
