import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';
import { COLORS } from '../../theme/colors';
import LiquidGlassCard from '../ui/LiquidGlassCard';
import { LeaderboardEntry } from '../../services/leaderboardService';

interface HighScoresSectionProps {
  leaderboardEntries: LeaderboardEntry[];
  loadingScores: boolean;
  colors: {
    primary: string;
    grey: string;
  };
  isDark: boolean;
  formatDate: (dateString: string) => string;
}

export default function HighScoresSection({
  leaderboardEntries,
  loadingScores,
  colors,
  isDark,
  formatDate
}: HighScoresSectionProps) {
  return (
    <View className="mt-4 px-6">
      <LiquidGlassCard variant="primary">
        <View className="p-4">
          <View className="flex-row items-center mb-4">
            <Ionicons name="trophy" size={20} color={colors.primary} />
            <Text
              className="ml-2 font-semibold text-lg"
              style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.semibold }}>
              High Scores
            </Text>
          </View>

          {loadingScores ? (
            <View className="items-center py-8">
              <Text style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                Loading scores...
              </Text>
            </View>
          ) : leaderboardEntries.length > 0 ? (
            <View className="space-y-3">
              {leaderboardEntries.map((entry, index) => (
                <View key={entry.id} className="flex-row justify-between items-center py-2">
                  <View className="flex-1">
                    <Text
                      className="font-medium text-base"
                      style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.medium }}>
                      {entry.leaderboardId}
                    </Text>
                    <Text
                      className="text-sm"
                      style={{ color: isDark ? COLORS.textSecondary : COLORS.textTertiaryLight, ...TEXT_STYLES.regular }}>
                      {formatDate(entry.timestamp)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="trophy" size={14} color={COLORS.gold} />
                    <Text
                      className="ml-1 font-bold text-base"
                      style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.bold }}>
                      {entry.score.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-8">
              <Ionicons name="trophy-outline" size={48} color={colors.grey} />
              <Text
                className="mt-2 text-center"
                style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                No scores yet
              </Text>
            </View>
          )}
        </View>
      </LiquidGlassCard>
    </View>
  );
}