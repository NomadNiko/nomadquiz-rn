import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';
import { COLORS } from '../../theme/colors';
import LiquidGlassCard from '../ui/LiquidGlassCard';
import { LeaderboardEntry } from '../../services/leaderboardService';
import { quizService } from '../../services/quizService';

interface PersonalRecordsSectionProps {
  personalRecords: LeaderboardEntry[];
  loadingPersonal: boolean;
  colors: {
    primary: string;
    grey: string;
  };
  isDark: boolean;
  formatDate: (dateString: string) => string;
}

export default function PersonalRecordsSection({
  personalRecords,
  loadingPersonal,
  colors,
  isDark,
  formatDate
}: PersonalRecordsSectionProps) {
  
  // Helper function to parse category and difficulty from leaderboard ID
  const parseLeaderboardId = (leaderboardId: string) => {
    const parts = leaderboardId.split('-');
    if (parts.length === 2) {
      const categoryName = parts[0];
      const difficulty = parts[1];
      const category = quizService.CATEGORIES.find(cat => cat.name === categoryName);
      return {
        category: category?.displayName || categoryName,
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
      };
    }
    return { category: leaderboardId, difficulty: '' };
  };

  // Group records by category
  const groupedRecords = personalRecords.reduce((groups, entry) => {
    const { category } = parseLeaderboardId(entry.leaderboardId);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(entry);
    return groups;
  }, {} as Record<string, LeaderboardEntry[]>);

  return (
    <>
      <Text 
        className="mb-4 font-semibold text-lg"
        style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.semibold }}
      >
        Your Best Scores
      </Text>

      {loadingPersonal ? (
        <LiquidGlassCard variant="primary" className="mb-6">
          <View className="p-4">
            <View className="items-center py-4">
              <Text style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                Loading scores...
              </Text>
            </View>
          </View>
        </LiquidGlassCard>
      ) : personalRecords.length > 0 ? (
        <View className="mb-6">
          {Object.entries(groupedRecords).map(([categoryName, entries]) => (
            <LiquidGlassCard key={categoryName} variant="primary" className="mb-3">
              <View className="p-4">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="person-circle" size={20} color={colors.primary} />
                  <Text
                    className="ml-2 font-semibold text-base"
                    style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.semibold }}>
                    {categoryName}
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  {['Hard', 'Medium', 'Easy'].map(difficultyLevel => {
                    const entry = entries.find(e => {
                      const { difficulty } = parseLeaderboardId(e.leaderboardId);
                      return difficulty === difficultyLevel;
                    });
                    
                    return (
                      <View key={difficultyLevel} className="flex-1 items-center">
                        <Text
                          className="font-medium text-sm mb-1"
                          style={{ color: isDark ? COLORS.textSecondary : COLORS.textTertiaryLight, ...TEXT_STYLES.medium }}>
                          {difficultyLevel}
                        </Text>
                        {entry ? (
                          <View className="items-center">
                            <View className="flex-row items-center">
                              <Ionicons name="trophy" size={12} color={COLORS.gold} />
                              <Text
                                className="ml-1 font-bold text-sm"
                                style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.bold }}>
                                {entry.score.toLocaleString()}
                              </Text>
                            </View>
                            <Text
                              className="text-xs mt-1"
                              style={{ color: isDark ? COLORS.textSecondary : COLORS.textTertiaryLight, ...TEXT_STYLES.regular }}>
                              {formatDate(entry.timestamp)}
                            </Text>
                          </View>
                        ) : (
                          <Text
                            className="text-xs"
                            style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                            No score
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            </LiquidGlassCard>
          ))}
        </View>
      ) : (
        <LiquidGlassCard variant="primary" className="mb-6">
          <View className="p-4">
            <View className="flex-row items-center mb-4">
              <Ionicons name="person-circle" size={24} color={colors.primary} />
              <Text
                className="ml-2 font-semibold text-lg"
                style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.semibold }}>
                Personal Records
              </Text>
            </View>
            <View className="items-center py-4">
              <Text 
                className="text-center"
                style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight, ...TEXT_STYLES.regular }}
              >
                Complete quizzes to see your scores here
              </Text>
            </View>
          </View>
        </LiquidGlassCard>
      )}
    </>
  );
}