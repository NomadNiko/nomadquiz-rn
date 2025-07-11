import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';

interface ModalContainerProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  variant?: 'overlay' | 'pageSheet';
  showCloseButton?: boolean;
  children: React.ReactNode;
  scrollable?: boolean;
  maxHeight?: number;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  visible,
  onClose,
  title,
  variant = 'overlay',
  showCloseButton = true,
  children,
  scrollable = false,
  maxHeight,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const renderOverlayModal = () => (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.overlay.dark,
          padding: 24,
        }}>
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: 32,
            width: '100%',
            maxWidth: 400,
            maxHeight: maxHeight || '80%',
          }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '600',
                color: colors.foreground,
                ...TEXT_STYLES.semibold,
                flex: 1,
              }}>
              {title}
            </Text>
            {showCloseButton && (
              <TouchableOpacity onPress={onClose} style={{ padding: 4, marginLeft: 16 }}>
                <Ionicons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          {scrollable ? (
            <ScrollView style={{ maxHeight: maxHeight ? maxHeight - 120 : undefined }}>
              {children}
            </ScrollView>
          ) : (
            children
          )}
        </View>
      </View>
    </Modal>
  );

  const renderPageSheetModal = () => (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.grey4,
          }}>
          {showCloseButton && (
            <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          )}

          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.foreground,
              ...TEXT_STYLES.semibold,
              flex: 1,
              textAlign: showCloseButton ? 'center' : 'left',
              marginRight: showCloseButton ? 40 : 0,
            }}>
            {title}
          </Text>
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          {scrollable ? <ScrollView style={{ flex: 1 }}>{children}</ScrollView> : children}
        </View>
      </SafeAreaView>
    </Modal>
  );

  return variant === 'pageSheet' ? renderPageSheetModal() : renderOverlayModal();
};

export default ModalContainer;
