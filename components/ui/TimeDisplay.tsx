import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';
import { formatTime, formatMessageTime } from '../../utils/dateUtils';

interface TimeDisplayProps {
  timestamp: string;
  variant?: 'bubble' | 'card' | 'gap' | 'inline';
  isDark?: boolean;
  size?: 'small' | 'medium';
  style?: object;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  timestamp,
  variant = 'inline',
  isDark: propIsDark,
  size = 'small',
  style,
}) => {
  const { isDark: contextIsDark } = useTheme();
  const isDark = propIsDark !== undefined ? propIsDark : contextIsDark;
  const colors = isDark ? COLORS.dark : COLORS.light;

  const getFormattedTime = () => {
    switch (variant) {
      case 'bubble':
      case 'gap':
        return formatMessageTime(timestamp);
      case 'card':
      case 'inline':
      default:
        return formatTime(timestamp);
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      ...TEXT_STYLES.regular,
    };

    switch (variant) {
      case 'bubble':
        return {
          ...baseStyle,
          fontSize: 10,
          color: colors.status.messageIcon,
        };
      case 'gap':
        return {
          ...baseStyle,
          fontSize: 12,
          fontWeight: '500' as const,
          color: colors.grey2,
          ...TEXT_STYLES.medium,
        };
      case 'card':
        return {
          ...baseStyle,
          fontSize: size === 'small' ? 12 : 14,
          fontWeight: '500' as const,
          color: colors.grey2,
          ...TEXT_STYLES.medium,
        };
      case 'inline':
      default:
        return {
          ...baseStyle,
          fontSize: size === 'small' ? 12 : 14,
          color: colors.grey2,
        };
    }
  };

  const getContainerStyle = () => {
    switch (variant) {
      case 'gap':
        return {
          backgroundColor: colors.grey5,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 8,
          alignItems: 'center' as const,
        };
      case 'bubble':
      case 'card':
      case 'inline':
      default:
        return {};
    }
  };

  const formattedTime = getFormattedTime();

  if (!formattedTime) return null;

  return (
    <View style={[getContainerStyle(), style]}>
      <Text style={getTextStyle()}>{formattedTime}</Text>
    </View>
  );
};

export default TimeDisplay;
