import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';
import UserDisplay from '../UserDisplay';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  photo?: {
    id: string;
    path: string;
  } | null;
  role?: {
    id: string;
    name: string;
  };
}

interface UserListItemProps {
  user: User;
  onPress?: (user: User) => void;
  selected?: boolean;
  showRole?: boolean;
  showCheckbox?: boolean;
  rightElement?: React.ReactNode;
  variant?: 'default' | 'selectable' | 'removable';
  disabled?: boolean;
  containerStyle?: object;
}

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  onPress,
  selected = false,
  showRole = false,
  showCheckbox = false,
  rightElement,
  variant = 'default',
  disabled = false,
  containerStyle,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || user.email;

  const getBackgroundColor = () => {
    if (selected) {
      return isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)';
    }
    return 'transparent';
  };

  const getBorderColor = () => {
    if (selected) {
      return isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)';
    }
    return 'transparent';
  };

  const renderCheckbox = () => {
    if (!showCheckbox && variant !== 'selectable') return null;

    return (
      <View className="mr-3">
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: selected ? colors.primary : colors.grey3,
            backgroundColor: selected ? colors.primary : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {selected && <Ionicons name="checkmark" size={12} color="white" />}
        </View>
      </View>
    );
  };

  const renderRightElement = () => {
    if (rightElement) {
      return <View className="ml-3">{rightElement}</View>;
    }

    if (variant === 'removable') {
      return (
        <TouchableOpacity className="ml-3 p-2" onPress={() => onPress?.(user)}>
          <Ionicons name="remove-circle" size={20} color={colors.destructive} />
        </TouchableOpacity>
      );
    }

    return null;
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress(user);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || !onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
          backgroundColor: getBackgroundColor(),
          borderWidth: selected ? 1 : 0,
          borderColor: getBorderColor(),
          opacity: disabled ? 0.5 : 1,
        },
        containerStyle,
      ]}
      activeOpacity={0.7}>
      {/* Checkbox */}
      {renderCheckbox()}

      {/* Avatar */}
      <View className="mr-3">
        <UserDisplay user={user} size="medium" />
      </View>

      {/* User Info */}
      <View className="flex-1">
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.foreground,
            ...TEXT_STYLES.semibold,
          }}>
          {displayName}
        </Text>

        {user.email !== displayName && (
          <Text
            style={{
              fontSize: 14,
              color: colors.grey2,
              ...TEXT_STYLES.regular,
              marginTop: 2,
            }}>
            {user.email}
          </Text>
        )}

        {showRole && user.role && (
          <Text
            style={{
              fontSize: 12,
              color: colors.grey3,
              ...TEXT_STYLES.regular,
              marginTop: 2,
            }}>
            {user.role.name}
          </Text>
        )}
      </View>

      {/* Right Element */}
      {renderRightElement()}
    </TouchableOpacity>
  );
};

export default UserListItem;
