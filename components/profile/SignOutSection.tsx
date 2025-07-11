import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';

interface SignOutSectionProps {
  isDark: boolean;
  onSignOut: () => void;
}

export default function SignOutSection({ isDark, onSignOut }: SignOutSectionProps) {
  return (
    <View className="mt-8 px-6">
      <TouchableOpacity 
        onPress={onSignOut}
        className="flex-row items-center justify-center py-4 px-6 rounded-xl"
        style={{
          backgroundColor: isDark ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.08)',
          borderColor: isDark ? 'rgba(220, 38, 38, 0.4)' : 'rgba(220, 38, 38, 0.3)',
          borderWidth: 1,
        }}
      >
        <Ionicons name="log-out" size={20} color="#DC2626" style={{ marginRight: 8 }} />
        <Text
          className="font-semibold text-base"
          style={{ color: '#DC2626', ...TEXT_STYLES.semibold }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}