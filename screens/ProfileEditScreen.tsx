import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../theme/colors';
import { TEXT_STYLES } from '../theme/fonts';
import LiquidGlassCard from '../components/ui/LiquidGlassCard';
import * as ImagePicker from 'expo-image-picker';
import { profileService } from '../services/profileService';
import authService from '../services/authService';

export default function ProfileEditScreen() {
  const { isDark } = useTheme();
  const { user, updateUser } = useAuth();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState(user?.photo?.path || null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const token = authService.getToken();
    if (!token) return;

    setLoading(true);
    try {
      const profileData: any = {
        firstName,
        lastName,
        username,
      };

      if (profileImage && profileImage !== user?.photo?.path) {
        profileData.photo = {
          uri: profileImage,
        };
      }

      const updatedUser = await profileService.updateProfile(token, profileData);
      updateUser(updatedUser);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
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
      setProfileImage(result.assets[0].uri);
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
      setProfileImage(result.assets[0].uri);
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

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text
            className="font-bold text-xl"
            style={{ color: colors.foreground, ...TEXT_STYLES.bold }}>
            Edit Profile
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: loading ? colors.grey : colors.primary }}
          >
            <Text
              className="font-semibold"
              style={{ color: COLORS.white, ...TEXT_STYLES.semibold }}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Profile Photo Section */}
          <LiquidGlassCard variant="primary" className="mb-6" isDark={isDark}>
            <View className="items-center p-6">
              <TouchableOpacity onPress={showImageOptions}>
                <View className="relative">
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      className="w-24 h-24 rounded-full"
                      style={{ backgroundColor: colors.grey }}
                    />
                  ) : (
                    <View 
                      className="w-24 h-24 rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text
                        className="font-bold text-3xl"
                        style={{ color: COLORS.white, ...TEXT_STYLES.bold }}>
                        {firstName[0]}{lastName[0]}
                      </Text>
                    </View>
                  )}
                  <View 
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Ionicons name="camera" size={16} color={COLORS.white} />
                  </View>
                </View>
              </TouchableOpacity>
              <Text
                className="mt-3 text-sm text-center"
                style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                Tap to change profile photo
              </Text>
            </View>
          </LiquidGlassCard>

          {/* Form Fields */}
          <LiquidGlassCard variant="primary" className="mb-6" isDark={isDark}>
            <View className="p-4">
              <Text
                className="mb-4 font-semibold text-lg"
                style={{ color: colors.foreground, ...TEXT_STYLES.semibold }}>
                Personal Information
              </Text>

              <View className="space-y-4">
                <View>
                  <Text
                    className="mb-2 font-medium text-sm"
                    style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight, ...TEXT_STYLES.medium }}>
                    First Name
                  </Text>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter first name"
                    placeholderTextColor={colors.grey}
                    className="p-3 rounded-lg border"
                    style={{
                      color: colors.foreground,
                      backgroundColor: isDark ? colors.glass.default.light : colors.glass.default.dark,
                      borderColor: isDark ? colors.glass.default.border : colors.glass.default.border,
                      ...TEXT_STYLES.regular
                    }}
                  />
                </View>

                <View>
                  <Text
                    className="mb-2 font-medium text-sm"
                    style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight, ...TEXT_STYLES.medium }}>
                    Last Name
                  </Text>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter last name"
                    placeholderTextColor={colors.grey}
                    className="p-3 rounded-lg border"
                    style={{
                      color: colors.foreground,
                      backgroundColor: isDark ? colors.glass.default.light : colors.glass.default.dark,
                      borderColor: isDark ? colors.glass.default.border : colors.glass.default.border,
                      ...TEXT_STYLES.regular
                    }}
                  />
                </View>

                <View>
                  <Text
                    className="mb-2 font-medium text-sm"
                    style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight, ...TEXT_STYLES.medium }}>
                    Username
                  </Text>
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter username"
                    placeholderTextColor={colors.grey}
                    autoCapitalize="none"
                    className="p-3 rounded-lg border"
                    style={{
                      color: colors.foreground,
                      backgroundColor: isDark ? colors.glass.default.light : colors.glass.default.dark,
                      borderColor: isDark ? colors.glass.default.border : colors.glass.default.border,
                      ...TEXT_STYLES.regular
                    }}
                  />
                </View>

                <View>
                  <Text
                    className="mb-2 font-medium text-sm"
                    style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight, ...TEXT_STYLES.medium }}>
                    Email
                  </Text>
                  <TextInput
                    value={email}
                    editable={false}
                    placeholder="Email address"
                    placeholderTextColor={colors.grey}
                    className="p-3 rounded-lg border"
                    style={{
                      color: colors.grey,
                      backgroundColor: isDark ? COLORS.glassLensEffectDark : COLORS.glassLensEffectLight,
                      borderColor: isDark ? COLORS.glassGradientSecondary : COLORS.glassGradientLightSecondary,
                      ...TEXT_STYLES.regular
                    }}
                  />
                  <Text
                    className="mt-1 text-xs"
                    style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                    Email cannot be changed
                  </Text>
                </View>
              </View>
            </View>
          </LiquidGlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}