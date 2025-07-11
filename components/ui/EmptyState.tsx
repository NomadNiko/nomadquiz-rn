import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
  variant?: 'default' | 'error';
  containerStyle?: object;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onActionPress,
  variant = 'default',
  containerStyle,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const getIconColor = () => {
    switch (variant) {
      case 'error':
        return colors.destructive;
      default:
        return colors.grey2;
    }
  };

  const getTitleColor = () => {
    switch (variant) {
      case 'error':
        return colors.destructive;
      default:
        return colors.foreground;
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-6" style={containerStyle}>
      <Ionicons name={icon} size={64} color={getIconColor()} />

      <Text
        className="mt-4 text-center font-semibold text-lg"
        style={{
          color: getTitleColor(),
          ...TEXT_STYLES.semibold,
        }}>
        {title}
      </Text>

      <Text
        className="mt-2 text-center"
        style={{
          color: colors.grey2,
          ...TEXT_STYLES.regular,
        }}>
        {description}
      </Text>

      {actionLabel && onActionPress && (
        <TouchableOpacity
          className="mt-6 rounded-lg px-6 py-3"
          style={{ backgroundColor: colors.primary }}
          onPress={onActionPress}>
          <Text
            style={{
              color: colors.white,
              fontWeight: '600',
              textAlign: 'center',
              ...TEXT_STYLES.semibold,
            }}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
