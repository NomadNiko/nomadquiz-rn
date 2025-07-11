import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';

interface User {
  firstName?: string;
  lastName?: string;
  email: string;
}

interface WelcomeHeaderProps {
  title: string;
  user?: User | null;
  subtitle?: string;
  customSubtitle?: string;
  showWelcome?: boolean;
  titleStyle?: object;
  subtitleStyle?: object;
  style?: ViewStyle;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  title,
  user,
  subtitle,
  customSubtitle,
  showWelcome = true,
  titleStyle,
  subtitleStyle,
  style,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const getUserDisplayName = () => {
    if (!user) return 'User';

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    if (user.firstName) {
      return user.firstName;
    }

    if (user.lastName) {
      return user.lastName;
    }

    return user.email;
  };

  const getSubtitleText = () => {
    if (customSubtitle) {
      return customSubtitle;
    }

    if (subtitle) {
      return subtitle;
    }

    if (showWelcome && user) {
      return `Welcome back, ${getUserDisplayName()}!`;
    }

    return undefined;
  };

  const subtitleText = getSubtitleText();

  return (
    <View style={style}>
      <Text
        className="font-bold text-2xl"
        style={[
          {
            color: colors.foreground,
            ...TEXT_STYLES.bold,
          },
          titleStyle,
        ]}>
        {title}
      </Text>

      {subtitleText && (
        <Text
          className="text-sm"
          style={[
            {
              color: colors.grey,
              ...TEXT_STYLES.regular,
            },
            subtitleStyle,
          ]}>
          {subtitleText}
        </Text>
      )}
    </View>
  );
};

export default WelcomeHeader;
