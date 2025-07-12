import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useMessagingStyles } from '../hooks/useMessagingStyles';
import LiquidGlassCard from '../components/ui/LiquidGlassCard';
import { QuizSession, QuizQuestion, quizService } from '../services/quizService';

const QuizGameScreen: React.FC = () => {
  const { colors, isDark } = useMessagingStyles();
  const params = useLocalSearchParams();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(10); // Will be set from session
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundLoadingAttempts, setBackgroundLoadingAttempts] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundLoadingRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize session from params
  useEffect(() => {
    try {
      if (params.sessionData && typeof params.sessionData === 'string') {
        const sessionData = JSON.parse(params.sessionData) as QuizSession;
        setSession(sessionData);
        setCurrentQuestion(sessionData.questions[0]);
        setTimeRemaining(sessionData.timePerQuestion); // Set initial time from session
        setIsLoading(false);
        
        // Start background loading if needed
        if (sessionData.isLoadingMoreQuestions) {
          console.log('🎮 Quiz started with partial questions, beginning background loading...');
          startBackgroundLoading(sessionData);
        }
      } else {
        throw new Error('Invalid session data');
      }
    } catch (error) {
      console.error('Error initializing quiz session:', error);
      Alert.alert('Error', 'Failed to initialize quiz. Returning to main page.');
      router.back();
    }
  }, [params.sessionData]);

  // Background loading function
  const startBackgroundLoading = async (currentSession: QuizSession) => {
    const maxAttempts = 10; // Keep trying until we get the questions
    let attempts = 0;
    
    const attemptBackgroundLoad = async () => {
      attempts++;
      console.log(`🔄 Background loading attempt ${attempts}/${maxAttempts}`);
      
      try {
        const remainingQuestions = await quizService.fetchRemainingQuestions(
          currentSession.difficulty, 
          currentSession.category
        );
        
        if (remainingQuestions.length > 0) {
          console.log(`✅ Background loading successful! Got ${remainingQuestions.length} more questions`);
          const updatedSession = quizService.updateSessionWithMoreQuestions(currentSession, remainingQuestions);
          setSession(updatedSession);
          setBackgroundLoadingAttempts(0);
          return;
        }
        
        // If no questions returned, schedule retry
        if (attempts < maxAttempts) {
          const delay = Math.min(3000 * attempts, 15000); // 3s, 6s, 9s, ... up to 15s
          console.log(`⏳ Background retry in ${delay}ms (attempt ${attempts}/${maxAttempts})`);
          setBackgroundLoadingAttempts(attempts);
          
          backgroundLoadingRef.current = setTimeout(() => {
            attemptBackgroundLoad();
          }, delay);
        } else {
          console.error('❌ Background loading failed after max attempts');
          setBackgroundLoadingAttempts(maxAttempts);
        }
      } catch (error) {
        console.error('❌ Background loading error:', error);
        
        // Retry on error
        if (attempts < maxAttempts) {
          const delay = Math.min(3000 * attempts, 15000);
          console.log(`⏳ Background retry after error in ${delay}ms`);
          setBackgroundLoadingAttempts(attempts);
          
          backgroundLoadingRef.current = setTimeout(() => {
            attemptBackgroundLoad();
          }, delay);
        }
      }
    };
    
    // Start first attempt after 2 seconds to let user start playing
    setTimeout(() => {
      attemptBackgroundLoad();
    }, 2000);
  };

  // Timer logic
  useEffect(() => {
    if (!isLoading && !isAnswered && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !isAnswered) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, isAnswered, isLoading]);

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Exit Quiz',
        'Are you sure you want to exit? Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: () => router.back() },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (backgroundLoadingRef.current) {
        clearTimeout(backgroundLoadingRef.current);
      }
    };
  }, []);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered || !currentQuestion || !session) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      const points = quizService.calculateScore(timeRemaining, session.difficulty);
      setSession(prev => prev ? { ...prev, score: prev.score + points } : null);
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const moveToNextQuestion = () => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;
    
    // Check if we've reached the expected total questions
    if (nextIndex >= session.expectedTotalQuestions) {
      // Quiz completed
      const result = quizService.completeQuizSession(session, correctAnswersCount);
      router.replace({
        pathname: '/quiz-results',
        params: {
          resultData: JSON.stringify(result),
        },
      });
      return;
    }
    
    // Check if we need to wait for more questions to load
    if (nextIndex >= session.questions.length) {
      if (session.isLoadingMoreQuestions) {
        // Show waiting screen - we'll handle this case
        console.log('⏳ Waiting for more questions to load...');
        // For now, just wait - in a real app you'd show a loading screen
        // The background loading will eventually update the session
        return;
      } else {
        // This shouldn't happen, but handle gracefully
        console.error('❌ No more questions available and not loading more');
        const result = quizService.completeQuizSession(session, correctAnswersCount);
        router.replace({
          pathname: '/quiz-results',
          params: {
            resultData: JSON.stringify(result),
          },
        });
        return;
      }
    }
    
    // Move to next question
    setSession(prev => prev ? { ...prev, currentQuestionIndex: nextIndex } : null);
    setCurrentQuestion(session.questions[nextIndex]);
    setTimeRemaining(session.timePerQuestion);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const getAnswerButtonVariant = (answer: string) => {
    if (!isAnswered) return 'default';
    
    if (answer === currentQuestion?.correctAnswer) {
      return 'success';
    } else if (answer === selectedAnswer && answer !== currentQuestion?.correctAnswer) {
      return 'destructive';
    }
    
    return 'default';
  };

  if (isLoading || !session || !currentQuestion) {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl" style={{ color: colors.foreground }}>
            Loading Quiz...
          </Text>
        </View>
      </View>
    );
  }

  const progress = ((session.currentQuestionIndex + 1) / session.expectedTotalQuestions) * 100;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Exit Quiz',
                'Are you sure you want to exit? Your progress will be lost.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Exit', style: 'destructive', onPress: () => router.back() },
                ]
              );
            }}>
            <Ionicons name="close" size={28} color={colors.foreground} />
          </TouchableOpacity>

          {/* Timer */}
          <View className="items-center">
            <Text
              className="text-3xl font-bold"
              style={{ 
                color: timeRemaining <= 3 ? COLORS.destructive : colors.foreground 
              }}>
              {timeRemaining}
            </Text>
            <Text
              className="text-sm"
              style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
              seconds
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text
              className="text-sm font-medium"
              style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
              Question {session.currentQuestionIndex + 1} of {session.expectedTotalQuestions}
              {session.isLoadingMoreQuestions && ' (Loading...)'}
            </Text>
            <Text
              className="text-sm font-medium"
              style={{ color: isDark ? COLORS.textPrimary : COLORS.textSecondaryLight }}>
              Score: {session.score}
            </Text>
          </View>
          <View
            className="h-2 rounded-full"
            style={{ backgroundColor: isDark ? COLORS.dark.grey5 : COLORS.light.grey5 }}>
            <View
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: COLORS.primary,
              }}
            />
          </View>
        </View>

        {/* Question */}
        <View className="mb-8">
          <LiquidGlassCard variant="primary" isDark={isDark}>
            <Text
              className="text-lg font-medium leading-6"
              style={{ color: colors.foreground }}>
              {currentQuestion.question}
            </Text>
          </LiquidGlassCard>
        </View>

        {/* Answer Buttons */}
        <View className="flex-1 space-y-3">
          {currentQuestion.answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerSelect(answer)}
              disabled={isAnswered}
              activeOpacity={0.8}
              className="mb-3">
              <LiquidGlassCard 
                variant={getAnswerButtonVariant(answer)} 
                isDark={isDark}
                style={{
                  opacity: isAnswered && answer !== currentQuestion.correctAnswer && answer !== selectedAnswer ? 0.5 : 1,
                }}>
                <View className="flex-row items-center">
                  <View className="mr-4">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: isDark ? COLORS.dark.grey5 : COLORS.light.grey5,
                      }}>
                      <Text
                        className="font-bold"
                        style={{ color: colors.foreground }}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className="flex-1 text-lg font-medium"
                    style={{ color: colors.foreground }}>
                    {answer}
                  </Text>
                  {isAnswered && answer === currentQuestion.correctAnswer && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                  )}
                  {isAnswered && answer === selectedAnswer && answer !== currentQuestion.correctAnswer && (
                    <Ionicons name="close-circle" size={24} color={COLORS.destructive} />
                  )}
                </View>
              </LiquidGlassCard>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default QuizGameScreen;