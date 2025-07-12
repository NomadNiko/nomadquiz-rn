import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { useMessagingStyles } from '../../hooks/useMessagingStyles';
import LiquidGlassCard from '../ui/LiquidGlassCard';
import LoadingSpinner from '../LoadingSpinner';
import { quizService, QuizDifficulty, QuizCategory } from '../../services/quizService';

interface DifficultyOption {
  difficulty: QuizDifficulty;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant: 'success' | 'primary' | 'destructive';
}

interface CategoryOption {
  category: QuizCategory;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant: 'default' | 'primary' | 'secondary';
}

const categoryOptions: CategoryOption[] = [
  { category: { id: null, name: 'pubquiz', displayName: 'PubQuiz' }, title: 'PubQuiz', description: 'All categories mixed together', icon: 'library', variant: 'primary' },
  { category: { id: 9, name: 'general', displayName: 'General' }, title: 'General Knowledge', description: 'A bit of everything', icon: 'bulb', variant: 'default' },
  { category: { id: 18, name: 'computers', displayName: 'Computers' }, title: 'Computers', description: 'Technology and computing', icon: 'laptop', variant: 'secondary' },
  { category: { id: 20, name: 'mythology', displayName: 'Mythology' }, title: 'Mythology', description: 'Gods, legends, and myths', icon: 'flash', variant: 'default' },
  { category: { id: 23, name: 'history', displayName: 'History' }, title: 'History', description: 'Past events and civilizations', icon: 'time', variant: 'secondary' },
  { category: { id: 29, name: 'comics', displayName: 'Comics' }, title: 'Comics', description: 'Superheroes and comic books', icon: 'star', variant: 'default' },
  { category: { id: 30, name: 'gadgets', displayName: 'Gadgets' }, title: 'Gadgets', description: 'Science and technology', icon: 'hardware-chip', variant: 'secondary' },
  { category: { id: 32, name: 'toons', displayName: 'Toons' }, title: 'Cartoons & Animations', description: 'Animated shows and movies', icon: 'happy', variant: 'default' },
];

const difficultyOptions: DifficultyOption[] = [
  {
    difficulty: 'easy',
    title: 'Easy',
    icon: 'sunny',
    variant: 'success',
  },
  {
    difficulty: 'medium',
    title: 'Medium',
    icon: 'partly-sunny',
    variant: 'primary',
  },
  {
    difficulty: 'hard',
    title: 'Hard',
    icon: 'thunderstorm',
    variant: 'destructive',
  },
];

const QuizLandingScreen: React.FC = () => {
  const { colors, isDark } = useMessagingStyles();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty | null>(null);
  const [currentStep, setCurrentStep] = useState<'category' | 'difficulty'>('category');

  const handleCategorySelect = (category: QuizCategory) => {
    setSelectedCategory(category);
    setCurrentStep('difficulty');
  };

  const handleDifficultySelect = async (difficulty: QuizDifficulty) => {
    if (!selectedCategory) return;
    
    try {
      setLoading(true);
      setSelectedDifficulty(difficulty);

      // Fetch initial questions from Open Trivia DB with category
      const questions = await quizService.fetchInitialQuestions(difficulty, selectedCategory);
      
      if (questions.length === 0) {
        Alert.alert('Error', 'No questions available for this category and difficulty. Please try again.');
        return;
      }

      // Create quiz session with initial questions
      const session = quizService.createQuizSession(difficulty, selectedCategory, questions);

      // Navigate to quiz game screen with session data
      router.push({
        pathname: '/quiz-game',
        params: {
          sessionData: JSON.stringify(session),
        },
      });
    } catch (error) {
      console.error('Error starting quiz:', error);
      Alert.alert(
        'Error',
        'Failed to load quiz questions. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
      setSelectedDifficulty(null);
    }
  };

  const handleBackToCategories = () => {
    setCurrentStep('category');
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingSpinner size="large" />
        <Text
          className="mt-4 text-lg font-medium"
          style={{ color: colors.foreground }}>
          Loading {selectedCategory?.displayName} {selectedDifficulty} questions...
        </Text>
      </View>
    );
  }

  // Category Selection Screen
  if (currentStep === 'category') {
    return (
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="mb-4 mt-4">
          <Text
            className="text-center text-4xl font-bold mb-2"
            style={{ color: colors.foreground }}>
            Choose Category
          </Text>
          <Text
            className="text-center text-lg"
            style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
            Pick your quiz topic
          </Text>
        </View>

        {/* Category Selection */}
        <View className="flex-1 space-y-3">
          {categoryOptions.map((option) => (
            <TouchableOpacity
              key={option.category.name}
              onPress={() => handleCategorySelect(option.category)}
              activeOpacity={0.8}
              className="mb-3">
              <LiquidGlassCard variant={option.variant} isDark={isDark}>
                <View className="flex-row items-center">
                  <View className="mr-4">
                    <Ionicons
                      name={option.icon}
                      size={32}
                      color={colors.foreground}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-xl font-bold mb-1"
                      style={{ color: colors.foreground }}>
                      {option.title}
                    </Text>
                    <Text
                      className="text-sm"
                      style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
                      {option.description}
                    </Text>
                  </View>
                  <View className="ml-4">
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={isDark ? COLORS.textSecondary : COLORS.textSecondaryLight}
                    />
                  </View>
                </View>
              </LiquidGlassCard>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // Difficulty Selection Screen
  return (
    <View className="flex-1 px-6">
      {/* Header with Back Button */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={handleBackToCategories} className="mr-4">
            <Ionicons name="chevron-back" size={28} color={colors.foreground} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text
              className="text-center text-3xl font-bold"
              style={{ color: colors.foreground }}>
              {selectedCategory?.displayName}
            </Text>
            <Text
              className="text-center text-lg"
              style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
              Choose difficulty level
            </Text>
          </View>
          <View className="w-7" />
        </View>
      </View>

      {/* Difficulty Selection */}
      <View className="flex-1 justify-center space-y-4" style={{ marginTop: -150 }}>
        {difficultyOptions.map((option) => (
          <TouchableOpacity
            key={option.difficulty}
            onPress={() => handleDifficultySelect(option.difficulty)}
            activeOpacity={0.8}
            className="mb-4">
            <LiquidGlassCard variant={option.variant} isDark={isDark}>
              <View className="flex-row items-center justify-center py-6">
                <View className="mr-6">
                  <Ionicons
                    name={option.icon}
                    size={48}
                    color={colors.foreground}
                  />
                </View>
                <Text
                  className="text-4xl font-bold"
                  style={{ color: colors.foreground }}>
                  {option.title}
                </Text>
              </View>
            </LiquidGlassCard>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
};

export default QuizLandingScreen;