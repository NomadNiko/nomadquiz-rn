import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';

interface IconButtonProps {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
  variant?: 'rounded' | 'circular' | 'square';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  activeOpacity?: number;
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  iconName,
  iconSize,
  iconColor,
  backgroundColor,
  variant = 'rounded',
  size = 'medium',
  disabled = false,
  style,
  activeOpacity = 0.7,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          containerSize: 32,
          padding: 8,
          iconSize: iconSize || 16,
          borderRadius: variant === 'circular' ? 16 : 6,
        };
      case 'large':
        return {
          containerSize: 56,
          padding: 16,
          iconSize: iconSize || 28,
          borderRadius: variant === 'circular' ? 28 : 12,
        };
      default:
        return {
          containerSize: 44,
          padding: 12,
          iconSize: iconSize || 20,
          borderRadius: variant === 'circular' ? 22 : 8,
        };
    }
  };

  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    if (disabled) return colors.grey5;
    return colors.primary;
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;
    if (disabled) return colors.grey3;
    if (backgroundColor === colors.transparent || !backgroundColor) return colors.foreground;
    return colors.white;
  };

  const sizeConfig = getSizeConfig();
  const finalBackgroundColor = getBackgroundColor();
  const finalIconColor = getIconColor();

  const containerStyle: ViewStyle = {
    width: variant === 'square' ? undefined : sizeConfig.containerSize,
    height: sizeConfig.containerSize,
    padding: variant === 'square' ? sizeConfig.padding : undefined,
    borderRadius: variant === 'square' ? sizeConfig.borderRadius : sizeConfig.borderRadius,
    backgroundColor: finalBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[containerStyle, style]}
      activeOpacity={activeOpacity}>
      <Ionicons name={iconName} size={sizeConfig.iconSize} color={finalIconColor} />
    </TouchableOpacity>
  );
};

export default IconButton;
