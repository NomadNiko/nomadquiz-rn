import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import LoadingSpinner from '../LoadingSpinner';

interface LoadingStateContainerProps {
  isLoading: boolean;
  size?: number;
  color?: string;
  backgroundColor?: string;
  fullScreen?: boolean;
  centered?: boolean;
  overlay?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const LoadingStateContainer: React.FC<LoadingStateContainerProps> = ({
  isLoading,
  size = 48,
  color,
  backgroundColor,
  fullScreen = false,
  centered = true,
  overlay = false,
  children,
  style,
}) => {
  // Use theme context if available, otherwise use provided colors directly
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const defaultColor = color || colors.primary;
  const defaultBackgroundColor = backgroundColor || colors.background;

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: overlay ? 'transparent' : defaultBackgroundColor,
    };

    if (fullScreen) {
      return {
        ...baseStyle,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
      };
    }

    if (centered) {
      return {
        ...baseStyle,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      };
    }

    return baseStyle;
  };

  if (!isLoading && !children) {
    return null;
  }

  if (!isLoading && children) {
    return <>{children}</>;
  }

  return (
    <View style={[getContainerStyle(), style]}>
      {overlay && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        />
      )}
      <LoadingSpinner size={size} color={defaultColor} />
    </View>
  );
};

export default LoadingStateContainer;
