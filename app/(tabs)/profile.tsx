import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../theme/colors';
import { friendsService, Friend } from '../../services/friendsService';
import { leaderboardService, LeaderboardEntry } from '../../services/leaderboardService';
import { profileService } from '../../services/profileService';
import authService from '../../services/authService';
import {
  ProfileHeader,
  UserAvatarSection,
  UserInfoDisplay,
  UserInfoEdit,
  HighScoresSection,
  FriendsListSection,
  FriendProfileModal,
  SignOutSection
} from '../../components/profile';

export default function ProfileTab() {
  const { isDark } = useTheme();
  const { user, updateUser, signOut } = useAuth();
  const colors = isDark ? COLORS.dark : COLORS.light;

  // Data state
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friendLeaderboardEntries, setFriendLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  // Loading states
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingScores, setLoadingScores] = useState(false);
  const [loadingFriendData, setLoadingFriendData] = useState(false);
  const [saving, setSaving] = useState(false);

  // UI states
  const [showFriendPopover, setShowFriendPopover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editFirstName, setEditFirstName] = useState(user?.firstName || '');
  const [editLastName, setEditLastName] = useState(user?.lastName || '');
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editProfileImage, setEditProfileImage] = useState<string | null>(null);

  // Event handlers
  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditFirstName(user?.firstName || '');
    setEditLastName(user?.lastName || '');
    setEditUsername(user?.username || '');
    setEditProfileImage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFirstName(user?.firstName || '');
    setEditLastName(user?.lastName || '');
    setEditUsername(user?.username || '');
    setEditProfileImage(null);
  };

  const handleSaveProfile = async () => {
    const token = authService.getToken();
    if (!token) return;

    setSaving(true);
    try {
      const profileData: any = {
        firstName: editFirstName,
        lastName: editLastName,
        username: editUsername,
      };

      if (editProfileImage) {
        profileData.photo = {
          uri: editProfileImage,
        };
      }

      const updatedUser = await profileService.updateProfile(token, profileData);
      updateUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to select a photo',
      [
        { text: 'Camera', onPress: handleCamera },
        { text: 'Photo Library', onPress: handleImagePicker },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setEditProfileImage(result.assets[0].uri);
    }
  };

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setEditProfileImage(result.assets[0].uri);
    }
  };

  const loadFriendData = async (friend: Friend) => {
    const token = authService.getToken();
    if (!token || !friend.username) return;
    
    setLoadingFriendData(true);
    try {
      const entries = await leaderboardService.getUserLeaderboardEntries(token, friend.username);
      setFriendLeaderboardEntries(entries);
    } catch (error) {
      console.error('Error loading friend data:', error);
      setFriendLeaderboardEntries([]);
    } finally {
      setLoadingFriendData(false);
    }
  };

  const handleFriendClick = async (friend: Friend) => {
    setSelectedFriend(friend);
    setShowFriendPopover(true);
    await loadFriendData(friend);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const loadFriendsList = async () => {
    const token = authService.getToken();
    if (!token) return;
    
    setLoadingFriends(true);
    try {
      const friendsList = await friendsService.getFriendsList(token);
      const validFriends = friendsList.filter(friend => friend && friend.id);
      setFriends(validFriends);
    } catch (error) {
      console.error('Error loading friends:', error);
      Alert.alert('Error', 'Failed to load friends list');
    } finally {
      setLoadingFriends(false);
    }
  };

  const loadLeaderboardEntries = async () => {
    const token = authService.getToken();
    if (!token || !user?.username) return;
    
    setLoadingScores(true);
    try {
      const entries = await leaderboardService.getUserLeaderboardEntries(token, user.username);
      setLeaderboardEntries(entries);
    } catch (error) {
      console.error('Error loading leaderboard entries:', error);
      Alert.alert('Error', 'Failed to load leaderboard scores');
    } finally {
      setLoadingScores(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadFriendsList();
      loadLeaderboardEntries();
      setEditFirstName(user.firstName || '');
      setEditLastName(user.lastName || '');
      setEditUsername(user.username || '');
    }
  }, [user]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ProfileHeader 
        userName={user?.firstName}
        userEmail={user?.email}
        colors={colors}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {user && (
          <>
            {/* User Avatar & Info Section */}
            <View className="items-center px-6 py-8">
              <View className="mb-4 items-center">
                <UserAvatarSection
                  user={user}
                  isEditing={isEditing}
                  editProfileImage={editProfileImage}
                  colors={colors}
                  isDark={isDark}
                  onImagePress={showImageOptions}
                />
              </View>

              {isEditing ? (
                <UserInfoEdit
                  editFirstName={editFirstName}
                  editLastName={editLastName}
                  editUsername={editUsername}
                  saving={saving}
                  colors={colors}
                  isDark={isDark}
                  onFirstNameChange={setEditFirstName}
                  onLastNameChange={setEditLastName}
                  onUsernameChange={setEditUsername}
                  onCancel={handleCancelEdit}
                  onSave={handleSaveProfile}
                />
              ) : (
                <UserInfoDisplay
                  user={user}
                  colors={colors}
                  onEditPress={handleEditProfile}
                />
              )}
            </View>

            <HighScoresSection
              leaderboardEntries={leaderboardEntries}
              loadingScores={loadingScores}
              colors={colors}
              isDark={isDark}
              formatDate={formatDate}
            />

            <FriendsListSection
              friends={friends}
              loadingFriends={loadingFriends}
              colors={colors}
              isDark={isDark}
              onFriendClick={handleFriendClick}
            />

            <FriendProfileModal
              visible={showFriendPopover}
              selectedFriend={selectedFriend}
              friendLeaderboardEntries={friendLeaderboardEntries}
              loadingFriendData={loadingFriendData}
              colors={colors}
              isDark={isDark}
              formatDate={formatDate}
              onClose={() => setShowFriendPopover(false)}
            />

            <SignOutSection
              isDark={isDark}
              onSignOut={handleLogout}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}