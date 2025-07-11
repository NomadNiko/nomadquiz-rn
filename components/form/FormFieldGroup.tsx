import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';

interface FormFieldGroupProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: object;
  inputStyle?: object;
}

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  secureTextEntry: propSecureTextEntry = false,
  showPasswordToggle = false,
  leftIcon,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const shouldShowSecureText = propSecureTextEntry && !isPasswordVisible;
  const shouldShowToggle = showPasswordToggle || propSecureTextEntry;

  const getInputPadding = () => {
    const baseLeft = leftIcon ? 44 : 12;
    const baseRight = shouldShowToggle ? 44 : 12;

    return {
      paddingLeft: baseLeft,
      paddingRight: baseRight,
    };
  };

  return (
    <View style={[{ gap: 8 }, containerStyle]}>
      {/* Label */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          color: colors.foreground,
          ...TEXT_STYLES.medium,
        }}>
        {label}
        {required && <Text style={{ color: colors.destructive }}> *</Text>}
      </Text>

      {/* Input Container */}
      <View style={{ position: 'relative' }}>
        {/* Left Icon */}
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

        {/* Text Input */}
        <TextInput
          style={[
            {
              height: 44,
              borderWidth: 1,
              borderColor: error ? colors.destructive : colors.grey4,
              borderRadius: 8,
              fontSize: 16,
              color: colors.foreground,
              backgroundColor: colors.background,
              textAlignVertical: 'center',
              ...TEXT_STYLES.regular,
              ...getInputPadding(),
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.grey2}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={shouldShowSecureText}
          keyboardAppearance={isDark ? 'dark' : 'light'}
          {...textInputProps}
        />

        {/* Password Toggle */}
        {shouldShowToggle && (
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
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={18} color={colors.grey2} />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
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

export default FormFieldGroup;
