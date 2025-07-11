import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'primary';
  isDark: boolean;
  style?: ViewStyle;
  className?: string;
}

const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  variant = 'default',
  isDark: propIsDark,
  style,
  className,
}) => {
  const { isDark: contextIsDark } = useTheme();
  const isDark = propIsDark !== undefined ? propIsDark : contextIsDark;
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const getVariantColors = () => {
    switch (variant) {
      case 'destructive':
        return {
          background: isDark ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.08)',
          border: isDark ? 'rgba(220, 38, 38, 0.4)' : 'rgba(220, 38, 38, 0.3)',
          gradient: isDark
            ? ['rgba(220, 38, 38, 0.4)', 'rgba(220, 38, 38, 0.15)', 'transparent']
            : ['rgba(220, 38, 38, 0.3)', 'rgba(220, 38, 38, 0.08)', 'transparent'],
          lens: isDark ? 'rgba(220, 38, 38, 0.08)' : 'rgba(220, 38, 38, 0.04)',
        };
      case 'success':
        return {
          background: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)',
          border: isDark ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)',
          gradient: isDark
            ? ['rgba(34, 197, 94, 0.4)', 'rgba(34, 197, 94, 0.15)', 'transparent']
            : ['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.08)', 'transparent'],
          lens: isDark ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.04)',
        };
      case 'primary':
        return {
          background: isDark ? 'rgba(30, 58, 138, 0.15)' : 'rgba(30, 58, 138, 0.08)',
          border: isDark ? 'rgba(30, 58, 138, 0.4)' : 'rgba(30, 58, 138, 0.3)',
          gradient: isDark
            ? ['rgba(30, 58, 138, 0.4)', 'rgba(30, 58, 138, 0.15)', 'transparent']
            : ['rgba(30, 58, 138, 0.3)', 'rgba(30, 58, 138, 0.08)', 'transparent'],
          lens: isDark ? 'rgba(30, 58, 138, 0.08)' : 'rgba(30, 58, 138, 0.04)',
        };
      default:
        return {
          background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.20)',
          border: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)',
          gradient: isDark
            ? ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)', 'transparent']
            : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'transparent'],
          lens: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
        };
    }
  };

  const colors = getVariantColors();

  return (
    <View
      className={className}
      style={[
        {
          borderRadius: 12,
          padding: 16,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1.5,
          shadowColor: '#000',
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
      <LinearGradient
        colors={colors.gradient}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60%',
          borderRadius: 12,
          opacity: 0.8,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Lens effect */}
      <View
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          right: 2,
          bottom: 2,
          borderRadius: 10,
          backgroundColor: colors.lens,
          opacity: 0.3,
        }}
      />

      {/* Content */}
      <View style={{ position: 'relative', zIndex: 10 }}>{children}</View>
    </View>
  );
};

export default LiquidGlassCard;
