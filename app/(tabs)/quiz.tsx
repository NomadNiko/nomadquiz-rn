import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMessagingStyles } from '../../hooks/useMessagingStyles';
import QuizLandingScreen from '../../components/quiz/QuizLandingScreen';

export default function QuizTab() {
  const { colors } = useMessagingStyles();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView edges={['top']} className="flex-1">
        <QuizLandingScreen />
      </SafeAreaView>
    </View>
  );
}