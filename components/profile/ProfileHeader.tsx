import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TEXT_STYLES } from '../../theme/fonts';
import ThemeToggle from '../ThemeToggle';

interface ProfileHeaderProps {
  userName?: string;
  userEmail?: string;
  colors: {
    background: string;
    foreground: string;
    grey: string;
  };
}

export default function ProfileHeader({ userName, userEmail, colors }: ProfileHeaderProps) {
  return (
    <SafeAreaView edges={['top']}>
      <View className="flex-row items-center justify-between px-6 pb-4">
        <View>
          <Text
            className="font-bold text-2xl"
            style={{ color: colors.foreground, ...TEXT_STYLES.bold }}>
            Profile
          </Text>
          <Text className="text-sm" style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
            Welcome back, {userName || userEmail}!
          </Text>
        </View>
        <ThemeToggle />
      </View>
    </SafeAreaView>
  );
}