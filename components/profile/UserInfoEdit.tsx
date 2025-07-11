import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { TEXT_STYLES } from '../../theme/fonts';

interface UserInfoEditProps {
  editFirstName: string;
  editLastName: string;
  editUsername: string;
  saving: boolean;
  colors: {
    foreground: string;
    grey: string;
    primary: string;
  };
  isDark: boolean;
  onFirstNameChange: (text: string) => void;
  onLastNameChange: (text: string) => void;
  onUsernameChange: (text: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function UserInfoEdit({
  editFirstName,
  editLastName,
  editUsername,
  saving,
  colors,
  isDark,
  onFirstNameChange,
  onLastNameChange,
  onUsernameChange,
  onCancel,
  onSave
}: UserInfoEditProps) {
  const inputStyle = {
    color: colors.foreground,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    ...TEXT_STYLES.regular
  };

  return (
    <View className="w-full max-w-xs">
      {/* First Name */}
      <View className="mb-4">
        <Text
          className="mb-2 font-medium text-sm"
          style={{ color: colors.foreground, ...TEXT_STYLES.medium }}>
          First Name
        </Text>
        <TextInput
          value={editFirstName}
          onChangeText={onFirstNameChange}
          placeholder="Enter first name"
          placeholderTextColor={colors.grey}
          className="p-3 rounded-lg border"
          style={inputStyle}
        />
      </View>

      {/* Last Name */}
      <View className="mb-4">
        <Text
          className="mb-2 font-medium text-sm"
          style={{ color: colors.foreground, ...TEXT_STYLES.medium }}>
          Last Name
        </Text>
        <TextInput
          value={editLastName}
          onChangeText={onLastNameChange}
          placeholder="Enter last name"
          placeholderTextColor={colors.grey}
          className="p-3 rounded-lg border"
          style={inputStyle}
        />
      </View>

      {/* Username */}
      <View className="mb-6">
        <Text
          className="mb-2 font-medium text-sm"
          style={{ color: colors.foreground, ...TEXT_STYLES.medium }}>
          Username
        </Text>
        <TextInput
          value={editUsername}
          onChangeText={onUsernameChange}
          placeholder="Enter username"
          placeholderTextColor={colors.grey}
          autoCapitalize="none"
          className="p-3 rounded-lg border"
          style={inputStyle}
        />
      </View>

      {/* Action Buttons */}
      <View className="flex-row space-x-3">
        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 flex-row items-center justify-center px-4 py-3 rounded-xl"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderColor: colors.grey,
            borderWidth: 1,
          }}
        >
          <Text
            className="font-semibold text-base"
            style={{ color: colors.foreground, ...TEXT_STYLES.semibold }}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSave}
          disabled={saving}
          className="flex-1 flex-row items-center justify-center px-4 py-3 rounded-xl"
          style={{ backgroundColor: saving ? colors.grey : colors.primary }}
        >
          <Text
            className="font-semibold text-base"
            style={{ color: 'white', ...TEXT_STYLES.semibold }}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}