/**
 * UserDisplay Component
 *
 * Display user photo or initials in a circle
 * Similar to how nextjs-client handles user display
 */
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../theme/colors';

interface UserDisplayProps {
  /** User object with name and photo information */
  user?: { 
    firstName?: string; 
    lastName?: string;
    username?: string;
    email?: string;
    photo?: {
      id: string;
      path: string;
    } | null;
  } | null;
  /** Size of the display circle */
  size?: 'small' | 'medium' | 'large';
  /** Whether the display is clickable */
  onPress?: () => void;
  /** Additional style classes */
  className?: string;
}

export default function UserDisplay({
  user,
  size = 'medium',
  onPress,
  className = '',
}: UserDisplayProps) {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  // Size mapping for containers
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-20 h-20',
  };

  // Size mapping for icons
  const iconSizes = {
    small: 16,
    medium: 24,
    large: 40,
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-base',
    large: 'text-2xl',
  };

  const Component = onPress ? TouchableOpacity : View;

  // Get user initials
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.lastName) {
      return user.lastName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  };

  const backgroundColor = isDark ? colors.card : colors.grey2;

  return (
    <Component
      className={`${sizeClasses[size]} items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{
        backgroundColor,
      }}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      {user?.photo?.path ? (
        <Image
          source={{ uri: user.photo.path }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 1000,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          className={`${sizeClasses[size]} items-center justify-center rounded-full`}
          style={{ backgroundColor }}>
          {user ? (
            <Text 
              className={`${textSizeClasses[size]} font-bold`} 
              style={{ color: colors.foreground }}
            >
              {getInitials()}
            </Text>
          ) : (
            <Ionicons
              name="person"
              size={iconSizes[size]}
              color={colors.foreground}
            />
          )}
        </View>
      )}
    </Component>
  );
}