import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';
import { COLORS } from '../../theme/colors';
import LiquidGlassCard from '../ui/LiquidGlassCard';
import { Friend } from '../../services/friendsService';

interface FriendsListSectionProps {
  friends: Friend[];
  loadingFriends: boolean;
  colors: {
    primary: string;
    grey: string;
  };
  isDark: boolean;
  onFriendClick: (friend: Friend) => void;
}

export default function FriendsListSection({
  friends,
  loadingFriends,
  colors,
  isDark,
  onFriendClick
}: FriendsListSectionProps) {
  return (
    <View className="mt-4 px-6">
      <LiquidGlassCard variant="primary">
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="people" size={20} color={isDark ? COLORS.socialPrimary : COLORS.socialSecondary} />
              <Text
                className="ml-2 font-semibold text-lg"
                style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.semibold }}>
                Friends
              </Text>
            </View>
            <View 
              className="px-2 py-1 rounded"
              style={{ backgroundColor: isDark ? COLORS.socialPrimary + '33' : COLORS.socialSecondary + '33' }}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: isDark ? COLORS.socialPrimary : COLORS.socialSecondary, ...TEXT_STYLES.medium }}>
                {friends.length}
              </Text>
            </View>
          </View>

          {loadingFriends ? (
            <View className="items-center py-8">
              <Text style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                Loading friends...
              </Text>
            </View>
          ) : friends.length > 0 ? (
            <View className="space-y-2">
              {friends.filter(friend => friend && friend.id).map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  onPress={() => onFriendClick(friend)}
                  className="flex-row items-center p-3 rounded-lg"
                  style={{ backgroundColor: isDark ? COLORS.glassGradientPrimary : COLORS.glassGradientLightSecondary }}
                >
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: isDark ? COLORS.socialPrimary : COLORS.socialSecondary }}
                  >
                    <Text
                      className="font-bold"
                      style={{ color: COLORS.white, ...TEXT_STYLES.bold }}>
                      {(friend.firstName?.[0] || '')}{(friend.lastName?.[0] || '')}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-medium text-base"
                      style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.medium }}>
                      {friend.firstName || ''} {friend.lastName || ''}
                    </Text>
                    <Text
                      className="text-sm"
                      style={{ color: isDark ? COLORS.textSecondary : COLORS.textTertiaryLight, ...TEXT_STYLES.regular }}>
                      @{friend.username || 'unknown'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.grey} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="items-center py-8">
              <Ionicons name="people-outline" size={48} color={colors.grey} />
              <Text
                className="mt-2 text-center"
                style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                No friends yet
              </Text>
            </View>
          )}
        </View>
      </LiquidGlassCard>
    </View>
  );
}