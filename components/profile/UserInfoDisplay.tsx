import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';

interface User {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

interface UserInfoDisplayProps {
  user: User;
  colors: {
    foreground: string;
    grey: string;
    primary: string;
  };
  onEditPress: () => void;
}

export default function UserInfoDisplay({ user, colors, onEditPress }: UserInfoDisplayProps) {
  return (
    <>
      <Text
        className="font-bold text-2xl mb-2"
        style={{ color: colors.foreground, ...TEXT_STYLES.bold }}>
        {user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName || user.lastName || 'User'}
      </Text>
      {user.username && (
        <Text
          className="text-base mb-1"
          style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
          @{user.username}
        </Text>
      )}
      <Text
        className="text-base mb-4"
        style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
        {user.email}
      </Text>
      
      <TouchableOpacity
        onPress={onEditPress}
        className="flex-row items-center px-6 py-3 rounded-xl"
        style={{ backgroundColor: colors.primary }}
      >
        <Ionicons name="person-outline" size={16} color="white" style={{ marginRight: 8 }} />
        <Text
          className="font-semibold text-base"
          style={{ color: 'white', ...TEXT_STYLES.semibold }}>
          Edit Profile
        </Text>
      </TouchableOpacity>
    </>
  );
}