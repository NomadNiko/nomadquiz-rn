import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';
import LiquidGlassCard from '../ui/LiquidGlassCard';
import LeaderboardCard from './LeaderboardCard';

interface LeaderboardsListProps {
  leaderboardsWithEntries: any[];
  loading: boolean;
  loadingTop3: boolean;
  colors: {
    grey: string;
    primary: string;
  };
  isDark: boolean;
  onLeaderboardPress: (leaderboard: any) => void;
}

export default function LeaderboardsList({
  leaderboardsWithEntries,
  loading,
  loadingTop3,
  colors,
  isDark,
  onLeaderboardPress
}: LeaderboardsListProps) {
  return (
    <>
      <Text 
        className="mb-4 font-semibold text-lg"
        style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.semibold }}
      >
        Global Leaderboards
      </Text>

      {loading ? (
        <LiquidGlassCard variant="secondary">
          <View className="p-8 items-center">
            <Text style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
              Loading leaderboards...
            </Text>
          </View>
        </LiquidGlassCard>
      ) : leaderboardsWithEntries.length > 0 ? (
        <View className="space-y-1">
          {leaderboardsWithEntries.map((leaderboard, index) => (
            <LeaderboardCard
              key={leaderboard.leaderboardId || index}
              leaderboard={leaderboard}
              loadingTop3={loadingTop3}
              colors={colors}
              isDark={isDark}
              onPress={onLeaderboardPress}
            />
          ))}
        </View>
      ) : (
        <LiquidGlassCard variant="secondary">
          <View className="p-8 items-center">
            <Ionicons name="trophy-outline" size={64} color={colors.grey} />
            <Text
              className="mt-4 font-semibold text-lg text-center"
              style={{ color: colors.grey, ...TEXT_STYLES.semibold }}>
              No Leaderboards Yet
            </Text>
            <Text 
              className="mt-2 text-center"
              style={{ color: colors.grey, ...TEXT_STYLES.regular }}
            >
              Be the first to submit a score and create a leaderboard!
            </Text>
          </View>
        </LiquidGlassCard>
      )}
    </>
  );
}