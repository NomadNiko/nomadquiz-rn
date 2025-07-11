import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TEXT_STYLES } from '../../theme/fonts';
import { COLORS } from '../../theme/colors';
import { LeaderboardEntry } from '../../services/leaderboardService';
import UserDisplay from '../UserDisplay';
import LiquidGlassCard from '../ui/LiquidGlassCard';

interface LeaderboardModalProps {
  visible: boolean;
  selectedLeaderboard: any;
  leaderboardEntries: any[];
  loadingEntries: boolean;
  selectedUser: any;
  userLeaderboardEntries: LeaderboardEntry[];
  loadingUserData: boolean;
  friendshipStatus: 'none' | 'friend' | 'requested' | 'received';
  currentUser: any;
  colors: {
    background: string;
    grey: string;
    primary: string;
    foreground: string;
    grey2: string;
    grey5: string;
  };
  isDark: boolean;
  formatDate: (dateString: string) => string;
  onClose: () => void;
  onUserPress: (entry: any) => void;
  onAddFriend: () => void;
}

export default function LeaderboardModal({
  visible,
  selectedLeaderboard,
  leaderboardEntries,
  loadingEntries,
  selectedUser,
  userLeaderboardEntries,
  loadingUserData,
  friendshipStatus,
  currentUser,
  colors,
  isDark,
  formatDate,
  onClose,
  onUserPress,
  onAddFriend
}: LeaderboardModalProps) {
  const [showingUserProfile, setShowingUserProfile] = useState(false);

  const handleUserPress = (entry: any) => {
    setShowingUserProfile(true);
    onUserPress(entry);
  };

  const handleBackToLeaderboard = () => {
    setShowingUserProfile(false);
  };

  useEffect(() => {
    if (!visible) {
      setShowingUserProfile(false);
    }
  }, [visible]);

  const getFriendshipButtonConfig = () => {
    switch (friendshipStatus) {
      case 'friend':
        return {
          text: 'Friends',
          icon: 'people',
          backgroundColor: colors.primary,
          textColor: 'white',
          disabled: true
        };
      case 'requested':
        return {
          text: 'Request Sent',
          icon: 'checkmark',
          backgroundColor: colors.grey,
          textColor: 'white',
          disabled: true
        };
      case 'received':
        return {
          text: 'Accept Friend Request',
          icon: 'person-add',
          backgroundColor: COLORS.socialAccent,
          textColor: 'white',
          disabled: false,
          onPress: () => Alert.alert('Accept Friend Request', 'Go to Friends tab to accept this request')
        };
      default:
        return {
          text: 'Add Friend',
          icon: 'person-add',
          backgroundColor: colors.primary,
          textColor: 'white',
          disabled: false,
          onPress: onAddFriend
        };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View 
          className="m-6 rounded-2xl"
          style={{ 
            backgroundColor: colors.background, 
            width: '90%', 
            height: '80%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
              {/* Header */}
              <View className="flex-row justify-between items-center p-6 border-b" style={{ borderBottomColor: colors.grey + '30' }}>
                <View className="flex-1 flex-row items-center">
                  {showingUserProfile && (
                    <TouchableOpacity onPress={handleBackToLeaderboard} className="mr-3">
                      <Ionicons name="arrow-back" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                  <View className="flex-1">
                    <Text
                      className="font-bold text-xl"
                      style={{ color: colors.foreground, ...TEXT_STYLES.bold }}
                    >
                      {showingUserProfile 
                        ? selectedUser?.user?.username || 'User Profile'
                        : selectedLeaderboard?.leaderboardId
                      }
                    </Text>
                    <Text
                      className="text-sm"
                      style={{ color: colors.grey2, ...TEXT_STYLES.regular }}
                    >
                      {showingUserProfile ? 'Player Profile' : 'Top 10 Players'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onClose} className="ml-4">
                  <Ionicons name="close" size={24} color={colors.grey} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView className="flex-1">
                {showingUserProfile ? (
                  /* User Profile View */
                  <View className="p-6">
                    <LiquidGlassCard isDark={isDark} className="mb-6">
                      <View className="items-center">
                        <UserDisplay
                          user={selectedUser?.user}
                          size="large"
                        />
                        <Text
                          className="font-semibold text-lg mt-4"
                          style={{ color: colors.foreground, ...TEXT_STYLES.semibold }}
                        >
                          {selectedUser?.user?.firstName && selectedUser?.user?.lastName 
                            ? `${selectedUser.user.firstName} ${selectedUser.user.lastName}`
                            : selectedUser?.user?.username || 'Unknown User'
                          }
                        </Text>
                        <Text
                          className="text-sm"
                          style={{ color: colors.grey2, ...TEXT_STYLES.regular }}
                        >
                          @{selectedUser?.user?.username || 'unknown'}
                        </Text>

                        {/* Friend Button - Only show if not yourself */}
                        {selectedUser?.user?.username !== currentUser?.username && (
                          <View className="mt-6 w-full">
                            {(() => {
                              const buttonConfig = getFriendshipButtonConfig();
                              return (
                                <TouchableOpacity 
                                  className="py-4 px-6 rounded-xl flex-row items-center justify-center"
                                  style={{ backgroundColor: buttonConfig.backgroundColor }}
                                  onPress={buttonConfig.onPress}
                                  disabled={buttonConfig.disabled}
                                >
                                  <Ionicons name={buttonConfig.icon} size={16} color={buttonConfig.textColor} />
                                  <Text
                                    className="font-semibold text-center ml-2"
                                    style={{ color: buttonConfig.textColor, ...TEXT_STYLES.semibold }}
                                  >
                                    {buttonConfig.text}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })()}
                          </View>
                        )}
                      </View>
                    </LiquidGlassCard>

                    {/* User's High Scores */}
                    <LiquidGlassCard isDark={isDark}>
                      <View className="flex-row items-center mb-4">
                        <Ionicons name="trophy" size={18} color={colors.primary} />
                        <Text
                          className="ml-2 font-semibold text-lg"
                          style={{ color: colors.foreground, ...TEXT_STYLES.semibold }}
                        >
                          Best Scores
                        </Text>
                      </View>
                      
                      {loadingUserData ? (
                        <View className="items-center py-8">
                          <Text style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                            Loading scores...
                          </Text>
                        </View>
                      ) : userLeaderboardEntries.length > 0 ? (
                        <View className="space-y-3">
                          {userLeaderboardEntries.slice(0, 5).map((entry, index) => (
                            <View key={entry.id || index} className="flex-row justify-between items-center py-3 px-4 rounded-lg" style={{ backgroundColor: colors.grey5 }}>
                              <View className="flex-1">
                                <Text
                                  className="font-medium text-base"
                                  style={{ color: colors.foreground, ...TEXT_STYLES.medium }}>
                                  {entry.leaderboardId}
                                </Text>
                                <Text
                                  className="text-sm"
                                  style={{ color: colors.grey2, ...TEXT_STYLES.regular }}>
                                  {formatDate(entry.timestamp)}
                                </Text>
                              </View>
                              <View className="flex-row items-center">
                                <Ionicons name="trophy" size={14} color={COLORS.gold} />
                                <Text
                                  className="ml-2 font-bold text-base"
                                  style={{ color: colors.foreground, ...TEXT_STYLES.bold }}>
                                  {entry.score.toLocaleString()}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <View className="items-center py-8">
                          <View className="rounded-full p-4" style={{ backgroundColor: colors.grey5 }}>
                            <Ionicons name="trophy-outline" size={32} color={colors.grey2} />
                          </View>
                          <Text 
                            className="text-center mt-4"
                            style={{ color: colors.grey2, ...TEXT_STYLES.regular }}
                          >
                            No scores yet
                          </Text>
                        </View>
                      )}
                    </LiquidGlassCard>
                  </View>
                ) : (
                  /* Leaderboard View */
                  <View className="p-6">
                    {loadingEntries ? (
                      <View className="items-center py-12">
                        <Text style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                          Loading entries...
                        </Text>
                      </View>
                    ) : (
                      <LiquidGlassCard isDark={isDark}>
                        <View className="space-y-1">
                          {leaderboardEntries.map((entry, index) => {
                            const isCurrentUser = entry.user?.username === currentUser?.username;
                            return (
                            <TouchableOpacity 
                              key={entry.id || index} 
                              className="flex-row items-center py-4 px-2 rounded-lg"
                              style={{ 
                                backgroundColor: isCurrentUser 
                                  ? colors.primary + '20'
                                  : index < 3 ? COLORS.gold + '26' : COLORS.transparent,
                                borderBottomWidth: index < leaderboardEntries.length - 1 ? 1 : 0,
                                borderBottomColor: colors.grey + '20'
                              }}
                              onPress={() => handleUserPress(entry)}
                            >
                              {/* Position Badge */}
                              <View 
                                className="mr-4 items-center justify-center rounded-full"
                                style={{
                                  width: 32,
                                  height: 32,
                                  backgroundColor: index < 3 ? COLORS.gold : colors.grey
                                }}
                              >
                                <Text
                                  className="font-bold text-sm"
                                  style={{ color: index < 3 ? COLORS.black : COLORS.white, ...TEXT_STYLES.bold }}
                                >
                                  {index + 1}
                                </Text>
                              </View>
                              
                              {/* User Info */}
                              <View className="flex-row items-center flex-1">
                                <UserDisplay
                                  user={entry.user}
                                  size="small"
                                  className="mr-3"
                                />
                                <View className="flex-1">
                                  <Text
                                    className={isCurrentUser ? "font-semibold text-lg" : "font-medium text-base"}
                                    style={{ color: colors.foreground, ...TEXT_STYLES.medium }}
                                  >
                                    {entry.user?.username || 'Unknown Player'}
                                  </Text>
                                  <Text
                                    className="text-sm"
                                    style={{ color: colors.grey2, ...TEXT_STYLES.regular }}
                                  >
                                    {formatDate(entry.timestamp)}
                                  </Text>
                                </View>
                              </View>
                              
                              {/* Score */}
                              <View className="flex-row items-center">
                                <Ionicons name="trophy" size={16} color={COLORS.gold} />
                                <Text
                                  className={isCurrentUser ? "ml-2 font-bold text-xl" : "ml-2 font-bold text-lg"}
                                  style={{ color: colors.foreground, ...TEXT_STYLES.bold }}
                                >
                                  {entry.score.toLocaleString()}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            );
                          })}
                        </View>
                      </LiquidGlassCard>
                    )}
                  </View>
                )}
              </ScrollView>
        </View>
      </View>
    </Modal>
  );
}