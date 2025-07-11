import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMessagingStyles } from '../../hooks/useMessagingStyles';
import { TEXT_STYLES } from '../../theme/fonts';
import { COLORS } from '../../theme/colors';
import LiquidGlassCard from '../../components/ui/LiquidGlassCard';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function HomeTab() {
  const { colors, isDark } = useMessagingStyles();
  const { user } = useAuth();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="px-6 pb-4">
          <Text
            className="font-bold text-2xl"
            style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.bold }}>
            Welcome Back
          </Text>
          <Text 
            className="text-sm"
            style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)', ...TEXT_STYLES.regular }}
          >
            {user?.firstName ? `Hello ${user.firstName}!` : 'Good to see you!'}
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        >
          {/* Welcome Card */}
          <LiquidGlassCard variant="primary" className="mb-6">
            <View className="p-6 items-center">
              <Ionicons 
                name="chatbubbles" 
                size={64} 
                color={isDark ? COLORS.messagingPrimary : COLORS.messagingSecondary} 
                style={{ marginBottom: 16 }}
              />
              <Text
                className="font-bold text-xl mb-2 text-center"
                style={{ color: colors.foreground, ...TEXT_STYLES.bold }}>
                NomadQuiz
              </Text>
              <Text 
                className="text-center text-base"
                style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)', ...TEXT_STYLES.regular }}
              >
                Connect with friends, compete on leaderboards, and chat in real-time!
              </Text>
            </View>
          </LiquidGlassCard>

          {/* Quick Actions */}
          <Text 
            className="mb-4 font-semibold text-lg"
            style={{ color: isDark ? 'white' : 'black', ...TEXT_STYLES.semibold }}
          >
            Quick Actions
          </Text>

          <View className="space-y-1">
            <LiquidGlassCard variant="secondary" className="mb-1">
              <TouchableOpacity className="p-4" onPress={() => router.push('/conversations')}>
                <View className="flex-row items-center">
                  <View 
                    className="mr-3 items-center justify-center rounded-full"
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: isDark ? COLORS.messagingPrimary + '33' : COLORS.messagingSecondary + '33'
                    }}
                  >
                    <Ionicons name="chatbubbles" size={20} color={isDark ? COLORS.messagingPrimary : COLORS.messagingSecondary} />
                  </View>
                  <View className="flex-1">
                    <Text 
                      className="font-semibold"
                      style={{ color: colors.foreground, ...TEXT_STYLES.semibold }}
                    >
                      Messages
                    </Text>
                    <Text 
                      className="text-sm"
                      style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)', ...TEXT_STYLES.regular }}
                    >
                      Chat with friends and groups
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.grey2} />
                </View>
              </TouchableOpacity>
            </LiquidGlassCard>

            <LiquidGlassCard variant="secondary" className="mb-1">
              <TouchableOpacity className="p-4" onPress={() => router.push('/leaderboards')}>
                <View className="flex-row items-center">
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
                      className="font-semibold"
                      style={{ color: colors.foreground, ...TEXT_STYLES.semibold }}
                    >
                      Leaderboards
                    </Text>
                    <Text 
                      className="text-sm"
                      style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)', ...TEXT_STYLES.regular }}
                    >
                      View your high scores and rankings
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.grey2} />
                </View>
              </TouchableOpacity>
            </LiquidGlassCard>

            <LiquidGlassCard variant="secondary" className="mb-1">
              <TouchableOpacity className="p-4" onPress={() => router.push('/profile')}>
                <View className="flex-row items-center">
                  <View 
                    className="mr-3 items-center justify-center rounded-full"
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: colors.success + '33'
                    }}
                  >
                    <Ionicons name="person" size={20} color={colors.success} />
                  </View>
                  <View className="flex-1">
                    <Text 
                      className="font-semibold"
                      style={{ color: colors.foreground, ...TEXT_STYLES.semibold }}
                    >
                      Profile
                    </Text>
                    <Text 
                      className="text-sm"
                      style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)', ...TEXT_STYLES.regular }}
                    >
                      Manage your profile and settings
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.grey2} />
                </View>
              </TouchableOpacity>
            </LiquidGlassCard>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}