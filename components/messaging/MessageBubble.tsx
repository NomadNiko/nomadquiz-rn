import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MessageBubbleProps } from '../../types/messaging';
import { COLORS } from '../../theme/colors';
import { getUserDisplayName } from '../../utils/userUtils';
import UserDisplay from '../UserDisplay';
import TimeDisplay from '../ui/TimeDisplay';

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showSender,
  isLastInGroup,
  showTimeGap,
  isDark,
}) => {
  const colors = isDark ? COLORS.dark : COLORS.light;

  const isSystemMessage = message.type === 'system';
  const senderName = message.senderId ? getUserDisplayName(message.senderId) : '';

  // System message rendering
  if (isSystemMessage) {
    return (
      <View>
        {/* Time gap separator */}
        {showTimeGap && (
          <View className="my-6 items-center">
            <TimeDisplay timestamp={message.timestamp} variant="gap" isDark={isDark} />
          </View>
        )}

        {/* System message */}
        <View className="my-4 items-center">
          <View className="rounded-full px-4 py-2" style={{ backgroundColor: colors.grey5 }}>
            <Text className="text-center font-medium text-sm" style={{ color: colors.grey2 }}>
              {message.content}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View>
      {/* Time gap separator */}
      {showTimeGap && (
        <View className="my-6 items-center">
          <TimeDisplay timestamp={message.timestamp} variant="gap" isDark={isDark} />
        </View>
      )}

      <View
        className={`mb-1 max-w-[85%] ${isOwnMessage ? 'self-end' : 'self-start'}`}
        style={{ marginBottom: isLastInGroup ? 12 : 2 }}>
        {/* Sender name for other people's messages */}
        {showSender && (
          <View
            className="mb-2 ml-4 self-start rounded px-3 py-1"
            style={{ backgroundColor: colors.grey5 }}>
            <Text className="font-medium text-xs" style={{ color: colors.grey2 }}>
              {senderName}
            </Text>
          </View>
        )}

        <View className="flex-row items-end">
          {/* Avatar for other users (only on last message in group) */}
          {!isOwnMessage && isLastInGroup && message.senderId && (
            <View className="mb-1 mr-3">
              <UserDisplay
                user={message.senderId}
                size="small"
              />
            </View>
          )}
          {!isOwnMessage && !isLastInGroup && <View style={{ width: 44 }} />}

          {/* Message bubble */}
          <View
            className="rounded px-5 py-4"
            style={{
              backgroundColor: isOwnMessage ? colors.primary : colors.card,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
              borderWidth: isOwnMessage ? 0 : 1,
              borderColor: colors.grey5,
            }}>
            <Text
              className="text-base leading-6"
              style={{
                color: isOwnMessage ? 'white' : (isDark ? 'white' : 'black'),
                fontWeight: '400',
              }}>
              {message.content}
            </Text>

            {/* Message status and timestamp inline */}
            <View
              className={`mt-1 flex-row items-center ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <TimeDisplay timestamp={message.timestamp} variant="bubble" isDark={isDark} />

              {/* Message status indicators for own messages */}
              {isOwnMessage && (
                <View className="ml-1 flex-row">
                  <Ionicons name="checkmark" size={12} color={colors.status.messageIcon} />
                  <Ionicons
                    name="checkmark"
                    size={12}
                    color={colors.status.messageIcon}
                    style={{ marginLeft: -6 }}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MessageBubble;
