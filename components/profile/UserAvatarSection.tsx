import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserDisplay from '../UserDisplay';
import { TEXT_STYLES } from '../../theme/fonts';

interface User {
  firstName?: string;
  lastName?: string;
  photo?: {
    path: string;
  };
}

interface UserAvatarSectionProps {
  user: User;
  isEditing: boolean;
  editProfileImage: string | null;
  colors: {
    grey: string;
    primary: string;
  };
  isDark: boolean;
  onImagePress: () => void;
}

export default function UserAvatarSection({ 
  user, 
  isEditing, 
  editProfileImage, 
  colors, 
  isDark,
  onImagePress 
}: UserAvatarSectionProps) {
  if (isEditing) {
    return (
      <TouchableOpacity onPress={onImagePress}>
        <View className="relative">
          {editProfileImage ? (
            <Image
              source={{ uri: editProfileImage }}
              className="w-24 h-24 rounded-full"
              style={{ backgroundColor: colors.grey }}
            />
          ) : user?.photo?.path ? (
            <Image
              source={{ uri: user.photo.path }}
              className="w-24 h-24 rounded-full"
              style={{ backgroundColor: colors.grey }}
            />
          ) : (
            <View 
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text
                className="font-bold text-3xl text-white"
                style={TEXT_STYLES.bold}>
                {(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')}
              </Text>
            </View>
          )}
          <View 
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <UserDisplay
      user={user}
      size="large"
    />
  );
}