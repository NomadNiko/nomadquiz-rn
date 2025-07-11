import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';
import { COLORS } from '../../theme/colors';
import LiquidGlassCard from '../ui/LiquidGlassCard';

interface LeaderboardCardProps {
  leaderboard: {
    leaderboardId: string;
    entryCount: number;
    topScore: number;
    top3Entries?: any[];
  };
  loadingTop3: boolean;
  colors: {
    grey: string;
    primary: string;
  };
  isDark: boolean;
  onPress: (leaderboard: any) => void;
}

export default function LeaderboardCard({
  leaderboard,
  loadingTop3,
  colors,
  isDark,
  onPress
}: LeaderboardCardProps) {
  return (
    <LiquidGlassCard key={leaderboard.leaderboardId} variant="secondary" className="mb-1">
      <TouchableOpacity 
        onPress={() => onPress(leaderboard)}
        className="p-4"
      >
        <View className="flex-row items-center mb-3">
          <View 
            className="mr-3 items-center justify-center rounded-full"
            style={{
              width: 40,
              height: 40,
              backgroundColor: COLORS.gold + '33'
            }}
          >
            <Ionicons name="trophy" size={20} color={COLORS.gold} />
          </View>
          <View className="flex-1">
            <Text 
              className="font-semibold text-base"
              style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.semibold }}
            >
              {leaderboard.leaderboardId}
            </Text>
            <Text 
              className="text-sm"
              style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', ...TEXT_STYLES.regular }}
            >
              {leaderboard.entryCount} participants • Top: {leaderboard.topScore}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.grey} />
        </View>
        
        {/* Top 3 Entries */}
        {loadingTop3 ? (
          <View className="items-center py-2">
            <Text style={{ color: colors.grey, ...TEXT_STYLES.regular, fontSize: 12 }}>
              Loading top entries...
            </Text>
          </View>
        ) : leaderboard.top3Entries && leaderboard.top3Entries.length > 0 ? (
          <View className="space-y-2">
            {leaderboard.top3Entries.map((entry: any, entryIndex: number) => (
              <View key={entry.id || entryIndex} className="flex-row items-center justify-between py-1">
                <View className="flex-row items-center flex-1">
                  <View 
                    className="mr-2 items-center justify-center rounded-full"
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: entryIndex === 0 ? COLORS.gold : entryIndex === 1 ? COLORS.silver : COLORS.bronze
                    }}
                  >
                    <Text
                      className="font-bold text-xs text-white"
                      style={TEXT_STYLES.bold}
                    >
                      {entryIndex + 1}
                    </Text>
                  </View>
                  <Text
                    className="font-medium text-sm flex-1"
                    style={{ color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)', ...TEXT_STYLES.medium }}
                    numberOfLines={1}
                  >
                    {entry.user?.username || 'Unknown Player'}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="trophy" size={12} color={COLORS.gold} />
                  <Text
                    className="ml-1 font-bold text-sm"
                    style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.bold }}
                  >
                    {entry.score.toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
            
            {leaderboard.entryCount > 3 && (
              <View className="items-center pt-1">
                <Text
                  className="text-xs"
                  style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', ...TEXT_STYLES.regular }}
                >
                  Tap to see all {leaderboard.entryCount} entries
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="items-center py-2">
            <Text style={{ color: colors.grey, ...TEXT_STYLES.regular, fontSize: 12 }}>
              No entries yet
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </LiquidGlassCard>
  );
}