import React from 'react';
import { View, Text, Modal } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';
import LoadingSpinner from '../LoadingSpinner';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  size?: number;
  transparent?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
  size = 32,
  transparent = false,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: transparent ? colors.overlay.light : colors.overlay.dark,
        }}>
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: 32,
            alignItems: 'center',
            minWidth: 160,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
          }}>
          <LoadingSpinner size={size} color={colors.primary} />

          {message && (
            <Text
              style={{
                marginTop: 16,
                fontSize: 16,
                color: colors.foreground,
                textAlign: 'center',
                ...TEXT_STYLES.medium,
              }}>
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default LoadingOverlay;
