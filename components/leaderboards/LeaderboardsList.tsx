import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';
import { COLORS } from '../../theme/colors';
import LiquidGlassCard from '../ui/LiquidGlassCard';
import LeaderboardCard from './LeaderboardCard';
import { quizService } from '../../services/quizService';

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
  const [selectedDifficulties, setSelectedDifficulties] = useState<Record<string, 'Hard' | 'Medium' | 'Easy'>>({});
  
  // Helper function to parse category and difficulty from leaderboard ID
  const parseLeaderboardId = (leaderboardId: string) => {
    const parts = leaderboardId.split('-');
    if (parts.length === 2) {
      const categoryName = parts[0];
      const difficulty = parts[1];
      const category = quizService.CATEGORIES.find(cat => cat.name === categoryName);
      return {
        category: category?.displayName || categoryName,
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        categoryName: categoryName
      };
    }
    return { category: leaderboardId, difficulty: '', categoryName: leaderboardId };
  };

  // Group leaderboards by category
  const groupedLeaderboards = leaderboardsWithEntries.reduce((groups, leaderboard) => {
    const { category, categoryName } = parseLeaderboardId(leaderboard.leaderboardId);
    if (!groups[category]) {
      groups[category] = { categoryName, leaderboards: [] };
    }
    groups[category].leaderboards.push(leaderboard);
    return groups;
  }, {} as Record<string, { categoryName: string; leaderboards: any[] }>);

  // Sort leaderboards within each category by difficulty (Hard, Medium, Easy)
  Object.values(groupedLeaderboards).forEach(group => {
    group.leaderboards.sort((a, b) => {
      const difficultyOrder = { 'hard': 0, 'medium': 1, 'easy': 2 };
      const aDiff = parseLeaderboardId(a.leaderboardId).difficulty.toLowerCase();
      const bDiff = parseLeaderboardId(b.leaderboardId).difficulty.toLowerCase();
      return (difficultyOrder[aDiff as keyof typeof difficultyOrder] || 3) - 
             (difficultyOrder[bDiff as keyof typeof difficultyOrder] || 3);
    });
  });

  // Get selected difficulty for a category (default to Hard)
  const getSelectedDifficulty = (categoryName: string) => {
    return selectedDifficulties[categoryName] || 'Hard';
  };

  // Set selected difficulty for a category
  const setSelectedDifficulty = (categoryName: string, difficulty: 'Hard' | 'Medium' | 'Easy') => {
    setSelectedDifficulties(prev => ({
      ...prev,
      [categoryName]: difficulty
    }));
  };

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
        <View className="space-y-4">
          {Object.entries(groupedLeaderboards).map(([categoryDisplayName, group]) => {
            const selectedDiff = getSelectedDifficulty(categoryDisplayName);
            const selectedLeaderboard = group.leaderboards.find(lb => {
              const { difficulty } = parseLeaderboardId(lb.leaderboardId);
              return difficulty === selectedDiff;
            });
            
            return (
              <LiquidGlassCard key={categoryDisplayName} variant="secondary" className="mb-1">
                <View className="p-4">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="trophy" size={20} color={colors.primary} />
                    <Text
                      className="ml-2 font-semibold text-base"
                      style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.semibold }}>
                      {categoryDisplayName}
                    </Text>
                  </View>
                  
                  {/* Difficulty Toggle Buttons */}
                  <View className="flex-row mb-4">
                    {['Hard', 'Medium', 'Easy'].map((difficultyLevel, index) => {
                      const isSelected = selectedDiff === difficultyLevel;
                      const hasLeaderboard = group.leaderboards.some(lb => {
                        const { difficulty } = parseLeaderboardId(lb.leaderboardId);
                        return difficulty === difficultyLevel;
                      });
                      
                      return (
                        <TouchableOpacity
                          key={difficultyLevel}
                          onPress={() => setSelectedDifficulty(categoryDisplayName, difficultyLevel as 'Hard' | 'Medium' | 'Easy')}
                          activeOpacity={0.8}
                          className={`flex-1 py-2 px-4 rounded-lg ${index === 0 ? 'mr-1' : index === 2 ? 'ml-1' : 'mx-1'}`}
                          style={{
                            backgroundColor: isSelected 
                              ? colors.primary 
                              : isDark ? COLORS.dark.grey5 : COLORS.light.grey5,
                            opacity: hasLeaderboard ? 1 : 0.5
                          }}
                          disabled={!hasLeaderboard}
                        >
                          <Text
                            className="text-center font-medium text-sm"
                            style={{ 
                              color: isSelected 
                                ? COLORS.white 
                                : isDark ? COLORS.white : COLORS.black,
                              ...TEXT_STYLES.medium 
                            }}>
                            {difficultyLevel}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  
                  {/* Selected Difficulty Leaderboard */}
                  {selectedLeaderboard ? (
                    <TouchableOpacity
                      onPress={() => onLeaderboardPress(selectedLeaderboard)}
                      activeOpacity={0.8}>
                      <LiquidGlassCard variant="default" isDark={isDark}>
                        <View className="p-4">
                          {loadingTop3 ? (
                            <View className="items-center py-4">
                              <Text 
                                className="text-sm"
                                style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                                Loading...
                              </Text>
                            </View>
                          ) : selectedLeaderboard.top3Entries && selectedLeaderboard.top3Entries.length > 0 ? (
                            <View className="space-y-3">
                              {selectedLeaderboard.top3Entries.slice(0, 3).map((entry: any, index: number) => (
                                <View key={entry.id} className="flex-row items-center justify-between py-2">
                                  <View className="flex-row items-center flex-1">
                                    <View 
                                      className="mr-3 items-center justify-center rounded-full"
                                      style={{
                                        width: 24,
                                        height: 24,
                                        backgroundColor: index === 0 ? COLORS.gold : index === 1 ? COLORS.silver : COLORS.bronze
                                      }}
                                    >
                                      <Text
                                        className="font-bold text-xs"
                                        style={{ color: COLORS.white, ...TEXT_STYLES.bold }}>
                                        {index + 1}
                                      </Text>
                                    </View>
                                    <Text
                                      className="text-base flex-1"
                                      style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.regular }}
                                      numberOfLines={1}>
                                      {entry.user?.username || 'Anonymous'}
                                    </Text>
                                  </View>
                                  <View className="flex-row items-center">
                                    <Ionicons name="trophy" size={16} color={COLORS.gold} />
                                    <Text
                                      className="ml-2 font-bold text-base"
                                      style={{ color: isDark ? COLORS.white : COLORS.black, ...TEXT_STYLES.bold }}>
                                      {entry.score?.toLocaleString() || '0'}
                                    </Text>
                                  </View>
                                </View>
                              ))}
                              <View className="items-center pt-2 mt-2 border-t" style={{ borderTopColor: colors.grey + '30' }}>
                                <Text
                                  className="text-sm"
                                  style={{ color: isDark ? COLORS.textSecondary : COLORS.textTertiaryLight, ...TEXT_STYLES.regular }}>
                                  Tap to see full leaderboard
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <View className="items-center py-4">
                              <Ionicons name="trophy-outline" size={32} color={colors.grey} />
                              <Text 
                                className="text-sm text-center mt-2"
                                style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                                No scores yet for {selectedDiff}
                              </Text>
                            </View>
                          )}
                        </View>
                      </LiquidGlassCard>
                    </TouchableOpacity>
                  ) : (
                    <LiquidGlassCard variant="default" isDark={isDark}>
                      <View className="p-4">
                        <View className="items-center py-4">
                          <Ionicons name="trophy-outline" size={32} color={colors.grey} />
                          <Text 
                            className="text-sm text-center mt-2"
                            style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                            No {selectedDiff} leaderboard yet
                          </Text>
                        </View>
                      </View>
                    </LiquidGlassCard>
                  )}
                </View>
              </LiquidGlassCard>
            );
          })}
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