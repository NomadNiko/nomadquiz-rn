import React from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: 'default' | 'password' | 'search';
  containerStyle?: object;
  inputStyle?: object;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const getInputHeight = () => {
    switch (variant) {
      case 'search':
        return 40;
      default:
        return 44;
    }
  };

  const getInputPadding = () => {
    const baseLeft = leftIcon ? 44 : 12;
    const baseRight = rightIcon ? 44 : 12;

    return {
      paddingLeft: baseLeft,
      paddingRight: baseRight,
    };
  };

  return (
    <View style={[{ gap: 8 }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: colors.foreground,
            ...TEXT_STYLES.medium,
          }}>
          {label}
        </Text>
      )}

      <View style={{ position: 'relative' }}>
        {leftIcon && (
          <View
            style={{
              position: 'absolute',
              left: 12,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              width: 20,
              zIndex: 10,
            }}>
            <Ionicons name={leftIcon} size={18} color={colors.grey2} />
          </View>
        )}

        <TextInput
          style={[
            {
              height: getInputHeight(),
              borderWidth: 1,
              borderColor: error ? colors.destructive : colors.grey4,
              borderRadius: variant === 'search' ? 20 : 8,
              fontSize: 16,
              color: colors.foreground,
              backgroundColor: colors.background,
              textAlignVertical: 'center',
              ...TEXT_STYLES.regular,
              ...getInputPadding(),
            },
            inputStyle,
          ]}
          placeholderTextColor={colors.grey2}
          keyboardAppearance={isDark ? 'dark' : 'light'}
          {...textInputProps}
        />

        {rightIcon && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 12,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              width: 20,
            }}
            onPress={onRightIconPress}>
            <Ionicons name={rightIcon} size={18} color={colors.grey2} />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          style={{
            fontSize: 12,
            color: colors.destructive,
            ...TEXT_STYLES.regular,
          }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default FormInput;
