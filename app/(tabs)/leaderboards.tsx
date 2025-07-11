import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMessagingStyles } from '../../hooks/useMessagingStyles';
import { TEXT_STYLES } from '../../theme/fonts';
import { useAuth } from '../../contexts/AuthContext';
import { leaderboardService, LeaderboardEntry } from '../../services/leaderboardService';
import authService from '../../services/authService';
import { friendsService, Friend, FriendRequest } from '../../services/friendsService';
import {
  PersonalRecordsSection,
  LeaderboardsList,
  LeaderboardModal,
  HowItWorksSection
} from '../../components/leaderboards';

export default function LeaderboardsTab() {
  const { colors, isDark } = useMessagingStyles();
  const { user } = useAuth();

  // Data state
  const [leaderboards, setLeaderboards] = useState<any[]>([]);
  const [personalRecords, setPersonalRecords] = useState<LeaderboardEntry[]>([]);
  const [leaderboardsWithEntries, setLeaderboardsWithEntries] = useState<any[]>([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState<any[]>([]);
  const [userLeaderboardEntries, setUserLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);

  // Selected items
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // UI state
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingTop3, setLoadingTop3] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const loadLeaderboards = async () => {
    const token = authService.getToken();
    if (!token) return;
    
    setLoading(true);
    try {
      const allLeaderboards = await leaderboardService.getAllLeaderboards(token);
      setLeaderboards(allLeaderboards);
      
      // Load top 3 entries for each leaderboard
      await loadTop3ForAllLeaderboards(allLeaderboards, token);
    } catch (error) {
      console.error('Error loading leaderboards:', error);
      Alert.alert('Error', 'Failed to load leaderboards');
    } finally {
      setLoading(false);
    }
  };

  const loadTop3ForAllLeaderboards = async (leaderboards: any[], token: string) => {
    setLoadingTop3(true);
    try {
      const leaderboardsWithTop3 = await Promise.all(
        leaderboards.map(async (leaderboard) => {
          try {
            const entries = await leaderboardService.getLeaderboardEntries(token, leaderboard.leaderboardId, { limit: 3 });
            return {
              ...leaderboard,
              top3Entries: entries.data || []
            };
          } catch (error) {
            console.error(`Error loading top 3 for ${leaderboard.leaderboardId}:`, error);
            return {
              ...leaderboard,
              top3Entries: []
            };
          }
        })
      );
      setLeaderboardsWithEntries(leaderboardsWithTop3);
    } catch (error) {
      console.error('Error loading top 3 entries:', error);
      setLeaderboardsWithEntries(leaderboards.map(lb => ({ ...lb, top3Entries: [] })));
    } finally {
      setLoadingTop3(false);
    }
  };

  const loadPersonalRecords = async () => {
    const token = authService.getToken();
    if (!token || !user?.username) return;
    
    setLoadingPersonal(true);
    try {
      const entries = await leaderboardService.getUserLeaderboardEntries(token, user.username);
      setPersonalRecords(entries);
    } catch (error) {
      console.error('Error loading personal records:', error);
    } finally {
      setLoadingPersonal(false);
    }
  };

  const loadLeaderboardEntries = async (leaderboardId: string) => {
    const token = authService.getToken();
    if (!token) return;
    
    setLoadingEntries(true);
    try {
      const entries = await leaderboardService.getLeaderboardEntries(token, leaderboardId, { limit: 10 });
      setLeaderboardEntries(entries.data || []);
    } catch (error) {
      console.error('Error loading leaderboard entries:', error);
      Alert.alert('Error', 'Failed to load leaderboard entries');
    } finally {
      setLoadingEntries(false);
    }
  };

  const loadUserProfile = async (selectedUser: any) => {
    const token = authService.getToken();
    if (!token || !selectedUser?.user?.username) {
      setLoadingUserData(false);
      return;
    }
    
    setLoadingUserData(true);
    
    try {
      // Load user entries and friend relationship data in parallel
      const [userEntries, friendsList, sentRequestsList, receivedRequestsList] = await Promise.all([
        leaderboardService.getUserLeaderboardEntries(token, selectedUser.user.username),
        friendsService.getFriendsList(token).catch(() => []),
        friendsService.getSentRequests(token).catch(() => []),
        friendsService.getReceivedRequests(token).catch(() => [])
      ]);
      
      setUserLeaderboardEntries(userEntries || []);
      setFriends(friendsList);
      setSentRequests(sentRequestsList);
      setReceivedRequests(receivedRequestsList);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserLeaderboardEntries([]);
    } finally {
      setLoadingUserData(false);
    }
  };

  const handleLeaderboardPress = async (leaderboard: any) => {
    setSelectedLeaderboard(leaderboard);
    setShowLeaderboardModal(true);
    await loadLeaderboardEntries(leaderboard.leaderboardId);
  };

  const handleUserPress = async (entry: any) => {
    setSelectedUser(entry);
    
    // Load user profile in background
    loadUserProfile(entry).catch(error => {
      console.error('Failed to load user profile:', error);
      setLoadingUserData(false);
    });
  };

  const getFriendshipStatus = (targetUser: any) => {
    if (!targetUser?.user?.id || !targetUser?.user?.username) return 'none';
    
    // Check if already friends
    const isAlreadyFriend = friends.some(friend => 
      friend.id === targetUser.user.id || friend.username === targetUser.user.username
    );
    if (isAlreadyFriend) return 'friend';
    
    // Check if we have a pending request to them
    const hasPendingRequest = sentRequests.some(request => 
      request.recipient?.id === targetUser.user.id || 
      request.recipient?.username === targetUser.user.username
    );
    if (hasPendingRequest) return 'requested';
    
    // Check if they have a pending request to us
    const hasReceivedRequest = receivedRequests.some(request => 
      request.requester?.id === targetUser.user.id || 
      request.requester?.username === targetUser.user.username
    );
    if (hasReceivedRequest) return 'received';
    
    return 'none';
  };

  const handleAddFriend = async () => {
    const token = authService.getToken();
    if (!token || !selectedUser?.user?.username) {
      Alert.alert('Error', 'Missing authentication or user data');
      return;
    }
    
    // Check if trying to add yourself
    if (selectedUser.user.username === user?.username) {
      Alert.alert('Error', "You can't add yourself as a friend");
      return;
    }
    
    try {
      await friendsService.sendFriendRequest(token, selectedUser.user.username);
      
      // Refresh the relationship status
      await loadUserProfile(selectedUser);
      
      Alert.alert('Success', 'Friend request sent!');
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      
      // More specific error messages
      if (error.message?.includes('422')) {
        Alert.alert('Error', 'Unable to send friend request. You may already be friends or have a pending request.');
      } else if (error.message?.includes('404')) {
        Alert.alert('Error', 'User not found');
      } else {
        Alert.alert('Error', error.message || 'Failed to send friend request. Please try again.');
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadLeaderboards(), loadPersonalRecords()]);
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      loadLeaderboards();
      loadPersonalRecords();
    }
  }, [user]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="px-6 pb-4">
          <Text
            className="font-bold text-2xl"
            style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.bold }}>
            Leaderboards
          </Text>
          <Text 
            className="text-sm"
            style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)', ...TEXT_STYLES.regular }}
          >
            Compete with friends and see who's on top!
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <PersonalRecordsSection
            personalRecords={personalRecords}
            loadingPersonal={loadingPersonal}
            colors={colors}
            isDark={isDark}
            formatDate={formatDate}
          />

          <LeaderboardsList
            leaderboardsWithEntries={leaderboardsWithEntries}
            loading={loading}
            loadingTop3={loadingTop3}
            colors={colors}
            isDark={isDark}
            onLeaderboardPress={handleLeaderboardPress}
          />

          <HowItWorksSection
            colors={colors}
            isDark={isDark}
          />
        </ScrollView>

        <LeaderboardModal
          visible={showLeaderboardModal}
          selectedLeaderboard={selectedLeaderboard}
          leaderboardEntries={leaderboardEntries}
          loadingEntries={loadingEntries}
          selectedUser={selectedUser}
          userLeaderboardEntries={userLeaderboardEntries}
          loadingUserData={loadingUserData}
          friendshipStatus={getFriendshipStatus(selectedUser)}
          currentUser={user}
          colors={colors}
          isDark={isDark}
          formatDate={formatDate}
          onClose={() => setShowLeaderboardModal(false)}
          onUserPress={handleUserPress}
          onAddFriend={handleAddFriend}
        />
      </SafeAreaView>
    </View>
  );
}