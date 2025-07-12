import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../theme/colors';
import { useMessagingStyles } from '../hooks/useMessagingStyles';
import LiquidGlassCard from '../components/ui/LiquidGlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import authService from '../services/authService';
import { QuizResult, quizService } from '../services/quizService';

const QuizResultsScreen: React.FC = () => {
  const { colors, isDark } = useMessagingStyles();
  const { isAuthenticated } = useAuth();
  const params = useLocalSearchParams();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize result from params
  useEffect(() => {
    try {
      if (params.resultData && typeof params.resultData === 'string') {
        const resultData = JSON.parse(params.resultData) as QuizResult;
        setResult(resultData);
      } else {
        throw new Error('Invalid result data');
      }
    } catch (error) {
      console.error('Error initializing quiz results:', error);
      Alert.alert('Error', 'Failed to load quiz results. Returning to main page.');
      router.replace('/quiz');
    }
  }, [params.resultData]);

  // Auto-submit score if authenticated
  useEffect(() => {
    if (result && isAuthenticated && !isSubmitted && !isSubmitting) {
      handleSubmitScore();
    }
  }, [result, isAuthenticated]);

  const handleSubmitScore = async () => {
    if (!result || !isAuthenticated || isSubmitted) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Get current user info to get username
      const currentUser = await authService.getCurrentUser();
      console.log('Current user data:', currentUser);
      
      if (!currentUser?.username) {
        throw new Error('Username not found. Please log in again.');
      }

      // Validate username meets backend requirements (3-20 chars)
      if (currentUser.username.length < 3 || currentUser.username.length > 20) {
        throw new Error('Username does not meet requirements (3-20 characters)');
      }

      console.log('Submitting quiz score:', {
        difficulty: result.difficulty,
        score: result.totalScore,
        username: currentUser.username
      });

      await quizService.submitQuizScore(token, result, currentUser.username);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting score:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit score');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    router.replace('/quiz');
  };

  const handleViewLeaderboard = () => {
    router.replace('/leaderboards');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return COLORS.success;
      case 'medium':
        return COLORS.primary;
      case 'hard':
        return COLORS.destructive;
      default:
        return colors.foreground;
    }
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: 'Outstanding!', icon: 'trophy' as const };
    if (percentage >= 70) return { message: 'Great job!', icon: 'ribbon' as const };
    if (percentage >= 50) return { message: 'Good effort!', icon: 'thumbs-up' as const };
    return { message: 'Keep practicing!', icon: 'school' as const };
  };

  if (!result) {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" />
          <Text className="mt-4 text-lg" style={{ color: colors.foreground }}>
            Loading Results...
          </Text>
        </View>
      </View>
    );
  }

  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const performance = getPerformanceMessage(percentage);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-1 px-6 pt-32 pb-8">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="mb-4">
            <Ionicons
              name={performance.icon}
              size={80}
              color={getDifficultyColor(result.difficulty)}
            />
          </View>
          <Text
            className="text-3xl font-bold mb-2"
            style={{ color: colors.foreground }}>
            Quiz Complete!
          </Text>
          <Text
            className="text-xl font-medium"
            style={{ color: getDifficultyColor(result.difficulty) }}>
            {performance.message}
          </Text>
        </View>

        {/* Results Cards */}
        <View className="mb-8 space-y-4">
          {/* Score Card */}
          <LiquidGlassCard variant="primary" isDark={isDark}>
            <View className="items-center">
              <Text
                className="text-lg font-medium mb-2"
                style={{ color: colors.foreground }}>
                Final Score
              </Text>
              <Text
                className="text-4xl font-bold"
                style={{ color: colors.foreground }}>
                {result.totalScore}
              </Text>
              <Text
                className="text-sm mt-1"
                style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
                points
              </Text>
            </View>
          </LiquidGlassCard>

          {/* Stats Card */}
          <LiquidGlassCard variant="default" isDark={isDark}>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-base"
                  style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
                  Difficulty
                </Text>
                <Text
                  className="font-bold capitalize"
                  style={{ color: getDifficultyColor(result.difficulty) }}>
                  {result.difficulty}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-base"
                  style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
                  Correct Answers
                </Text>
                <Text
                  className="font-bold"
                  style={{ color: colors.foreground }}>
                  {result.correctAnswers} / {result.totalQuestions}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-base"
                  style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
                  Accuracy
                </Text>
                <Text
                  className="font-bold"
                  style={{ color: colors.foreground }}>
                  {percentage}%
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-base"
                  style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
                  Avg. Time
                </Text>
                <Text
                  className="font-bold"
                  style={{ color: colors.foreground }}>
                  {result.averageTimePerQuestion.toFixed(1)}s
                </Text>
              </View>
            </View>
          </LiquidGlassCard>

          {/* Submission Status */}
          {isAuthenticated && (
            <LiquidGlassCard 
              variant={isSubmitted ? 'success' : isSubmitting ? 'default' : 'destructive'} 
              isDark={isDark}>
              <View className="flex-row items-center">
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="small" />
                    <Text
                      className="ml-3 font-medium"
                      style={{ color: colors.foreground }}>
                      Submitting to leaderboard...
                    </Text>
                  </>
                ) : isSubmitted ? (
                  <>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                    <Text
                      className="ml-3 font-medium"
                      style={{ color: colors.foreground }}>
                      Score submitted to leaderboard!
                    </Text>
                  </>
                ) : submitError ? (
                  <>
                    <Ionicons name="warning" size={24} color={COLORS.destructive} />
                    <View className="ml-3 flex-1">
                      <Text
                        className="font-medium"
                        style={{ color: colors.foreground }}>
                        Failed to submit score
                      </Text>
                      <Text
                        className="text-sm mt-1"
                        style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
                        {submitError}
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>
            </LiquidGlassCard>
          )}
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity onPress={handleTryAgain} activeOpacity={0.8}>
            <LiquidGlassCard variant="primary" isDark={isDark}>
              <View className="flex-row items-center justify-center py-2">
                <Ionicons name="refresh" size={24} color={colors.foreground} />
                <Text
                  className="ml-3 text-lg font-bold"
                  style={{ color: colors.foreground }}>
                  Try Again
                </Text>
              </View>
            </LiquidGlassCard>
          </TouchableOpacity>

          {isSubmitted && (
            <TouchableOpacity onPress={handleViewLeaderboard} activeOpacity={0.8}>
              <LiquidGlassCard variant="success" isDark={isDark}>
                <View className="flex-row items-center justify-center py-2">
                  <Ionicons name="trophy" size={24} color={colors.foreground} />
                  <Text
                    className="ml-3 text-lg font-bold"
                    style={{ color: colors.foreground }}>
                    View Leaderboard
                  </Text>
                </View>
              </LiquidGlassCard>
            </TouchableOpacity>
          )}

          {submitError && !isSubmitted && isAuthenticated && (
            <TouchableOpacity onPress={handleSubmitScore} activeOpacity={0.8}>
              <LiquidGlassCard variant="default" isDark={isDark}>
                <View className="flex-row items-center justify-center py-2">
                  <Ionicons name="cloud-upload" size={24} color={colors.foreground} />
                  <Text
                    className="ml-3 text-lg font-bold"
                    style={{ color: colors.foreground }}>
                    Retry Submission
                  </Text>
                </View>
              </LiquidGlassCard>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default QuizResultsScreen;