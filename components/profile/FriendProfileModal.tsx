import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';
import { Friend } from '../../services/friendsService';
import { LeaderboardEntry } from '../../services/leaderboardService';

interface FriendProfileModalProps {
  visible: boolean;
  selectedFriend: Friend | null;
  friendLeaderboardEntries: LeaderboardEntry[];
  loadingFriendData: boolean;
  colors: {
    background: string;
    primary: string;
    grey: string;
  };
  isDark: boolean;
  formatDate: (dateString: string) => string;
  onClose: () => void;
}

export default function FriendProfileModal({
  visible,
  selectedFriend,
  friendLeaderboardEntries,
  loadingFriendData,
  colors,
  isDark,
  formatDate,
  onClose
}: FriendProfileModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View 
          className="m-6 rounded-2xl p-6 max-h-96"
          style={{ backgroundColor: colors.background, width: '90%' }}
        >
          {selectedFriend && (
            <>
              <View className="flex-row justify-between items-start mb-6">
                <View className="flex-1">
                  {/* Friend's Photo */}
                  <View className="items-center mb-4">
                    {selectedFriend?.photo?.path ? (
                      <Image
                        source={{ uri: selectedFriend.photo.path }}
                        className="w-20 h-20 rounded-full"
                        style={{ backgroundColor: colors.grey }}
                      />
                    ) : (
                      <View 
                        className="w-20 h-20 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <Text
                          className="font-bold text-2xl text-white"
                          style={TEXT_STYLES.bold}>
                          {(selectedFriend?.firstName?.[0] || '') + (selectedFriend?.lastName?.[0] || '')}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Friend's Info */}
                  <Text
                    className="font-bold text-xl text-center mb-1"
                    style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.bold }}
                  >
                    {selectedFriend.firstName} {selectedFriend.lastName}
                  </Text>
                  <Text
                    className="text-base text-center"
                    style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', ...TEXT_STYLES.regular }}
                  >
                    @{selectedFriend.username}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={colors.grey} />
                </TouchableOpacity>
              </View>

              <ScrollView className="max-h-64">
                {/* Friend's High Scores */}
                <View className="mb-6">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="trophy" size={18} color={colors.primary} />
                    <Text
                      className="ml-2 font-semibold text-base"
                      style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.semibold }}
                    >
                      High Scores
                    </Text>
                  </View>
                  
                  {loadingFriendData ? (
                    <View className="items-center py-4">
                      <Text style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                        Loading scores...
                      </Text>
                    </View>
                  ) : friendLeaderboardEntries.length > 0 ? (
                    <View className="space-y-2">
                      {friendLeaderboardEntries.slice(0, 3).map((entry, index) => (
                        <View key={entry.id} className="flex-row justify-between items-center py-2">
                          <View className="flex-1">
                            <Text
                              className="font-medium text-sm"
                              style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.medium }}
                            >
                              {entry.leaderboardId}
                            </Text>
                            <Text
                              className="text-xs"
                              style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)', ...TEXT_STYLES.regular }}
                            >
                              {formatDate(entry.timestamp)}
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <Ionicons name="trophy" size={12} color="#FFD700" />
                            <Text
                              className="ml-1 font-bold text-sm"
                              style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.bold }}
                            >
                              {entry.score.toLocaleString()}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View className="items-center py-3">
                      <Text
                        className="text-sm text-center"
                        style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)', ...TEXT_STYLES.regular }}
                      >
                        No scores yet
                      </Text>
                    </View>
                  )}
                </View>

                {/* Friend's Friends Count */}
                <View>
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="people" size={18} color={colors.primary} />
                    <Text
                      className="ml-2 font-semibold text-base"
                      style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.semibold }}
                    >
                      Friends
                    </Text>
                  </View>
                  
                  <View className="items-center py-3">
                    <Text
                      className="text-sm text-center"
                      style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)', ...TEXT_STYLES.regular }}
                    >
                      Friends list is private
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}