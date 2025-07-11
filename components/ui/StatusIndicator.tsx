import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'sent' | 'delivered' | 'read';
  size?: 'small' | 'medium' | 'large';
  position?: 'absolute' | 'inline';
  style?: object;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'medium',
  position = 'absolute',
  style,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { width: 10, height: 10, iconSize: 8 };
      case 'large':
        return { width: 16, height: 16, iconSize: 12 };
      default:
        return { width: 14, height: 14, iconSize: 10 };
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          backgroundColor: colors.status.online,
          icon: null,
        };
      case 'away':
        return {
          backgroundColor: colors.status.away,
          icon: null,
        };
      case 'offline':
        return {
          backgroundColor: colors.status.offline,
          icon: null,
        };
      case 'sent':
        return {
          backgroundColor: colors.transparent,
          icon: 'checkmark' as keyof typeof Ionicons.glyphMap,
          iconColor: colors.status.messageIcon,
        };
      case 'delivered':
        return {
          backgroundColor: colors.transparent,
          icon: 'checkmark-done' as keyof typeof Ionicons.glyphMap,
          iconColor: colors.status.messageIcon,
        };
      case 'read':
        return {
          backgroundColor: colors.transparent,
          icon: 'checkmark-done' as keyof typeof Ionicons.glyphMap,
          iconColor: colors.status.online,
        };
      default:
        return {
          backgroundColor: colors.status.offline,
          icon: null,
        };
    }
  };

  const sizeConfig = getSizeConfig();
  const statusConfig = getStatusConfig();

  const containerStyle = {
    width: sizeConfig.width,
    height: sizeConfig.height,
    borderRadius: sizeConfig.width / 2,
    backgroundColor: statusConfig.backgroundColor,
    borderWidth: 2,
    borderColor: colors.card,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    ...(position === 'absolute' && {
      position: 'absolute' as const,
      bottom: -1,
      right: -1,
    }),
    ...style,
  };

  if (statusConfig.icon) {
    return (
      <View style={containerStyle}>
        <Ionicons
          name={statusConfig.icon}
          size={sizeConfig.iconSize}
          color={statusConfig.iconColor}
        />
      </View>
    );
  }

  return <View style={containerStyle} />;
};

export default StatusIndicator;
