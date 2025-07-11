import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../theme/colors';
import { TEXT_STYLES } from '../theme/fonts';

interface AppLogoProps {
  width?: number;
  height?: number;
}

const AppLogo: React.FC<AppLogoProps> = ({ width = 160, height = 53 }) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: '700',
          color: colors.primary,
          ...TEXT_STYLES.bold,
        }}>
        NomadQuiz
      </Text>
    </View>
  );
};

export default AppLogo;