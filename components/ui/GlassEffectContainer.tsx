import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';

interface GlassEffectContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'destructive' | 'success' | 'focused';
  isDark: boolean;
  focused?: boolean;
  borderRadius?: number;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  disableGloss?: boolean;
  disableLens?: boolean;
}

const GlassEffectContainer: React.FC<GlassEffectContainerProps> = ({
  children,
  variant = 'default',
  isDark,
  focused = false,
  borderRadius = 12,
  style,
  contentStyle,
  disableGloss = false,
  disableLens = false,
}) => {
  const getVariantColors = () => {
    const baseColors = {
      default: {
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.20)',
        border: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)',
        gradient: isDark
          ? ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)', 'transparent']
          : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'transparent'],
        lens: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
      },
      primary: {
        background: isDark ? 'rgba(30, 58, 138, 0.15)' : 'rgba(30, 58, 138, 0.08)',
        border: isDark ? 'rgba(30, 58, 138, 0.4)' : 'rgba(30, 58, 138, 0.3)',
        gradient: isDark
          ? ['rgba(30, 58, 138, 0.4)', 'rgba(30, 58, 138, 0.15)', 'transparent']
          : ['rgba(30, 58, 138, 0.3)', 'rgba(30, 58, 138, 0.08)', 'transparent'],
        lens: isDark ? 'rgba(30, 58, 138, 0.08)' : 'rgba(30, 58, 138, 0.04)',
      },
      destructive: {
        background: isDark ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.08)',
        border: isDark ? 'rgba(220, 38, 38, 0.4)' : 'rgba(220, 38, 38, 0.3)',
        gradient: isDark
          ? ['rgba(220, 38, 38, 0.4)', 'rgba(220, 38, 38, 0.15)', 'transparent']
          : ['rgba(220, 38, 38, 0.3)', 'rgba(220, 38, 38, 0.08)', 'transparent'],
        lens: isDark ? 'rgba(220, 38, 38, 0.08)' : 'rgba(220, 38, 38, 0.04)',
      },
      success: {
        background: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)',
        border: isDark ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)',
        gradient: isDark
          ? ['rgba(34, 197, 94, 0.4)', 'rgba(34, 197, 94, 0.15)', 'transparent']
          : ['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.08)', 'transparent'],
        lens: isDark ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.04)',
      },
      focused: {
        background: 'transparent',
        border: 'transparent',
        gradient: focused
          ? isDark
            ? ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'transparent']
            : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.2)', 'transparent']
          : isDark
            ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)', 'transparent']
            : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'transparent'],
        lens: focused
          ? isDark
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(255,255,255,0.1)'
          : 'transparent',
      },
    };

    return baseColors[variant] || baseColors.default;
  };

  const colors = getVariantColors();

  return (
    <View
      style={[
        {
          borderRadius,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: variant === 'focused' ? 0 : 1.5,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          overflow: 'hidden',
          position: 'relative',
        },
        style,
      ]}>
      {/* Gloss overlay */}
      {!disableGloss && (
        <LinearGradient
          colors={colors.gradient}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60%',
            borderRadius: borderRadius - 1,
            opacity: 0.8,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      )}

      {/* Lens effect */}
      {!disableLens && (
        <View
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            right: 2,
            bottom: 2,
            borderRadius: borderRadius - 2,
            backgroundColor: colors.lens,
            opacity: 0.3,
          }}
        />
      )}

      {/* Content */}
      <View
        style={[
          {
            position: 'relative',
            zIndex: 10,
            flex: 1,
          },
          contentStyle,
        ]}>
        {children}
      </View>
    </View>
  );
};

export default GlassEffectContainer;
