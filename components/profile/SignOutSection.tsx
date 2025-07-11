import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';
import { COLORS } from '../../theme/colors';

interface SignOutSectionProps {
  isDark: boolean;
  onSignOut: () => void;
}

export default function SignOutSection({ isDark, onSignOut }: SignOutSectionProps) {
  const colors = isDark ? COLORS.dark : COLORS.light;
  
  return (
    <View className="mt-8 px-6">
      <TouchableOpacity 
        onPress={onSignOut}
        className="flex-row items-center justify-center py-4 px-6 rounded-xl"
        style={{
          backgroundColor: isDark ? colors.glass.destructive.dark : colors.glass.destructive.light,
          borderColor: colors.glass.destructive.border,
          borderWidth: 1,
        }}
      >
        <Ionicons name="log-out" size={20} color={colors.destructive} style={{ marginRight: 8 }} />
        <Text
          className="font-semibold text-base"
          style={{ color: colors.destructive, ...TEXT_STYLES.semibold }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}