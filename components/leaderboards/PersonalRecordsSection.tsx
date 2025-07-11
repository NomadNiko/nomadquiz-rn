import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_STYLES } from '../../theme/fonts';
import LiquidGlassCard from '../ui/LiquidGlassCard';
import { LeaderboardEntry } from '../../services/leaderboardService';

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
  return (
    <>
      <Text 
        className="mb-4 font-semibold text-lg"
        style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.semibold }}
      >
        Your Best Scores
      </Text>

      <LiquidGlassCard variant="primary" className="mb-1">
        <View className="p-4">
          <View className="flex-row items-center mb-4">
            <Ionicons name="person-circle" size={24} color={colors.primary} />
            <Text
              className="ml-2 font-semibold text-lg"
              style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.semibold }}>
              Personal Records
            </Text>
          </View>
          
          {loadingPersonal ? (
            <View className="items-center py-4">
              <Text style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                Loading scores...
              </Text>
            </View>
          ) : personalRecords.length > 0 ? (
            <View className="space-y-3">
              {personalRecords.map((entry, index) => (
                <View key={entry.id} className="flex-row justify-between items-center py-2">
                  <View className="flex-1">
                    <Text
                      className="font-medium text-base"
                      style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.medium }}>
                      {entry.leaderboardId}
                    </Text>
                    <Text
                      className="text-sm"
                      style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', ...TEXT_STYLES.regular }}>
                      {formatDate(entry.timestamp)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="trophy" size={14} color="#FFD700" />
                    <Text
                      className="ml-1 font-bold text-base"
                      style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.bold }}>
                      {entry.score.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-4">
              <Text 
                className="text-center"
                style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)', ...TEXT_STYLES.regular }}
              >
                Complete quizzes to see your scores here
              </Text>
            </View>
          )}
        </View>
      </LiquidGlassCard>
    </>
  );
}