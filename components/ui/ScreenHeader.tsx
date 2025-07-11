import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  containerStyle?: object;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  rightElement,
  showBackButton,
  onBackPress,
  containerStyle,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  return (
    <SafeAreaView edges={['top']}>
      <View className="flex-row items-center justify-between px-6 pb-4" style={containerStyle}>
        <View className="flex-1 flex-row items-center">
          {showBackButton && (
            <TouchableOpacity
              onPress={onBackPress}
              className="-ml-2 mr-4 p-2"
              style={{ marginRight: 16 }}>
              <Ionicons name="chevron-back" size={24} color={colors.foreground} />
            </TouchableOpacity>
          )}

          <View className="flex-1">
            <Text
              className="font-bold text-2xl"
              style={{ color: colors.foreground, ...TEXT_STYLES.bold }}>
              {title}
            </Text>
            {subtitle && (
              <Text className="text-sm" style={{ color: colors.grey, ...TEXT_STYLES.regular }}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {rightElement && <View className="ml-4">{rightElement}</View>}
      </View>
    </SafeAreaView>
  );
};

export default ScreenHeader;
