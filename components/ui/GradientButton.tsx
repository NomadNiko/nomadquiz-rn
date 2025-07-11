import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../LoadingSpinner';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'success' | 'info' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: keyof typeof Ionicons.glyphMap;
  style?: object;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  leftIcon,
  style,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const getGradientColors = () => {
    switch (variant) {
      case 'success':
        return colors.gradients.success;
      case 'info':
        return colors.gradients.info;
      case 'destructive':
        return colors.gradients.destructive;
      default:
        return colors.gradients.primary;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return { height: 36, fontSize: 14, paddingHorizontal: 16 };
      case 'large':
        return { height: 52, fontSize: 18, paddingHorizontal: 24 };
      default:
        return { height: 44, fontSize: 16, paddingHorizontal: 20 };
    }
  };

  const sizeConfig = getSize();
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        {
          borderRadius: 8,
          opacity: isDisabled ? 0.7 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}>
      <LinearGradient
        colors={getGradientColors()}
        style={{
          flex: 1,
          height: sizeConfig.height,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          flexDirection: 'row',
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        {isLoading ? (
          <LoadingSpinner size={20} color={COLORS.white} />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {leftIcon && (
              <Ionicons
                name={leftIcon}
                size={sizeConfig.fontSize}
                color={COLORS.white}
                style={{ marginRight: 8 }}
              />
            )}
            <Text
              style={{
                fontSize: sizeConfig.fontSize,
                fontWeight: '600',
                color: COLORS.white,
                ...TEXT_STYLES.semibold,
              }}>
              {title}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
