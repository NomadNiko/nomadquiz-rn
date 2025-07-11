import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';
import { useTheme } from '../../contexts/ThemeContext';

interface AvatarUploadProps {
  imageUri?: string;
  firstName?: string;
  lastName?: string;
  onImageSelected: (uri: string) => void;
  size?: 'small' | 'medium' | 'large';
}

export default function AvatarUpload({
  imageUri,
  firstName = '',
  lastName = '',
  onImageSelected,
  size = 'large'
}: AvatarUploadProps) {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const sizeMap = {
    small: 60,
    medium: 80,
    large: 120
  };

  const iconSizeMap = {
    small: 12,
    medium: 16,
    large: 20
  };

  const avatarSize = sizeMap[size];
  const iconSize = iconSizeMap[size];

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
      onImageSelected(result.assets[0].uri);
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
      onImageSelected(result.assets[0].uri);
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

  const getInitials = () => {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  return (
    <View className="items-center">
      <TouchableOpacity onPress={showImageOptions}>
        <View className="relative">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: colors.grey
              }}
            />
          ) : (
            <View 
              className="items-center justify-center"
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: colors.primary
              }}
            >
              <Text
                className="font-bold text-white"
                style={{
                  fontSize: avatarSize * 0.3,
                  ...TEXT_STYLES.bold
                }}>
                {getInitials()}
              </Text>
            </View>
          )}
          <View 
            className="absolute items-center justify-center"
            style={{
              bottom: -4,
              right: -4,
              width: avatarSize * 0.25,
              height: avatarSize * 0.25,
              borderRadius: (avatarSize * 0.25) / 2,
              backgroundColor: colors.primary,
              borderWidth: 2,
              borderColor: colors.background
            }}
          >
            <Ionicons name="camera" size={iconSize} color="white" />
          </View>
        </View>
      </TouchableOpacity>
      <Text
        className="mt-2 text-center text-sm"
        style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
        Tap to change photo
      </Text>
    </View>
  );
}