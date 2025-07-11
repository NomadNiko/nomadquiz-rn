import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';
import LiquidGlassCard from '../ui/LiquidGlassCard';

interface HowItWorksSectionProps {
  colors: {
    primary: string;
  };
  isDark: boolean;
}

export default function HowItWorksSection({ colors, isDark }: HowItWorksSectionProps) {
  return (
    <LiquidGlassCard variant="accent" className="mt-1">
      <View className="p-4">
        <View className="mb-3 flex-row items-center">
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text 
            className="ml-2 font-semibold"
            style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.semibold }}
          >
            How Leaderboards Work
          </Text>
        </View>
        <Text 
          className="text-sm leading-5"
          style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)', ...TEXT_STYLES.regular }}
        >
          Complete quizzes to earn points and climb the leaderboards! Your scores are automatically ranked against your friends and other players. The more you play, the higher you can climb!
        </Text>
      </View>
    </LiquidGlassCard>
  );
}