import React from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TEXT_STYLES } from '../../theme/fonts';
import LoadingSpinner from '../LoadingSpinner';

interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  onClear?: () => void;
  showClearButton?: boolean;
  containerStyle?: object;
  inputStyle?: object;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  isLoading = false,
  onClear,
  showClearButton = true,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? COLORS.dark : COLORS.light;

  const handleClear = () => {
    onChangeText('');
    if (onClear) {
      onClear();
    }
  };

  const shouldShowClear = showClearButton && value.length > 0 && !isLoading;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
        },
        containerStyle,
      ]}>
      {/* Search Icon */}
      <View
        style={{
          position: 'absolute',
          left: 12,
          zIndex: 10,
          justifyContent: 'center',
          alignItems: 'center',
          width: 20,
          height: '100%',
        }}>
        <Ionicons name="search" size={18} color={colors.grey2} />
      </View>

      {/* Text Input */}
      <TextInput
        style={[
          {
            flex: 1,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.grey4,
            backgroundColor: colors.background,
            paddingLeft: 44,
            paddingRight: shouldShowClear || isLoading ? 44 : 16,
            fontSize: 16,
            color: colors.foreground,
            ...TEXT_STYLES.regular,
          },
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.grey2}
        value={value}
        onChangeText={onChangeText}
        keyboardAppearance={isDark ? 'dark' : 'light'}
        returnKeyType="search"
        clearButtonMode="never" // We handle clear button manually
        {...textInputProps}
      />

      {/* Right Element - Loading or Clear Button */}
      <View
        style={{
          position: 'absolute',
          right: 12,
          justifyContent: 'center',
          alignItems: 'center',
          width: 20,
          height: '100%',
        }}>
        {isLoading ? (
          <LoadingSpinner size={16} color={colors.grey2} />
        ) : shouldShowClear ? (
          <TouchableOpacity
            onPress={handleClear}
            style={{
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              backgroundColor: colors.grey3,
            }}>
            <Ionicons name="close" size={12} color={colors.background} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default SearchInput;
