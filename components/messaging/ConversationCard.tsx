import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ConversationCardProps } from '../../types/messaging';
import { COLORS } from '../../theme/colors';
import { formatTime } from '../../utils/dateUtils';
import {
  getConversationDisplayName,
  getConversationPrimaryParticipant,
} from '../../utils/userUtils';
import UserDisplay from '../UserDisplay';

const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  currentUserId,
  onPress,
  isDark,
}) => {
  const colors = isDark ? COLORS.dark : COLORS.light;

  const displayName = getConversationDisplayName(conversation, currentUserId);
  const primaryParticipant = getConversationPrimaryParticipant(conversation, currentUserId);
  const timeText = formatTime(conversation.lastMessageAt);

  // Get message preview
  const messagePreview = conversation.lastMessage?.content || 'No messages yet';
  const isOwnMessage = conversation.lastMessage?.senderId?.id === currentUserId;
  const messagePrefix = isOwnMessage
    ? 'You: '
    : `${conversation.lastMessage?.senderId?.firstName || 'User'}: `;
  const displayPreview = conversation.lastMessage
    ? `${messagePrefix}${messagePreview}`
    : messagePreview;

  return (
    <TouchableOpacity
      className="mb-2 rounded"
      onPress={() => onPress(conversation)}
      activeOpacity={0.7}>
      <View
        style={{
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: colors.glass.primary.light,
          borderColor: colors.glass.primary.border,
          borderWidth: 1.5,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          overflow: 'hidden',
          position: 'relative',
        }}>
        {/* Gloss overlay with blue tint */}
        <LinearGradient
          colors={
            isDark
              ? [colors.glass.primary.border, colors.glass.primary.light, 'transparent']
              : [colors.glass.primary.border, colors.glass.primary.light, 'transparent']
          }
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60%',
            borderRadius: 12,
            opacity: 0.8,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        {/* Lens effect */}
        <View
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            right: 2,
            bottom: 2,
            borderRadius: 10,
            backgroundColor: colors.glass.primary.dark,
            opacity: 0.3,
          }}
        />
        {/* Content */}
        <View style={{ position: 'relative', zIndex: 10 }}>
          <View className="flex-row items-center">
            {/* Avatar */}
            <View className="relative mr-3">
              <UserDisplay
                user={primaryParticipant}
                size="medium"
              />

              {/* Online status indicator - placeholder */}
              <View
                className="absolute -bottom-1 -right-1 rounded border-2"
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: colors.status.online,
                  borderColor: colors.card,
                }}
              />
            </View>

            {/* Conversation Info */}
            <View className="flex-1 justify-center">
              <View className="mb-2 flex-row items-start justify-between">
                <Text
                  className="flex-1 font-bold text-2xl"
                  style={{ color: colors.foreground }}
                  numberOfLines={2}>
                  {displayName}
                </Text>
                <Text
                  className="ml-3 mt-1 font-medium text-xs"
                  style={{ color: isDark ? COLORS.textPrimary : COLORS.textTertiaryLight }}>
                  {timeText}
                </Text>
              </View>

              <Text
                className="text-sm"
                style={{ color: isDark ? COLORS.textSecondary : COLORS.textSecondaryLight }}
                numberOfLines={2}>
                {displayPreview}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationCard;
